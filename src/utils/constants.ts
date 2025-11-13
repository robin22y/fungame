export const BASE_URL = 'https://digiget.org';

export const getTagUrl = (tagUid: string): string => {
  return `${BASE_URL}/tag/${tagUid}`;
};

export const migrateTagUrl = (url: string): string => {
  return url
    .replace(/https?:\/\/[^/]*netlify\.app/i, BASE_URL)
    .replace(/https?:\/\/fungame\.netlify\.app/i, BASE_URL)
    .replace(/https?:\/\/localhost:\d+/i, BASE_URL);
};
