import Header from '../../components/customers/Header';
import Hero from '../../components/customers/Hero';
import Products from '../../components/customers/products/Products';
import Footer from '../../components/customers/Footer';
import SEO from '../../middlewares/SEO';

const HomePage = () => {
  return (
    <div className="">
      <SEO
        title="Home - Kickside Store"
        description="Welcome to our online store. Explore our latest products and offers."
      />
      <Header />
      <Hero />
      <Products
        title="New arrivals"
        link={{ text: 'See more', location: '/see-more' }}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
