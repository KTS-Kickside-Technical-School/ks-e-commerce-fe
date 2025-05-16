import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  addSingleProductOrderProcess,
  updateOrderStatus,
} from '../../../requests/ordersRequests';
import { toast, Toaster } from 'sonner';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';

interface LoadingModalProps {
  message: string;
}

const LoadingModal = ({ message }: LoadingModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm animate-pulse text-center">
        <div className="w-12 h-12 mx-auto border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-primary-500 font-medium">{message}</p>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [cancelOrder, setCancelOrder] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const location = useLocation();

  const cleanUrlParams = () => {
    const path = window.location.pathname;
    window.history.replaceState(null, '', path);
  };

  const handleSingleOrderStatus = async (
    _id: string,
    status: string,
    process: string
  ) => {
    try {
      const currentDateTime = new Date().toISOString();
      const response = await addSingleProductOrderProcess({
        _id,
        orderStatus: status,
        orderProcesses: {
          process,
          date: currentDateTime,
        },
      });

      if (response?.status === 200) {
        toast.success(`Order marked as ${status.toLowerCase()}`);
        return response.data;
      }

      throw new Error(response?.message || 'Failed to update order');
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(`Error: ${err?.message || 'Something went wrong'}`);
    }
  };

  const handleMultipleOrderStatus = async (_id: string, status: string) => {
    try {
      const response = await updateOrderStatus({ _id, orderStatus: status });
      if (response?.status === 200) {
        toast.success(`Order marked as ${status.toLowerCase()}`);
        return response.data;
      }
      throw new Error(response?.message || 'Failed to update order');
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(`Error: ${err?.message || 'Something went wrong'}`);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const searchParams = new URLSearchParams(location.search);
    const newOrderId = searchParams.get('new_order');
    const cancelSingleId = searchParams.get('cancel_single_order');
    const saveSingleId = searchParams.get('save_single_order');
    const cancelOrderId = searchParams.get('cancel_order');

    const run = async () => {
      if (!isMounted) return;

      setLoading(true);
      try {
        if (cancelSingleId) {
          setLoadingMessage('Cancelling your order...');
          await handleSingleOrderStatus(
            cancelSingleId,
            'Cancelled',
            'Your order has been cancelled. Try placing an order again.'
          );
          setCancelOrder(null);
        } else if (saveSingleId) {
          setLoadingMessage('Processing your payment...');
          await handleSingleOrderStatus(
            saveSingleId,
            'Paid',
            'Your order has been paid successfully.'
          );
          setNewOrder(null);
        } else if (cancelOrderId) {
          setLoadingMessage('Cancelling your multiple product order...');
          setCancelOrder(cancelOrderId);
          await handleMultipleOrderStatus(cancelOrderId, 'Cancelled');
          setCancelOrder(null);
        } else if (newOrderId) {
          setLoadingMessage('Processing your new order...');
          setNewOrder(newOrderId);
          await handleMultipleOrderStatus(newOrderId, 'Paid');
          setNewOrder(null);
        }
        return;
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingMessage('');
          cleanUrlParams();
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header />
      {loading && <LoadingModal message={loadingMessage} />}
      <div className="my-6 px-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">Order Management</h1>
        {!loading && cancelOrder && (
          <p className="text-yellow-600">Cancelling order: {cancelOrder}</p>
        )}
        {!loading && newOrder && (
          <p className="text-green-600">Processing new order: {newOrder}</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
