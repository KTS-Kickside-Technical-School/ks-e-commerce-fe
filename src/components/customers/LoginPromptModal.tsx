import { FaExclamationTriangle } from 'react-icons/fa';
interface LoginPromptProps {
  isOpen: boolean;
  onClose: Function;
  onLogin: Function;
  msg: string;
}
const LoginPromptModal = ({
  isOpen,
  onClose,
  onLogin,
  msg,
}: LoginPromptProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-[1000] overflow-hidden">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-[400px] h-auto text-center z-[1001]">
        <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Login Required</h2>
        <p className="text-gray-600 mb-4">{msg}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
            onClick={() => onLogin()}
          >
            Login
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
