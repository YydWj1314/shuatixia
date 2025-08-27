/**
 * Fetcher function for SWR
 * Default GET request
 * @param url
 * @returns
 */
export const globalFetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('[SWR fetcher]: error occurred while fetching the data');
  }
  return res.json();
};
