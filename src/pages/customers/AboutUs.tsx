import Header from '../../components/customers/Header';
import Footer from '../../components/customers/Footer';
import { FaGlobe, FaMobile, FaPlayCircle } from 'react-icons/fa';
import { FaBoltLightning, FaCube, FaTruck } from 'react-icons/fa6';
import SEO from '../../middlewares/SEO';

const About = () => {
  const benefits = [
    {
      icon: <FaGlobe className="w-8 h-8 text-primary-600" />,
      text: 'Boost your shop’s visibility online',
    },
    {
      icon: <FaMobile className="w-8 h-8 text-primary-600" />,
      text: 'Mobile payment ready (MTN, Airtel Money)',
    },
    {
      icon: <FaBoltLightning className="w-8 h-8 text-primary-600" />,
      text: 'Responsive & user-friendly on all devices',
    },
    {
      icon: <FaTruck className="w-8 h-8 text-primary-600" />,
      text: 'Reliable local delivery system',
    },
    {
      icon: <FaCube className="w-8 h-8 text-primary-600" />,
      text: 'Support for digital and physical products',
    },
    {
      icon: (
        <img
          src="/images/rwanda-flag.svg"
          className="w-8 h-8"
          alt="Rwandan flag"
        />
      ),
      text: 'Designed for Rwandan communities',
    },
  ];

  return (
    <>
      <SEO
        title="About us - Kickside Store"
        description="Kickside is a Rwandan-built digital marketplace that connects sellers and buyers, simplifies transactions, and strengthens local commerce. Join us and start selling today!"
        keywords="Kickside, Rwandan marketplace, e-commerce, online shopping, local commerce"
        ogUrl={window.location.href}
      />
      <Header />
      <section className="bg-gradient-to-b from-primary-50 to-white text-gray-800 px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center pt-8">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold text-primary-600 bg-primary-100 rounded-full">
              Made in Rwanda
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600">
                Welcome to Kickside
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              A Rwandan-built digital marketplace bridging sellers and buyers,
              simplifying transactions, and strengthening local commerce.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full md:w-4/5 aspect-video relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-xl transform rotate-1 -z-10"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl h-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Kickside Overview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300">
                  <FaPlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gray-100 p-6 rounded-2xl shadow-inner">
                <img
                  src="/how-it-works.png"
                  alt="Marketplace illustration"
                  className="rounded-xl w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900">
                How <span className="text-primary-600">Kickside</span> Works
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1 bg-primary-100 p-2 rounded-lg">
                    <span className="text-primary-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">For Sellers</h3>
                    <p className="text-gray-700">
                      Register, upload product listings, and manage inventory
                      with our intuitive dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1 bg-primary-100 p-2 rounded-lg">
                    <span className="text-primary-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">For Buyers</h3>
                    <p className="text-gray-700">
                      Browse by category, view detailed products, and place
                      orders with secure payments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1 bg-primary-100 p-2 rounded-lg">
                    <span className="text-primary-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Behind the Scenes
                    </h3>
                    <p className="text-gray-700">
                      We handle payments, inventory syncing, and notify sellers
                      in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1 bg-primary-100 p-2 rounded-lg">
                    <span className="text-primary-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                    <p className="text-gray-700">
                      Products delivered via trusted logistics partners right to
                      your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Why Choose <span className="text-primary-600">Kickside</span>?
              </h2>
              <p className="text-gray-600 mt-4">
                We're transforming Rwandan e-commerce with solutions built for
                local needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-white to-primary-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-4">
                    {benefit.icon}
                    <p className="font-medium text-gray-900">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Experience <span className="text-primary-600">Kickside</span>
              </h2>
              <p className="text-gray-600 mt-4">
                See our platform in action through these key screens
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {['homepage.png', 'product-view.png', 'checkout.png'].map(
                (img, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl transform rotate-2 -z-10"></div>
                    <img
                      src={`/images/${img}`}
                      alt={`Screenshot ${i + 1}`}
                      className="rounded-xl shadow-lg object-cover w-full h-64 transition-transform duration-500 group-hover:scale-102"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Join Rwanda's E-commerce Revolution?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8">
              Thousands of sellers and buyers are already transforming their
              business with Kickside
            </p>
            <a
              href="https://shop.kickside.rw"
              className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
            >
              Visit Kickside Shop
            </a>
          </div>

          <div className="text-center max-w-3xl mx-auto py-8">
            <blockquote className="text-xl md:text-2xl font-light text-gray-700 italic mb-6">
              “Kickside is not just a platform — it's a digital movement to
              uplift Rwandan sellers and empower every buyer.”
            </blockquote>
            <div className="h-1 w-24 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-gray-600">
              Join the future of local commerce at{' '}
              <span className="font-semibold text-primary-600">
                shop.kickside.rw
              </span>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
