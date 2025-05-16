import { FaTimes, FaSearch } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ProcessModalProps {
  processes: Array<{ process: string; date: Date }>;
  onClose: () => void;
}

const SingleProductOrderProcesses = ({
  processes,
  onClose,
}: ProcessModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProcesses, setFilteredProcesses] = useState(processes);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = processes.filter((process) =>
      process.process.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProcesses(filtered);
  }, [searchQuery, processes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-2xl p-6 relative flex flex-col shadow-xl transform transition-all duration-300 ease-out"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl font-semibold">Order Process History</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="my-4 relative">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search processes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search processes"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredProcesses.length ? (
            filteredProcesses.map((step, index) => (
              <div
                key={index}
                className="group flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors border-b last:border-0"
              >
                <div className="w-8 text-gray-500 font-medium">
                  {index + 1}.
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 capitalize">
                    {step.process}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <time
                      className="text-sm text-gray-500"
                      dateTime={String(step.date)}
                    >
                      {formatDistanceToNow(new Date(step.date), {
                        addSuffix: true,
                      })}
                    </time>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(step.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No matching processes found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductOrderProcesses;
