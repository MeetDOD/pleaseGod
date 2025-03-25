import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { HiCheckCircle, HiLightningBolt } from "react-icons/hi";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Button } from "@/components/ui/button";
import { useRecoilValue } from 'recoil';
import { userState } from '@/store/auth';

const Proplans = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BASE_URL;
    const user1 = useRecoilValue(userState);

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
                        navigate('/legalaid'); // Redirect to legal aid form
                        window.location.reload();
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
        <div className="container px-5 mt-16 mx-auto">
            <div className="flex flex-col items-center gap-2 my-10 px-4 mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-center">
                    Our <span className="text-primary">Pricing</span>
                </h1>
                <p className="text-center text-lg opacity-90 tracking-tight">
                    Unlock the full potential of <span className="font-semibold">Satyadarshi</span> with AI-powered
                    tools. Get started for free or go unlimited for just <span className="font-semibold">₹99/month</span>.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 items-center">
                <div
                    className="p-6 w-full sm:w-80 rounded-xl border shadow-md"
                    style={{
                        backgroundColor: `var(--background-color)`,
                        color: `var(--text-color)`,
                        borderColor: `var(--borderColor)`,
                    }}
                >
                    <h2 className="text-sm font-semibold uppercase">Free Plan</h2>
                    <h1 className="text-4xl font-bold mt-2">₹0/month</h1>
                    <p className="text-gray-600 mt-2">Try all features up to 3 times</p>
                    <div className="mt-4 space-y-2">
                        <p className="flex items-center gap-2">
                            <HiCheckCircle className="text-green-500 text-xl" /> Create Legal Aid
                            upto 3 times
                        </p>
                        <p className="flex items-center gap-2">
                            <HiCheckCircle className="text-green-500 text-xl" /> Use AI Consultant
                            upto 3 times
                        </p>
                        <p className="flex items-center gap-2">
                            <HiCheckCircle className="text-green-500 text-xl" /> Community Feature
                        </p>
                        <p className="flex items-center gap-2">
                            <HiCheckCircle className="text-green-500 text-xl" /> AI Podcasts
                            upto 3 times
                        </p>
                    </div>
                    <Button className="w-full mt-6">GET STARTED</Button>
                </div>

                <div className="p-8 w-full sm:w-96 border border-primary rounded-xl shadow-md text-white bg-gradient-to-r from-[#7c3aed] to-[#00FFF1] magic-border transform scale-105">
                    <h2 className="text-sm font-semibold uppercase">Pro Plan</h2>
                    <h1 className="text-5xl font-bold mt-2 break-words">₹99/month</h1>
                    <p className="mt-2">Unlimited access to all features</p>
                    <div className="mt-4 space-y-3">
                        <p className="flex items-center gap-2">
                            <HiLightningBolt className="text-yellow-300 text-xl" /> Unlimited
                            Legal Aid Creation
                        </p>
                        <p className="flex items-center gap-2">
                            <HiLightningBolt className="text-yellow-300 text-xl" /> Unlimited
                            AI Consultant
                        </p>
                        <p className="flex items-center gap-2">
                            <HiLightningBolt className="text-yellow-300 text-xl" /> Unlimited
                            AI Podcasts
                        </p>
                        <p className="flex items-center gap-2">
                            <HiLightningBolt className="text-yellow-300 text-xl" /> 24/7 Support
                        </p>
                    </div>

                    <ShinyButton
                        onClick={() => handlePayment(99, 'Basic')}
                        className={`py-3 w-full mt-6 font-semibold text-lg 
                        ${user1.isPaid ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-white text-gray-900"}`}
                        disabled={user1.isPaid}
                    >
                        {user1.isPaid ? "Subscribed" : "Upgrade Now"}
                    </ShinyButton>
                </div>
            </div>
        </div>
    );
};

export default Proplans;
