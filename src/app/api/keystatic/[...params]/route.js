import { makeRouteHandler } from '@keystatic/next/route-handler';
// import config from '@keystatic/config';
import config from '../../../../../keystatic.config.js';

console.log('CLIENT_ID =', process.env.KEYSTATIC_GITHUB_CLIENT_ID);
console.log('CLIENT_SECRET exists =', !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET);
console.log('SECRET exists =', !!process.env.KEYSTATIC_SECRET);
console.log(
  'KEYSTATIC CLIENT ID:',
  process.env.KEYSTATIC_GITHUB_CLIENT_ID
);

console.log(
  'KEYSTATIC SECRET LENGTH:',
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET?.length
);

export const { GET, POST } = makeRouteHandler({
  config,
});
