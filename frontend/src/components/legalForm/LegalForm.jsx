import React, { useState } from 'react';
import axios from 'axios';

const LegalForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        preferredLanguage: 'English',
        legalIssue: '',
        caseDetails: '',
    });
    
    const [documentFile, setDocumentFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [caseReference, setCaseReference] = useState('');
    const [responseDetails, setResponseDetails] = useState(null);
    
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
    
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            setSubmitStatus(null);
            setResponseDetails(null);
            
            try {
                // Create FormData object for multipart/form-data submission
                const formDataToSend = new FormData();
                
                // Add form fields to FormData
                Object.keys(formData).forEach(key => {
                    formDataToSend.append(key, formData[key]);
                });
                
                // Add document file if selected
                if (documentFile) {
                    formDataToSend.append('document', documentFile);
                }
                
                console.log('Sending form data...');
                
                // Set the correct content type for express-fileupload
                const response = await axios.post('http://localhost:4000/api/form/submit-legal-case', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                console.log('Received response:', response.data);
                
                // Handle successful response
                setSubmitStatus('success');
                setCaseReference(response.data.caseReference || '');
                setResponseDetails(response.data.receivedData || null);
                
                // Reset form fields but keep the document file
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    preferredLanguage: 'English',
                    legalIssue: '',
                    caseDetails: '',
                });
                
                // Don't reset the document file
                // setDocumentFile(null);
                
                // Don't reset file input element
                // const fileInput = document.getElementById('documentUpload');
                // if (fileInput) {
                //     fileInput.value = '';
                // }
                
            } catch (error) {
                console.error('Error submitting form:', error);
                setSubmitStatus('error');
                if (error.response && error.response.data) {
                    setResponseDetails(error.response.data);
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-indigo-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-indigo-900 mb-6">Legal Case Submission Form</h2>
            
            {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
                    <p className="font-semibold">Your case has been submitted successfully!</p>
                    {caseReference && (
                        <p className="mt-2">Your case reference number is: <span className="font-bold">{caseReference}</span></p>
                    )}
                    <p className="mt-2">We will contact you soon regarding your case.</p>
                    {responseDetails && (
                        <div className="mt-2 text-xs">
                            <p>Received data summary:</p>
                            <pre className="bg-green-50 p-2 mt-1 rounded">
                                {JSON.stringify(responseDetails, null, 2)}
                            </pre>
                        </div>
                    )}
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
            
            <form onSubmit={handleSubmit}>
                {/* Basic Case Information Section */}
                <div className="mb-8 p-4 border border-indigo-200 rounded-md bg-white">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-800">🏛 Basic Case Information</h3>
                    
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-indigo-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-indigo-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-indigo-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="preferredLanguage" className="block text-sm font-medium text-indigo-700 mb-1">Preferred Language</label>
                        <select
                            id="preferredLanguage"
                            name="preferredLanguage"
                            value={formData.preferredLanguage}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
                <div className="mb-8 p-4 border border-indigo-200 rounded-md bg-white">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-800">⚖️ Legal Issue Details</h3>
                    
                    <div className="mb-4">
                        <label htmlFor="legalIssue" className="block text-sm font-medium text-indigo-700 mb-1">What legal issue are you facing?</label>
                        <select
                            id="legalIssue"
                            name="legalIssue"
                            value={formData.legalIssue}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${errors.legalIssue ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
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
                        <label htmlFor="caseDetails" className="block text-sm font-medium text-indigo-700 mb-1">Please describe your case in detail</label>
                        <textarea
                            id="caseDetails"
                            name="caseDetails"
                            rows="5"
                            value={formData.caseDetails}
                            onChange={handleInputChange}
                            placeholder="Include relevant dates, locations, and parties involved (minimum 10 characters)"
                            className={`w-full px-3 py-2 border ${errors.caseDetails ? 'border-red-500' : 'border-indigo-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.caseDetails && <p className="mt-1 text-sm text-red-600">{errors.caseDetails}</p>}
                        <p className="mt-1 text-xs text-indigo-600">{formData.caseDetails.length} / 10 characters minimum</p>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="documentUpload" className="block text-sm font-medium text-indigo-700 mb-1">Upload a document (optional)</label>
                        <input
                            type="file"
                            id="documentUpload"
                            name="document"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="mt-1 text-xs text-indigo-600">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)</p>
                        {documentFile && (
                            <p className="mt-1 text-xs text-indigo-600">
                                Selected file: {documentFile.name} ({(documentFile.size / (1024 * 1024)).toFixed(2)} MB)
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-between gap-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-md shadow transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Case'}
                    </button>
                    <button 
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
                            // Keep the document file
                            // setDocumentFile(null);
                            setErrors({});
                            setSubmitStatus(null);
                            
                            // Don't reset file input
                            // const fileInput = document.getElementById('documentUpload');
                            // if (fileInput) {
                            //     fileInput.value = '';
                            // }
                        }}
                        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-indigo-900 font-semibold rounded-md shadow transition duration-200"
                        disabled={isSubmitting}
                    >
                        Reset Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LegalForm;
