import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Kickside Shop Rw: One stop for shopping various products.',
  description = 'Kickside Shop Rw is your one-stop destination for shopping a wide range of products, including electronics, fashion, home appliances, and more. Enjoy secure online shopping with fast delivery across Rwanda. Shop now for the best deals and quality products.',
  keywords = 'Shopping, Electronic devices',
  author = 'Kickside E-Commerce Rwanda',
  ogTitle,
  ogDescription = description,
  ogImage = 'https://store.kickside.rw/logo.png',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterCreator = '@kickside_rw',
  canonicalUrl= window.location.href,
}: {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const fullOgImageUrl = ogImage.startsWith('http')
    ? ogImage
    : `https://store.kickside.rw/logo.png`;
  const fullOgUrl = ogUrl || currentUrl;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ogType,
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kickside E-Commerce Rwanda',
      logo: {
        '@type': 'ImageObject',
        url: 'https://store.kickside.rw/logo.png',
      },
    },
    mainEntityOfPage: currentUrl,
    image: fullOgImageUrl,
  };

  const isStaffRoute =
    typeof window !== 'undefined' &&
    (location.pathname.startsWith('/seller') ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/dashboard') ||
      location.pathname.startsWith('/login'));

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:site" content={twitterCreator} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      {isStaffRoute && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEO;
