import { FaFilePdf, FaIdCard } from 'react-icons/fa';

const ShopDocuments = ({ shop }: { shop: any }) => {
  console.log(shop);
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FaFilePdf className="text-red-500" />
        Documents
      </h4>
      <div className="flex flex-wrap gap-3">
        {shop.rdbDocument && (
          <a
            href={shop.rdbDocument}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
          >
            <FaFilePdf />
            <span>RDB Certificate</span>
          </a>
        )}
        {shop.seller.idDocument && (
          <a
            href={shop.seller.idDocument}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            <FaIdCard />
            <span>ID Document</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ShopDocuments;
