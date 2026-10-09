import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config.js';

export const { GET, POST } = makeRouteHandler({
  config,
});
