import { config } from '../config/env';

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${config.apiUrl}${path}`;
}; 