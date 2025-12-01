import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  admin as adminPlugin,
  anonymous as anonymousPlugin,
  bearer as bearerPlugin,
  jwt as jwtPlugin,
  multiSession as multiSessionPlugin,
  openAPI as openAPIPlugin,
  username as usernamePlugin,
} from 'better-auth/plugins';

import { env } from '@/config/env';
import { UserRole } from '@/generated/prisma/enums';
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
                role: UserRole.admin,
              },
            };
          }

          return {
            data: {
              ...user,
              role: UserRole.user,
            },
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
        type: 'string',
        defaultValue: UserRole.user,
      },
    },
  },
});
