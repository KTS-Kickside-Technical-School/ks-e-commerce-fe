import Logo from '/logo.png';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Kickside E-Commerce Rw: One stop for shopping various products.',
  description = 'Kickside E-Commerce',
  keywords = 'Shopping, Electronic devices',
  author = 'Kickside E-Commerce Rwanda',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = Logo,
  twitterCreator = '@kickside_rw',
  canonicalUrl,
}: any) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ogType,
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: `${author}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kickside E-Commerce Rwanda',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.svg',
      },
    },
    mainEntityOfPage: window.location.href,
    image: ogImage || '/logo.svg',
  };
  const isStaffRoute =
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/login');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || '/default-image.jpg'} />
      <meta property="og:url" content={ogUrl || window.location.href} />
      <meta property="og:type" content={ogType} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || '/default-image.jpg'} />
      <meta name="twitter:creator" content={twitterCreator} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {isStaffRoute && (
        <>
          <meta name="robots" content="noindex, nofollow" />
        </>
      )}
    </Helmet>
  );
};

export default SEO;
