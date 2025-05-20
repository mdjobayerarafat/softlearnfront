// apps/web/services/utils/network.ts
export async function checkAPIConnection(apiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl, {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    // @ts-ignore
      console.error(`API Connection Error: ${error.message}`);
    return false;
  }
}

export function getIPv4APIUrl(url: string): string {
  return url.replace('::1', '127.0.0.1');
}