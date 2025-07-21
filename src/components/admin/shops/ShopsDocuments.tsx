import { useState } from 'react';
import { FaFilePdf, FaIdCard } from 'react-icons/fa';
import DocumentViewerModal from '../../DocumentViewerModal';

const ShopDocuments = ({ shop }: { shop: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [doc, setDoc] = useState<{ title: string; link: string }>({
    title: '',
    link: '',
  });

  const openModal = (link: string, title: string) => {
    setDoc({ title, link });
    setIsOpen(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm relative z-0">
      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FaFilePdf className="text-red-500" />
        Documents
      </h4>

      <div className="flex flex-wrap gap-3">
        {shop?.rdbDocument && (
          <button
            onClick={() => openModal(shop.rdbDocument, 'RDB Certificate')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
          >
            <FaFilePdf />
            <span>RDB Certificate</span>
          </button>
        )}

        {shop?.seller?.idDocument && (
          <button
            onClick={() =>
              openModal(shop.seller.idDocument, 'Seller ID Document')
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            <FaIdCard />
            <span>ID Document</span>
          </button>
        )}
      </div>

      {/* Modal */}
      <DocumentViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={doc.title}
        link={doc.link}
      />
    </div>
  );
};

export default ShopDocuments;
