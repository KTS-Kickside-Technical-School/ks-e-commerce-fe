import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/products', changefreq: 'weekly', priority: 0.8 },
  { url: '/shops', changefreq: 'weekly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 }
];

const hostname = 'https://shop.kickside.rw';

const stream = new SitemapStream({ hostname });

streamToPromise(Readable.from(links).pipe(stream))
  .then((data) => {
    const file = createWriteStream('public/sitemap.xml');
    file.write(data.toString());
    file.end();
    console.log('✅ sitemap.xml generated.');
  })
  .catch((err) => {
    console.error('❌ Failed to generate sitemap:', err);
  });
