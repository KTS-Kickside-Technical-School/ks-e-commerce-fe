import OnboardingProcessingSkeleton from './OnboardingProcessingSkeleton';
import SEO from '../../../middlewares/SEO';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBuilding,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
  FaIdCard,
  FaUpload,
  FaUser,
} from 'react-icons/fa';
import uploadToCloudinary from '../../../helpers/cloudinary';
import { submitSellerOnboarding } from '../../../requests/shopRequest';
import OnboardingSubnavbar from './OnboardingSubnavbar';
import { toast, Toaster } from 'sonner';

interface ISellerOnboardingProps {
  shop: any;
}

const SellerOnboarding = ({ shop }: ISellerOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    name: shop?.name || '',
    tin: shop?.tin || '',
    description: shop?.description || '',
    rdbDocument: shop?.rdbDocument || '',
    fullNames: shop?.seller?.fullNames || '',
    phone: shop?.seller?.phone || '',
    email: shop?.seller?.email || '',
    idDocument: shop?.seller?.idDocument || '',
    mobilePayment: shop?.payment?.mobilePayment || '',
    bankName: shop?.payment?.bankName || '',
    accountNumber: shop?.payment?.accountNumber || '',
  });
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const idInputRef = useRef<HTMLInputElement>(null);
  const rdbInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Shop name is required';
      if (!formData.tin.trim()) newErrors.tin = 'TIN is required';
      if (!formData.description.trim())
        newErrors.description = 'Shop description is required';
      if (!formData.rdbDocument)
        newErrors.rdbDocument = 'Please upload business registration document';
    }

    if (step === 2) {
      if (!formData.fullNames.trim())
        newErrors.fullNames = 'Full name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.idDocument)
        newErrors.idDocument = 'Please upload identification document';
    }

    if (step === 3) {
      if (
        !formData.mobilePayment &&
        (!formData.bankName || !formData.accountNumber)
      ) {
        newErrors.payment = 'Please provide at least one payment method';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev: any) => ({ ...prev, [field]: file }));

      if (field === 'idDocument') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerIdUpload = () => {
    idInputRef.current?.click();
  };

  const triggerRdbUpload = () => {
    rdbInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      setErrors({});

      try {
        let rdbDocumentUrl = '';
        let idDocumentUrl = '';

        if (formData.rdbDocument) {
          rdbDocumentUrl = await uploadToCloudinary(formData.rdbDocument);
          if (!rdbDocumentUrl)
            throw new Error('Failed to upload business registration document');
        }

        if (formData.idDocument) {
          idDocumentUrl = await uploadToCloudinary(formData.idDocument);
          if (!idDocumentUrl)
            throw new Error('Failed to upload identification document');
        }

        const payload = {
          name: formData.name,
          tin: formData.tin,
          description: formData.description,
          rdbDocument: rdbDocumentUrl,
          seller: {
            fullNames: formData.fullNames,
            phone: formData.phone,
            email: formData.email,
            idDocument: idDocumentUrl,
            addresses: formData.address,
          },
          payment: {
            mobilePayment: formData.mobilePayment,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
          },
        };

        const response = await submitSellerOnboarding(payload);

        if (response.status !== 200) {
          throw new Error('Failed to submit seller onboarding information');
        }

        setSuccess(true);
        toast.success('Seller onboarding information submitted successfully');
        setTimeout(() => {
          navigate('/seller/');
        }, 3000);
      } catch (error) {
        toast.error('Seller on boarding submission error!');
        console.error('Submission error:', error);
        setErrors({
          submit:
            error instanceof Error
              ? error.message
              : 'Submission failed. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const firstErrorElement =
        formRef.current?.querySelector('.border-red-500');
      firstErrorElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstErrorElement =
        formRef.current?.querySelector('.border-red-500');
      firstErrorElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 bg-black min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col bg-opacity-50 z-[300] overflow-y-auto">
      <SEO title="Shop Onboarding - Kickside Marketplace" />
      <Toaster richColors position="top-center" />
      <div className="w-full bg-white h-2">
        <div
          className="bg-blue-600 h-full transition-all duration-500"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
      </div>

      <OnboardingSubnavbar />

      {isSubmitting ? (
        <OnboardingProcessingSkeleton />
      ) : (
        <div className="container mx-auto px-4 py-6 flex-grow flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
            <div className="text-center mb-8 mt-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {success ? 'Success!' : 'Shop Onboarding Process'}
              </h1>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                {success
                  ? 'Your shop has been successfully created and is pending admin approval!'
                  : 'Complete these steps to start selling on Kickside'}
              </p>
            </div>

            {!success ? (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden flex-grow flex flex-col">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() =>
                        validateStep(currentStep) && setCurrentStep(step)
                      }
                      className={`flex-1 py-4 flex items-center justify-center gap-2 transition whitespace-nowrap ${
                        currentStep === step
                          ? 'bg-blue-50 text-blue-600 font-medium border-b-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {step === 1 && <FaBuilding />}
                      {step === 2 && <FaUser />}
                      {step === 3 && <FaCreditCard />}
                      <span>Step {step}</span>
                    </button>
                  ))}
                </div>

                <div className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8">
                  <form ref={formRef} className="h-full flex flex-col">
                    {currentStep === 1 && (
                      <div className="space-y-5 flex-grow flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <FaBuilding size={22} />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            Shop Information
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-grow">
                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Shop Name *
                            </label>
                            <input
                              name="name"
                              value={formData?.name}
                              onChange={handleChange}
                              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.name
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder="Enter your shop name"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              TIN (Tax Identification Number) *
                            </label>
                            <input
                              name="tin"
                              value={formData.tin}
                              onChange={handleChange}
                              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.tin
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder="Enter TIN"
                            />
                            {errors.tin && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.tin}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label className="block mb-2 font-medium text-gray-700">
                              Shop Description *
                            </label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              rows={3}
                              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.description
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder="Describe your shop"
                            ></textarea>
                            {errors.description && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label className="block mb-2 font-medium text-gray-700">
                              Upload Business Registration Document *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-blue-400 transition bg-gray-50">
                              <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                              <p className="text-gray-600 mb-1">
                                {formData.rdbDocument
                                  ? formData.rdbDocument instanceof File
                                    ? formData.rdbDocument.name
                                    : 'Document uploaded'
                                  : 'Click to upload business registration document'}
                              </p>
                              <p className="text-gray-500 text-sm">
                                PDF, JPG, or PNG (Max 5MB)
                              </p>
                              <input
                                ref={rdbInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                  handleFileChange(e, 'rdbDocument')
                                }
                              />
                              <button
                                type="button"
                                className="mt-3 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                                onClick={triggerRdbUpload}
                              >
                                Choose File
                              </button>
                            </div>
                            {errors.rdbDocument && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.rdbDocument}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-5 flex-grow flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                            <FaUser size={22} />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            Owner Information
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-grow">
                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Full Name *
                            </label>
                            <input
                              name="fullNames"
                              value={formData.fullNames}
                              onChange={handleChange}
                              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.fullNames
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder="Enter your full name"
                            />
                            {errors.fullNames && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.fullNames}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Phone Number *
                            </label>
                            <input
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.phone
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder="Enter your phone number"
                            />
                            {errors.phone && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.phone}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Email Address *
                            </label>
                            <input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.email
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                              placeholder="Enter your email"
                            />
                            {errors.email && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                                <FaIdCard size={20} />
                              </div>
                              <h3 className="font-medium text-gray-700">
                                ID Verification
                              </h3>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm">
                              Upload a government-issued ID for verification.
                              This helps us ensure the security of your account.
                            </p>

                            <div className="flex flex-col md:flex-row gap-5">
                              <div className="flex-1">
                                <label className="block mb-2 font-medium text-gray-700">
                                  Upload ID Document *
                                </label>
                                <div
                                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                                    errors.idDocument
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-300 bg-gray-50 hover:border-blue-400'
                                  }`}
                                  onClick={triggerIdUpload}
                                >
                                  {idPreview ? (
                                    <div className="flex flex-col items-center">
                                      <img
                                        src={idPreview}
                                        alt="ID Preview"
                                        className="w-32 h-32 object-contain mb-3 border rounded-lg"
                                      />
                                      <p className="text-gray-600">
                                        Click to change ID document
                                      </p>
                                    </div>
                                  ) : (
                                    <div>
                                      <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                                      <p className="text-gray-600">
                                        Click to upload ID document
                                      </p>
                                      <p className="text-gray-500 text-sm mt-1">
                                        JPG or PNG (Max 5MB)
                                      </p>
                                    </div>
                                  )}
                                  <input
                                    ref={idInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) =>
                                      handleFileChange(e, 'idDocument')
                                    }
                                  />
                                </div>
                                {errors.idDocument && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.idDocument}
                                  </p>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="bg-blue-50 rounded-lg p-4 h-full">
                                  <h4 className="font-medium text-blue-800 mb-2">
                                    ID Requirements
                                  </h4>
                                  <ul className="text-gray-700 space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                      <span>
                                        Government-issued ID (National ID,
                                        Passport, Driver's License)
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                      <span>
                                        Clear photo with all details visible
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                      <span>
                                        Must match the name provided in this
                                        form
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                      <span>Not expired</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-5 flex-grow flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <FaCreditCard size={22} />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            Payment Information
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-grow">
                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Mobile Payment (MTN/Airtel)
                            </label>
                            <input
                              name="mobilePayment"
                              value={formData.mobilePayment}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter mobile money number"
                            />
                            <p className="text-gray-500 text-sm mt-1">
                              For receiving payments from customers
                            </p>
                          </div>

                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Bank Name
                            </label>
                            <input
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter bank name"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block mb-2 font-medium text-gray-700">
                              Bank Account Number
                            </label>
                            <input
                              name="accountNumber"
                              value={formData.accountNumber}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter account number"
                            />
                          </div>

                          <div className="md:col-span-2 mt-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h4 className="font-medium text-blue-800 mb-2">
                                Payment Information
                              </h4>
                              <p className="text-gray-700 mb-3">
                                Provide at least one payment method to receive
                                your earnings. You can update this information
                                later in your shop settings.
                              </p>
                              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="text-yellow-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <p className="text-yellow-700 text-sm">
                                  Your first payout will be processed 7 days
                                  after your first sale to ensure transaction
                                  security.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <div>
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-100"
                          >
                            <FaChevronLeft />
                            Previous
                          </button>
                        )}
                      </div>

                      <div>
                        {currentStep < 3 ? (
                          <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Next
                            <FaChevronRight />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-70"
                          >
                            {isSubmitting ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaCheckCircle />
                                Submit and Create Shop
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center justify-center text-center flex-grow">
                <div className="bg-green-100 p-5 rounded-full mb-5">
                  <FaCheckCircle className="text-green-600 text-5xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Onboarding Complete!
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Your shop has been successfully created. You'll be notified
                  once it's approved by our team. You can start adding products
                  and managing your shop. You will be redirected to the{' '}
                  <span className="font-semibold">
                    Kickside Seller Dashboard
                  </span>{' '}
                  shortly.
                </p>
                <div className="relative pt-1 w-full max-w-xs">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: '100%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-1000"
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOnboarding;
