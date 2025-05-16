const HeaderForInvoices = ({ companyInfo }: any) => {
  return (
    <div className="border-b pb-4">
      <div className="flex items-start gap-6">
        <img
          src="/logo.png"
          alt="Company Logo"
          className="w-24 h-24 object-contain"
        />

        <div className="text-left">
          <h1 className="text-2xl font-bold mb-2">{companyInfo.name}</h1>
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-gray-700">Registered Business</p>
            <p>{companyInfo.address}</p>
            <p>Tax ID: RW-123-456-789</p>
            <p>Business Registration: 987654321</p>
          </div>
        </div>

        <div className="ml-auto text-right text-sm">
          <div className="space-y-1">
            <p className="font-semibold">Contact Information</p>
            <p>Tel: {companyInfo.phone}</p>
            <p>Email: {companyInfo.email}</p>
            <p>Website: {companyInfo.website}</p>
            <p className="mt-2">VAT Number: RW-VAT-456123</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 text-xs">
        <p className="text-gray-600">
          KicksideShop Ltd • Registered in Rwanda • Member of RRA Tax Compliance
          Program
        </p>
      </div>
    </div>
  );
};

export default HeaderForInvoices;
