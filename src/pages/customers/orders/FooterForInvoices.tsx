const FooterForInvoices = ({ data }: any) => {
  return (
    <div className="mt-8 border-t pt-4 text-xs text-gray-600">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="font-semibold">Payment Terms</p>
          <p>Paid in Full: {data?.paymentStatus || 'Pending Verification'}</p>
          <p>Payment Method: {data?.paymentMethod || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Returns Policy</p>
          <p>7-Day Return Policy</p>
          <p>Contact Support for Returns</p>
        </div>
        <div>
          <p className="font-semibold">Customer Support</p>
          <p>Email: support@kicksideshop.rw</p>
          <p>Hotline: +250 800 123 456</p>
          <p>Mon-Fri: 8AM - 5PM CAT</p>
        </div>
      </div>
      <div className="mt-4 text-center text-[10px]">
        <p>
          This is an automatically generated document - No signature required
        </p>
        <p>
          KicksideShop Ltd © {new Date().getFullYear()} | All rights reserved
        </p>
        <p className="mt-1">Software Powered by KicksideShop ERP v2.4</p>
      </div>
    </div>
  );
};

export default FooterForInvoices;
