import { useState } from 'react';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { MdEmail } from 'react-icons/md';
import { FaLink, FaPhone, FaRegCopy } from 'react-icons/fa';
import { FaLocationDot, FaShop } from 'react-icons/fa6';
import { iProduct } from '../../../types/store';

interface ProductTabsProps {
  product: iProduct;
  shop: any;
}
const ProductTabs = ({ product, shop }: ProductTabsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const fullAddress = `${shop.address.street}, ${shop.address.city}, ${shop.address.region}, ${shop.address.country} ${shop.address.postalCode}`;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const tabs = [
    {
      title: 'Product Details',
      content: (
        <div className="prose text-gray-600 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      ),
    },
    {
      title: 'About the Seller',
      content: shop ? (
        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaShop />
            <span>Sold by {shop.name}</span>
          </h2>

          <p className="text-gray-600">{shop.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            {/* Address */}
            <div className="flex items-start gap-2">
              <FaLocationDot className="text-lg mt-0.5 text-blue-500" />
              <div className="flex flex-col">
                <span>{fullAddress}</span>
                <button
                  onClick={copyAddress}
                  className="mt-1 text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FaRegCopy />
                  {copied ? 'Copied!' : 'Copy address'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaPhone className="text-blue-500" />
              <a
                href={`tel:${shop.contactNumber}`}
                className="text-blue-600 hover:underline"
              >
                {shop.contactNumber}
              </a>
            </div>

            {/* Email */}
            {shop.email && (
              <div className="flex items-center gap-2">
                <MdEmail className="text-blue-500 text-lg" />
                <a
                  href={`mailto:${shop.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {shop.email}
                </a>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">
                <FaLink />
              </span>
              <a
                href={`/shops/${shop._id}`}
                className="text-blue-500 hover:underline font-medium"
              >
                Visit Shop
              </a>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">No shop information available.</p>
      ),
    },
  ];

  return (
    <div className="w-full mt-8 bg-white p-6 rounded-xl border border-gray-100">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex border-b border-gray-200 mb-4">
          {tabs.map((tab, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                classNames(
                  'px-4 py-2 text-sm font-medium focus:outline-none',
                  selected
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                )
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx}>
              <div className="pt-2">{tab.content}</div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProductTabs;
