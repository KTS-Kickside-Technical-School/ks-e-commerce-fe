import Header from '../../../components/customers/Header';
import Footer from '../../../components/customers/Footer';
import { useState } from 'react';
import NewCustomOrders from './NewCustomOrders';

const ViewCustomOrders = () => {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-6  mx-auto px-4 py-8 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My custom Orders
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage all your recent customized orders in one place.
            Track shipments, view order details, and check order status.
          </p>
        </div>
        <div>
          <ul>
            <li>All</li>
            <li>Pending</li>
            <li>Processing</li>
            <li>Cancelled</li>
            <li>
              <button
                onClick={() => setIsNewOrderOpen(!isNewOrderOpen)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                New customer order
              </button>
            </li>
          </ul>
        </div>
        {isNewOrderOpen ? <NewCustomOrders /> : <>CLose</>}
      </div>
      <Footer />
    </div>
  );
};

export default ViewCustomOrders;
