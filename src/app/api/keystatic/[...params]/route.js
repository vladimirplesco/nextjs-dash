import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config.js';

console.log('CLIENT_ID =', process.env.KEYSTATIC_GITHUB_CLIENT_ID);
console.log(
  'CLIENT_SECRET exists =',
  !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET
);
console.log('SECRET exists =', !!process.env.KEYSTATIC_SECRET);
console.log(
  'KEYSTATIC SECRET LENGTH:',
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET?.length
);

// ---------------------------------------------------------------------
// TEMP DEBUG: перехватываем только GitHub OAuth token request
// ---------------------------------------------------------------------
const originalFetch = globalThis.fetch;

globalThis.fetch = async (...args) => {
  const response = await originalFetch(...args);

  try {
    const request = args[0];
    const requestUrl =
      typeof request === 'string' ? request : request?.url;

    if (requestUrl === 'https://github.com/login/oauth/access_token') {
      const clone = response.clone();

      let data = null;

      try {
        data = await clone.json();
      } catch {
        console.log('[Keystatic DEBUG] GitHub token response is not JSON');
      }

      console.log(
        '[Keystatic DEBUG] GitHub token response status =',
        response.status
      );

      if (data && typeof data === 'object') {
        console.log(
          '[Keystatic DEBUG] GitHub token response fields =',
          Object.keys(data)
        );

        console.log(
          '[Keystatic DEBUG] GitHub token response error =',
          data.error ?? null
        );

        console.log(
          '[Keystatic DEBUG] GitHub token response error_description =',
          data.error_description ?? null
        );

        console.log(
          '[Keystatic DEBUG] GitHub token response error_uri =',
          data.error_uri ?? null
        );
      }
    }
  } catch (error) {
    console.log(
      '[Keystatic DEBUG] fetch inspection error =',
      error?.message
    );
  }

  return response;
};

export const { GET, POST } = makeRouteHandler({
  config,
});