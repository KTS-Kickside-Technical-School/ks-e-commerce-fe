import { FaWhatsapp } from 'react-icons/fa';

interface TextWhatsappButtonProps {
  phoneNumber: string;
  message: string;
  className?: string;
  buttonText?: string;
}

const TextWhatsappButton = ({
  phoneNumber,
  message,
  className = '',
  buttonText = 'Message on WhatsApp',
}: TextWhatsappButtonProps) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center
        gap-2 transition-all duration-300
        bg-[#25D366] hover:bg-[#128C7E] text-white
        rounded-full md:rounded-lg
        p-2 md:px-4 md:py-3
        border-2 border-[#128C7E]/20
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:ring-offset-2
        min-w-[44px] md:min-w-[180px]
        ${className}
      `}
    >
      <FaWhatsapp className="w-6 h-6 md:w-5 md:h-5 shrink-0" />
      <span className="hidden md:inline text-sm font-medium">{buttonText}</span>
    </a>
  );
};

export default TextWhatsappButton;
