import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  username as usernamePlugin,
  anonymous as anonymousPlugin,
  admin as adminPlugin,
  bearer as bearerPlugin,
  multiSession as multiSessionPlugin,
  openAPI as openAPIPlugin,
  jwt as jwtPlugin,
} from 'better-auth/plugins';
import { betterAuth } from 'better-auth';

import { env } from '@/config/env';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  appName: 'docsboxs-api',
  advanced: {
    database: {
      generateId: false,
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails = env.ADMIN_EMAILS.includes(user.email);

          if (adminEmails) {
            return {
              data: {
                ...user,
                role: 'admin',
              },
            };
          }

          return {
            data: user,
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  plugins: [
    adminPlugin({
      adminRoles: ['admin'],
      defaultRole: 'user',
    }),
    anonymousPlugin(),
    bearerPlugin(),
    jwtPlugin(),
    multiSessionPlugin(),
    openAPIPlugin(),
    usernamePlugin(),
  ],
  secret: env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 3,
  },
  trustedOrigins: env.CORS_ORIGINS,
  user: {
    additionalFields: {
      role: {
        type: ['user', 'admin'],
        defaultValue: 'user',
      },
    },
  },
});
