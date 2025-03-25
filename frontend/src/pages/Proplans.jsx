import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const Proplans = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BASE_URL;

    const handlePayment = async (amount, planName) => {
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
                    amount: amount, // Amount in INR
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
                    name: "Legal Services Subscription",
                    description: `${planName} Plan Subscription`,
                    handler: function (response) {
                        // Payment successful
                        localStorage.setItem('legalFormPayment', 'paid');
                        toast.success("Payment successful!");
                        navigate('/legal-aid'); // Redirect to legal aid form
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
                        Legal Service Plans
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get professional legal assistance with our comprehensive service plans
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-3 sm:grid-cols-2">
                    {/* Basic Plan */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="bg-green-600 p-4">
                            <h3 className="text-xl font-bold text-white text-center">Basic Plan</h3>
                        </div>
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-gray-900">₹500</p>
                                <p className="text-gray-600 mt-1">One-time consultation</p>
                            </div>
                            
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Basic legal consultation
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Document review
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    24/7 Support
                                </li>
                            </ul>
                            
                            <button
                                onClick={() => handlePayment(500, 'Basic')}
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 disabled:bg-green-400 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </div>
                                ) : 'Get Started'}
                            </button>
                        </div>
                    </div>

                    {/* Standard Plan */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 border-2 border-green-500">
                        <div className="bg-green-600 p-4 relative">
                            <h3 className="text-xl font-bold text-white text-center">Standard Plan</h3>
                            <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg text-gray-900">
                                POPULAR
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-gray-900">₹1,000</p>
                                <p className="text-gray-600 mt-1">Monthly subscription</p>
                            </div>
                            
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    All Basic Plan features
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Priority Support
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Monthly Legal Advisory
                                </li>
                            </ul>
                            
                            <button
                                onClick={() => handlePayment(1000, 'Standard')}
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 disabled:bg-green-400 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </div>
                                ) : 'Choose Standard'}
                            </button>
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div className="bg-green-600 p-4">
                            <h3 className="text-xl font-bold text-white text-center">Premium Plan</h3>
                        </div>
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-bold text-gray-900">₹1,500</p>
                                <p className="text-gray-600 mt-1">Monthly subscription</p>
                            </div>
                            
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    All Standard Plan features
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Dedicated Legal Advisor
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Unlimited Consultations
                                </li>
                            </ul>
                            
                            <button
                                onClick={() => handlePayment(1500, 'Premium')}
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 disabled:bg-green-400 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </div>
                                ) : 'Choose Premium'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Proplans;
