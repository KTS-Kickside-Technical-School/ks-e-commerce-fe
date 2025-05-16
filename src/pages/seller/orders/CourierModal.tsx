import { useRef } from 'react';
import { FiPrinter, FiX } from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';
import HeaderForInvoices from '../../customers/orders/HeaderForInvoices';
import FooterForInvoices from '../../customers/orders/FooterForInvoices';

const CourierModal = ({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const companyInfo = {
    name: 'KicksideShop',
    address: 'Kigali, Rwanda',
    email: 'support@kicksideshop.rw',
    phone: '+250 788 123 456',
    website: 'www.kicksideshop.rw',
  };

  const printDate = new Date().toLocaleString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-lg w-full max-w-4xl p-6 shadow-lg print:shadow-none flex flex-col"
        style={{
          height: 'calc(100vh - 8rem)',
          maxHeight: '800px',
          minHeight: '400px',
          overflow: 'scroll',
        }}
      >
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h3 className="text-xl font-semibold">Courier Delivery Sheet</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div ref={contentRef} className="space-y-6 print:p-6">
          <HeaderForInvoices companyInfo={companyInfo} />
          <div className="flex justify-between items-start">
            <div className="text-left">
              <h2 className="text-xl font-bold">Delivery Note</h2>
              <p className="text-sm">
                Order #: {order?.trackingNumber || 'N/A'}
              </p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Printed on: {printDate}</p>
              <p>Prepared by: {order?.staff?.name || 'System Generated'}</p>
              <p>Document ID: {order?.id?.slice(0, 8) || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div className="space-y-2">
              <h4 className="font-semibold border-b pb-1">
                Customer Information
              </h4>
              <p>
                <strong>Name:</strong> {order?.customer?.fullNames || 'N/A'}
              </p>
              <p>
                <strong>Email:</strong> {order?.customer?.email || 'N/A'}
              </p>
              <p>
                <strong>Phone:</strong> {order?.customer?.phone || 'N/A'}
              </p>
              <p>
                <strong>Customer ID:</strong>{' '}
                {order?.customer?.id?.slice(0, 8) || 'N/A'}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="space-y-2">
              <h4 className="font-semibold border-b pb-1">Shipping Details</h4>
              <p>
                <strong>Address:</strong> {order?.addresses?.street || 'N/A'}
              </p>
              <p>
                {order?.addresses?.city}, {order?.addresses?.region}
              </p>
              <p>
                {order?.addresses?.country}, {order?.addresses?.postalCode}
              </p>
              <p>
                <strong>Delivery Method:</strong>{' '}
                {order?.shippingMethod || 'Standard'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold border-b pb-1">Product Details</h4>
            <div className="flex items-start gap-4">
              <img
                src={order?.images?.[0] || '/placeholder-product.jpg'}
                alt={order?.productName || 'Product image'}
                className="w-32 h-32 object-cover border rounded"
              />
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <p>
                  <strong>Product Name:</strong> {order?.productName}
                </p>
                <p>
                  <strong>SKU:</strong> {order?.sku || 'N/A'}
                </p>
                <p>
                  <strong>Quantity:</strong> {order?.quantity}
                </p>
                <p>
                  <strong>Unit Price:</strong> {order?.finalUnitPrice} RWF
                </p>
                <p>
                  <strong>Total:</strong> {order?.totalPrice} RWF
                </p>
                <p>
                  <strong>Category:</strong> {order?.category || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold border-b pb-1">
                Courier Information
              </h4>
              <p>
                <strong>Company:</strong> {order?.courier || 'N/A'}
              </p>
              <p>
                <strong>Tracking Number:</strong>{' '}
                {order?.trackingNumber || 'Pending'}
              </p>
              <p>
                <strong>Estimated Delivery:</strong>{' '}
                {order?.estimatedDelivery || '3-5 business days'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold border-b pb-1">Order Timeline</h4>
              <p>
                <strong>Order Date:</strong> {order?.orderDate || 'N/A'}
              </p>
              <p>
                <strong>Dispatch Date:</strong>{' '}
                {order?.dispatchDate || 'Pending'}
              </p>
              <p>
                <strong>Delivery Date:</strong>{' '}
                {order?.deliveryDate || 'In Transit'}
              </p>
            </div>
          </div>
          <FooterForInvoices
            data={{
              orderStatus: order?.orderStatus || 'pending',
              paymentMethod: order?.paymentMethod || 'unknown',
            }}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <button
            onClick={() => reactToPrintFn()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FiPrinter /> Print
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourierModal;
