import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min.mjs';
import AppSidebar from './AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Ensure the worker is loaded
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

const LegalForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        preferredLanguage: 'English',
        legalIssue: '',
        caseDetails: '',
    });
    const API_URL = import.meta.env.VITE_BASE_URL;
    const [documentFile, setDocumentFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [caseReference, setCaseReference] = useState('');
    const [responseDetails, setResponseDetails] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }


        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Enter a valid 10-digit phone number';
        }

        // Legal issue validation
        if (!formData.legalIssue) {
            newErrors.legalIssue = 'Please select a legal issue';
        }

        // Case details validation
        if (!formData.caseDetails.trim()) {
            newErrors.caseDetails = 'Case details are required';
        } else if (formData.caseDetails.trim().length < 10) {
            newErrors.caseDetails = 'Please provide more details (minimum 10 characters)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const extractTextFromPDF = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let textContent = "";
            const promises = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                promises.push(
                    pdf.getPage(i).then(page => {
                        return page.getTextContent().then(textContentObj => {
                            return textContentObj.items.map(item => item.str).join(" ");
                        });
                    })
                );
            }

            const pagesText = await Promise.all(promises);
            textContent = pagesText.join("\n");
            setExtractedText(textContent);
            return textContent;
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw error;
        }
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check if the file is a PDF
            if (file.type !== 'application/pdf') {
                setErrors(prev => ({
                    ...prev,
                    document: 'Only PDF files are supported.'
                }));
                return;
            }

            setDocumentFile(file);
            try {
                await extractTextFromPDF(file);
            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    document: 'Error extracting text from PDF. Please try again.'
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);
            setSubmitStatus(null);
            setResponseDetails(null);

            try {
                // Create form data to send
                const formDataToSend = new FormData();

                // Add form fields to FormData
                Object.keys(formData).forEach(key => {
                    formDataToSend.append(key, formData[key]);
                });

                // Add extracted text to the form data
                if (extractedText) {
                    formDataToSend.append('documentText', extractedText);
                }

                // Get the token from localStorage
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error('No authentication token found. Please login first.');
                }

                const response = await axios.post(
                    `${API_URL}/api/form/submit-legal-case`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                console.log('Received response:', response.data);

                setSubmitStatus('success');
                setCaseReference(response.data.caseReference || '');
                setResponseDetails(response.data.receivedData || null);

                // Reset form fields
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    preferredLanguage: 'English',
                    legalIssue: '',
                    caseDetails: '',
                });
                setDocumentFile(null);
                setExtractedText('');
                toast.success('Case submitted successfully!');
            } catch (error) {
                console.error('Error submitting form:', error);
                setSubmitStatus('error');

                // Enhanced error handling
                if (error.response?.status === 403) {
                    setResponseDetails({
                        error: 'Authentication required. Please login first.'
                    });
                } else if (error.message === 'No authentication token found. Please login first.') {
                    setResponseDetails({
                        error: error.message
                    });
                } else {
                    setResponseDetails(error.response?.data || {
                        error: 'An unexpected error occurred'
                    });
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to continue");
                return;
            }

            // Create order in Razorpay
            const paymentResponse = await axios.post(
                `${API_URL}/api/payment`,
                {
                    amount: 500, // Amount in INR (e.g., ₹500)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (paymentResponse.data.success) {
                const options = {
                    key: paymentResponse.data.key_id,
                    amount: paymentResponse.data.amount,
                    currency: paymentResponse.data.currency,
                    order_id: paymentResponse.data.id,
                    name: "Legal Form Submission",
                    description: "Legal Form Access Fee",
                    handler: function (response) {
                        // Payment successful
                        setIsPaid(true);
                        toast.success("Payment successful! You can now access the form.");
                    },
                    prefill: {
                        email: localStorage.getItem("userEmail") || "",
                    },
                    theme: {
                        color: "#16a34a",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Payment gateway component
    const PaymentGateway = () => (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-primary mb-6">Access Legal Form</h2>
                <div className="text-center mb-6">
                    <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-4">
                        To access the legal form, please pay a processing fee of ₹500
                    </p>
                    <div className="text-sm text-gray-500 mb-6">
                        This fee includes:
                        <ul className="mt-2 space-y-1">
                            <li>• Form processing</li>
                            <li>• Initial legal review</li>
                            <li>• Document verification</li>
                        </ul>
                    </div>
                </div>
                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Pay ₹500 to Continue"
                    )}
                </button>
            </div>
        </div>
    );

    // Render payment gateway if not paid
    if (!isPaid) {
        return <PaymentGateway />;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset style={{ backgroundColor: `var(--background-color)` }}>
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb >
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block font-semibold">
                                Dashboard
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-semibold" style={{ color: `var(--text-color)` }}>My Profile</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="p-3 rounded-lg shadow-sm py-10 " style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}>
                    <h2 className="text-2xl font-bold text-center text-primary mb-6">Legal Case Submission Form</h2>

                    {submitStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
                            <p className="font-semibold">Your case has been submitted successfully!</p>
                            {caseReference && (
                                <p className="mt-2">Your case reference number is: <span className="font-bold">{caseReference}</span></p>
                            )}
                            <p className="mt-2">We will contact you soon regarding your case.</p>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
                            <p className="font-semibold">There was an error submitting your case.</p>
                            <p className="mt-2">Please try again or contact our support team for assistance.</p>
                            {responseDetails && (
                                <div className="mt-2 text-xs">
                                    <p>Error details:</p>
                                    <pre className="bg-red-50 p-2 mt-1 rounded">
                                        {JSON.stringify(responseDetails, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} >
                        {/* Basic Case Information Section */}
                        <div className="mb-8 p-4 border border-indigo-200 rounded-md" style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}>
                            <h3 className="text-xl font-semibold mb-4 text-primary">🏛 Basic Case Information</h3>

                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-sm font-medium text-primary mb-1">Full Name</label>
                                <Input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className={`w-full px-3 py-2 border inputField ${errors.fullName ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email Address</label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder='Enter your email address'
                                    className={`w-full px-3 py-2 border inputField ${errors.email ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-primary mb-1">Phone Number</label>
                                <Input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="10-digit number"
                                    className={`w-full px-3 py-2 inputField border ${errors.phone ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="preferredLanguage" className="block text-sm font-medium text-primary mb-1">Preferred Language</label>
                                <select
                                    id="preferredLanguage"
                                    name="preferredLanguage"
                                    value={formData.preferredLanguage}
                                    onChange={handleInputChange}
                                    className="w-full inputField px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="Telugu">Telugu</option>
                                    <option value="Malayalam">Malayalam</option>
                                    <option value="Kannada">Kannada</option>
                                    <option value="Bengali">Bengali</option>
                                    <option value="Marathi">Marathi</option>
                                    <option value="Gujarati">Gujarati</option>
                                </select>
                            </div>
                        </div>

                        {/* Legal Issue Details Section */}
                        <div className="mb-8 p-4 border border-indigo-200 rounded-md " style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}>
                            <h3 className="text-xl font-semibold mb-4 text-primary">⚖️ Legal Issue Details</h3>

                            <div className="mb-4">
                                <label htmlFor="legalIssue" className="block text-sm font-medium text-primary mb-1">What legal issue are you facing?</label>
                                <select
                                    id="legalIssue"
                                    name="legalIssue"
                                    value={formData.legalIssue}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border inputField ${errors.legalIssue ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
                                >
                                    <option value="" disabled>Select a legal issue</option>
                                    <option value="Eviction Disputes">Eviction Disputes</option>
                                    <option value="Wage Theft">Wage Theft</option>
                                    <option value="Tenant Rights">Tenant Rights</option>
                                    <option value="Contract Breaches">Contract Breaches</option>
                                    <option value="Consumer Protection">Consumer Protection</option>
                                </select>
                                {errors.legalIssue && <p className="mt-1 text-sm text-red-600">{errors.legalIssue}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="caseDetails" className="block text-sm font-medium text-primary mb-1">Please describe your case in detail</label>
                                <Textarea
                                    id="caseDetails"
                                    name="caseDetails"
                                    rows="5"
                                    value={formData.caseDetails}
                                    onChange={handleInputChange}
                                    placeholder="Include relevant dates, locations, and parties involved (minimum 10 characters)"
                                    className={`w-full px-3 py-2 border inputField ${errors.caseDetails ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                                {errors.caseDetails && <p className="mt-1 text-sm text-red-600">{errors.caseDetails}</p>}
                                <p className="mt-1 text-xs text-indigo-600">{formData.caseDetails.length} / 10 characters minimum</p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="documentUpload" className="block text-sm font-medium text-primary mb-1">Upload a document (optional)</label>
                                <input
                                    type="file"
                                    id="documentUpload"
                                    name="document"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100"
                                />
                                <p className="mt-1 text-xs text-indigo-600">Supported formats: PDF only</p>
                                {documentFile && (
                                    <p className="mt-1 text-xs text-indigo-600">
                                        Selected file: {documentFile.name} ({(documentFile.size / (1024 * 1024)).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>

                        </div>

                        <div className="flex justify-between gap-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2 px-4 bg-primary hover:bg-primary text-white font-semibold rounded-md shadow transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Case'}
                            </Button>
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        fullName: '',
                                        email: '',
                                        phone: '',
                                        preferredLanguage: 'English',
                                        legalIssue: '',
                                        caseDetails: '',
                                    });
                                    setDocumentFile(null);
                                    setExtractedText('');
                                    setErrors({});
                                    setSubmitStatus(null);
                                }}
                                className="w-full py-2 px-4 border"
                                disabled={isSubmitting}
                            >
                                Reset Form
                            </Button>
                        </div>
                    </form>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default LegalForm;
