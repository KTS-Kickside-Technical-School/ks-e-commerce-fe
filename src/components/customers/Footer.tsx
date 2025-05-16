import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaXTwitter,
  FaFacebook,
  FaLinkedin,
  FaLocationDot,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-[#232F3E] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Get Support</h2>
          <ul className="space-y-2 text-[#EAEAEA]">
            <li>
              <Link to="/help-center" className="hover:text-white">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/live-chat" className="hover:text-white">
                Live Chat
              </Link>
            </li>
            <li>
              <Link to="/report-abuse" className="hover:text-white">
                Report Abuse
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Trade Assurance</h2>
          <ul className="space-y-2 text-[#EAEAEA]">
            <li>
              <Link to="/safety" className="hover:text-white">
                Safety & Easy Payment
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-white">
                On-time Shipping
              </Link>
            </li>
            <li>
              <Link to="/protection" className="hover:text-white">
                After-sales Protection
              </Link>
            </li>
            <li>
              <Link to="/money-back" className="hover:text-white">
                Money-back Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Shopping Guides</h2>
          <ul className="space-y-2 text-[#EAEAEA]">
            <li>
              <Link to="/register" className="hover:text-white">
                How to Register
              </Link>
            </li>
            <li>
              <Link to="/order" className="hover:text-white">
                How to Place an Order
              </Link>
            </li>
            <li>
              <Link to="/payment" className="hover:text-white">
                How to Pay
              </Link>
            </li>
            <li>
              <Link to="/more-guides" className="hover:text-white">
                More
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Get to Know Us</h2>
          <ul className="space-y-2 text-[#EAEAEA]">
            <li className="flex items-center gap-2">
              <FaLocationDot className="text-white" /> Kigali, Rwanda - Norsken
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-white" /> inquiries.shop@kickside.rw
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-white" /> +250781234567
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-500 py-6 flex justify-center space-x-6">
        <Link
          to="#"
          aria-label="Instagram"
          className="text-[#EAEAEA] hover:text-white text-xl"
        >
          <FaInstagram />
        </Link>
        <Link
          to="#"
          aria-label="Twitter"
          className="text-[#EAEAEA] hover:text-white text-xl"
        >
          <FaXTwitter />
        </Link>
        <Link
          to="#"
          aria-label="Facebook"
          className="text-[#EAEAEA] hover:text-white text-xl"
        >
          <FaFacebook />
        </Link>
        <Link
          to="#"
          aria-label="LinkedIn"
          className="text-[#EAEAEA] hover:text-white text-xl"
        >
          <FaLinkedin />
        </Link>
      </div>

      <div className="bg-[#131A22] py-4 text-center text-[#EAEAEA] text-sm">
        <ul className="flex flex-wrap justify-center gap-4 mb-2">
          <li>
            <Link to="/terms" className="hover:text-white">
              Terms of Use
            </Link>
          </li>
          <li>
            <Link to="/legal" className="hover:text-white">
              Legal Notice
            </Link>
          </li>
          <li>
            <Link to="/policy" className="hover:text-white">
              Product Listing Policy
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </li>
        </ul>
        <p>© KicksideRw, {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
