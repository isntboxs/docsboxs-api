import * as HttpStatusCodes from '@/constants/http-status-codes';
import * as HttpStatusPhrases from '@/constants/http-status-phrases';

// Create the map once at module level
const statusMap: Record<number, string> = {};
Object.entries(HttpStatusCodes).forEach(([key, value]) => {
  statusMap[value] = HttpStatusPhrases[key as keyof typeof HttpStatusPhrases];
});

export const getStatusPhrases = (statusCode: number): string => {
  return statusMap[statusCode] ?? 'UNKNOWN STATUS';
};
