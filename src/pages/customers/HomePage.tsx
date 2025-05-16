import Header from '../../components/customers/Header';
import Hero from '../../components/customers/Hero';
import Products from '../../components/customers/products/Products';
import Footer from '../../components/customers/Footer';

const HomePage = () => {
  return (
    <div className="">
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
