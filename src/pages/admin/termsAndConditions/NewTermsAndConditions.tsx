import { useState } from 'react';
import TermsSubNavbar from '../../../components/admin/terms/TermsSubNavbar';
import RichTextEditor from '../../../components/RichTextEditor';
import SEO from '../../../middlewares/SEO';
import { saveTermsANdConditions } from '../../../requests/termsAndConditionsRequests';
import { toast, Toaster } from 'sonner';

const NewTermsAndConditions = () => {
  const [formData, setFormData] = useState({
    title: '',
    version: '',
    content: '',
    summary: '',
    type: '',
    isActive: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const types = [
    'general',
    'privacy',
    'shipping',
    'refund',
    'return',
    'seller',
    'customer',
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.version.trim()) newErrors.version = 'Version is required.';
    if (!formData.content.trim())
      newErrors.content = 'Terms content is required.';
    if (!formData.summary.trim()) newErrors.summary = 'Summary is required.';
    if (formData.summary.length > 200)
      newErrors.summary = 'Summary must not exceed 200 characters.';
    if (!formData.type || !types.includes(formData.type))
      newErrors.type = 'Please select a valid type.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
    setErrors((prev) => ({ ...prev, content: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await saveTermsANdConditions(formData);

      console.log('Response:', response);
      if (response.status === 201) {
        setFormData({
          title: '',
          version: '',
          content: '',
          summary: '',
          type: '',
          isActive: false,
        });
        setErrors({});
        toast.success('Terms and Conditions saved successfully!');
        return;
      }
      toast.error('Failed to save terms and conditions: ' + response.message);
    } catch (err) {
      console.error('Error submitting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-center" />
      <SEO
        title="New Terms and Conditions: Admin - Kickside Store"
        description="A page dedicated to creating new terms and conditions that our app runs through."
      />

      <TermsSubNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-blue-700 mb-6">
          Create New Terms and Conditions
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title (e.g., Seller Terms v2.0)"
              className={`mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="version"
              className="block text-sm font-medium text-gray-700"
            >
              Version
            </label>
            <input
              type="text"
              name="version"
              id="version"
              value={formData.version}
              onChange={handleChange}
              placeholder="e.g., v1.0"
              className={`mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.version
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.version && (
              <p className="text-sm text-red-600 mt-1">{errors.version}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Terms and Conditions
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              height={300}
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700"
            >
              Summary (Max 200 characters)
            </label>
            <textarea
              name="summary"
              id="summary"
              value={formData.summary}
              onChange={handleChange}
              maxLength={200}
              rows={4}
              placeholder="Summarize the key points of this agreement..."
              className={`mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.summary
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            ></textarea>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-500">
                {formData.summary.length}/200 characters used
              </p>
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => {
                  const plain = formData.content.replace(/<[^>]+>/g, '');
                  const sentences = plain
                    .split('.')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const short = sentences.slice(0, 3).join('. ') + '.';
                  const summary =
                    short.length > 200 ? short.slice(0, 197) + '...' : short;
                  setFormData((prev) => ({ ...prev, summary }));
                  setErrors((prev) => ({ ...prev, summary: '' }));
                }}
              >
                Summarize Content
              </button>
            </div>
            {errors.summary && (
              <p className="text-sm text-red-600 mt-1">{errors.summary}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md border p-2 bg-white shadow-sm focus:outline-none focus:ring-2 ${
                errors.type
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">-- Select Type --</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-sm text-red-600 mt-1">{errors.type}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-700">
              Terms Status
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              <span className="ml-3 text-sm text-gray-600">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Terms'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTermsAndConditions;
