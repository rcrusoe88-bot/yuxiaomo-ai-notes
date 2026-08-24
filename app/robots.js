export const dynamic = 'force-static';

import { absoluteFileUrl } from '../lib/site';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteFileUrl('/sitemap.xml'),
    host: 'rcrusoe88-bot.github.io'
  };
}
