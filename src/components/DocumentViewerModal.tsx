type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  link: string;
};

export default function DocumentViewerModal({
  isOpen,
  onClose,
  title,
  link,
}: Props) {
  if (!isOpen) return null;

  const isPdf = link.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999999999]">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg overflow-hidden relative shadow-xl">
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-red-600 font-bold text-lg">
            ✕
          </button>
        </div>

        <div className="h-full overflow-auto">
          {isPdf ? (
            <iframe
              src={link}
              title={title}
              className="w-full h-[calc(90vh-64px)]"
            />
          ) : (
            <img
              src={link}
              alt={title}
              className="max-w-full max-h-[calc(90vh-64px)] mx-auto object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
