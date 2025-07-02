import { useEffect, useState } from 'react';
import SEO from '../../../middlewares/SEO';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminFetchSingleTermsAndConditions } from '../../../requests/termsAndConditionsRequests';
import Header from '../../../components/customers/Header';
import Footer from '../../../components/customers/Footer';
import { FaArrowLeft, FaCalendarAlt, FaCopy, FaPrint } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { toast, Toaster } from 'sonner';

const CustomerSingleTermsAndConditions = () => {
  const { slug } = useParams();
  const [term, setTerm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const navigate = useNavigate();

  const fetchData = async (slug: string) => {
    try {
      setLoading(true);
      const response = await adminFetchSingleTermsAndConditions(slug);
      if (response.status !== 200) {
        throw new Error(
          response.message || 'Failed to fetch terms and conditions'
        );
      }
      setTerm(response.data.terms);

      const sectionIds = Object.keys(response.data.terms.contentSections || {});
      setExpandedSections(new Set(sectionIds));
    } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      toast.error(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData(slug);
    }
  }, [slug]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      newSet.has(sectionId) ? newSet.delete(sectionId) : newSet.add(sectionId);
      return newSet;
    });
  };

  const printDocument = () => {
    const printContents = document.getElementById('print-section');
    if (!printContents) return;
    const printWindow = window.open('', '', 'height=700,width=900');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${term?.title} - Print</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 2rem; }
              h1, h2, h3, p { color: #1f2937; }
              a { color: #2563eb; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            ${printContents.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (loading) {
    return <div className="container mx-auto max-w-7xl p-8">Loading...</div>;
  }

  return (
    <>
      <SEO
        title={
          term
            ? `${term.title} - Kickside Store`
            : 'Terms & Conditions - Kickside Store'
        }
        description={term?.summary || 'Kickside Store Terms and Conditions'}
      />
      <Toaster richColors position="top-center" />
      <Header />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/90 hover:text-white transition mb-6 md:mb-0"
              >
                <FaArrowLeft className="text-sm" />
                <span>Back to Terms</span>
              </button>
              <h1 className="text-3xl md:text-4xl font-bold mt-4">
                {term?.title || 'Terms & Conditions'}
              </h1>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={printDocument}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                <FaPrint />
                <span>Print</span>
              </button>
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                <FaCopy />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div id="print-section">
          <div className="bg-white rounded-xl shadow p-6 md:p-10 border border-gray-200">
            <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-gray-200 mb-8">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                    term.type === 'Privacy Policy'
                      ? 'bg-purple-100 text-purple-800'
                      : term.type === 'Refund Policy'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {term.type}
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {term.title}
                </h2>
                <p className="text-gray-600 mt-3 max-w-2xl">{term.summary}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaCalendarAlt />
                  <span className="font-medium">Effective Date:</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {new Date(term.effectiveDate).toLocaleDateString()}
                </p>
                <div className="mt-3 flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Version:</span>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                    {term.version}
                  </span>
                </div>
              </div>
            </div>

            {term.contentSections ? (
              <>
                <div className="sticky top-4 bg-blue-50 rounded-lg p-4 mb-8 z-10">
                  <h3 className="font-medium text-blue-800 mb-3">
                    Document Sections
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(term.contentSections).map((sectionId) => (
                      <a
                        key={sectionId}
                        href={`#section-${sectionId}`}
                        className="text-sm bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition"
                      >
                        {sectionId}
                      </a>
                    ))}
                  </div>
                </div>
                {Object.entries(term.contentSections).map(
                  ([sectionId, sectionContent]) => (
                    <div
                      key={sectionId}
                      id={`section-${sectionId}`}
                      className="mb-10"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-200"
                        onClick={() => toggleSection(sectionId)}
                      >
                        <h3 className="text-xl font-semibold text-gray-800">
                          {sectionId}
                        </h3>
                        <button className="text-gray-500 hover:text-blue-600 transition">
                          {expandedSections.has(sectionId) ? (
                            <FiChevronUp size={20} />
                          ) : (
                            <FiChevronDown size={20} />
                          )}
                        </button>
                      </div>
                      {expandedSections.has(sectionId) && (
                        <div
                          className="mt-4 prose prose-blue max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: sectionContent as string,
                          }}
                        />
                      )}
                    </div>
                  )
                )}
              </>
            ) : (
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: term.content }}
              />
            )}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Acceptance of Terms
              </h3>
              <p className="text-gray-600 mb-6">
                By using our services, you acknowledge that you have read,
                understood, and agree to be bound by these terms and conditions.
                If you do not agree to these terms, please do not use our
                services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition"
                >
                  Contact Us for Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CustomerSingleTermsAndConditions;
