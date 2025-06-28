import { useState } from 'react';
import Header from '../../../../components/customers/Header';
import Footer from '../../../../components/customers/Footer';
import SEO from '../../../../middlewares/SEO';

const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'Browse products, add them to your cart, and complete the checkout process. You will receive a confirmation email with the delivery timeline.',
  },
  {
    question: 'What payment methods do you support?',
    answer:
      'We currently support Mobile Money (MTN/Airtel), Visa/MasterCard, and direct bank transfer.',
  },
  {
    question: 'Can I return a product?',
    answer:
      'Yes, you can return a product within 7 days after delivery as long as it’s unused and in its original packaging.',
  },
  {
    question: 'How do I report an issue or abuse?',
    answer:
      'Use the "Report Abuse" form located in your account settings or at the bottom of every product page.',
  },
  {
    question: 'Do you offer live chat support?',
    answer:
      'Yes, you can start a live chat with one of our agents by clicking the chat icon at the bottom-right of the page (9AM - 6PM).',
  },
  {
    question: 'Where can I find my order history?',
    answer:
      'Log into your account and navigate to the "Orders" section to view your purchase history.',
  },
];

export default function HelpCenter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert('Thank you for your question! We’ll get back to you soon.');
  };

  return (
    <>
      <SEO
        title="Help Center - Kickside Store"
        description="Get answers to common questions, find help, report abuse, or chat live with our support team at Kickside Store. We’re here to assist you with orders, payments, returns, and more."
        keywords="Help Center, Kickside Store Support, FAQs, Live Chat, Report Abuse, Ask Questions, Shopping Help, Customer Service"
      />

      <Header />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary-500 mb-3">
            Help Center
          </h1>
          <p className="text-gray-600 text-lg">
            Need assistance? We’ve got answers to the most common questions.
            Can’t find what you’re looking for? Just ask—we’re happy to help!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 bg-primary-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-primary-500 mb-6">
              Frequently Asked Questions
            </h2>
            <ul className="space-y-5">
              {faqs.map((faq, i) => (
                <li key={i}>
                  <details className="bg-white rounded-lg p-4 border border-primary-500 shadow-sm">
                    <summary className="cursor-pointer font-medium text-primary-500">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/3">
            <h2 className="text-2xl font-bold text-primary-500 mb-4">
              Ask Your Own Question
            </h2>
            <p className="text-gray-600 mb-6">
              Didn’t find what you were looking for? Fill out the form below,
              and our support team will respond within 24 hours.
            </p>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow space-y-5 border border-gray-200"
            >
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onChange={handleChange}
              />
              <textarea
                name="question"
                placeholder="Type your question here..."
                rows={5}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onChange={handleChange}
              />
              <button
                type="submit"
                className="bg-primary-500 text-white w-full py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
              >
                Submit Question
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
