import Header from '../../components/customers/Header';
import Hero from '../../components/customers/Hero';
import Products from '../../components/customers/products/Products';
import Footer from '../../components/customers/Footer';
import SEO from '../../middlewares/SEO';

const HomePage = () => {
  return (
    <div className="">
      <SEO
        title="Home of Best Electronic devices, Home decor materials, Kitchen Equipments.
        The first E-Commerce Digital Marketplace in Rwanda and East Africa. Order one and get your pocket shortly.  - Kickside Shop"
        description="Welcome to our online store. Explore our latest products and offers."
      />
      <Header />
      <Hero />
      <Products
        title="New arrivals"
        limit={40}
        link={{ text: 'See more', location: '/category/All' }}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
