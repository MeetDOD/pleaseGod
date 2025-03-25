import React from 'react';
import laptop from '../assets/laptop.png';
import dashboard from '../assets/UserDashboard.png';
import { FaCheckCircle } from "react-icons/fa";

const WebDetails = () => {
    return (
        <div
            className="bg-primary p-6 md:p-10 py-12 md:py-16 rounded-2xl mt-14 shadow-xl bg-cover bg-center"
            style={{
                backgroundImage: `url('https://static.canva.com/web/images/e733916c4616f5baa19098cc2844369b.jpg')`,
            }}
        >
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
                <div className="relative w-full lg:w-1/2 max-w-xl mx-auto lg:mx-0">
                    <img src={laptop} alt="Laptop" className="w-full" />
                    <img
                        src={dashboard}
                        alt="Dashboard inside Laptop"
                        className="absolute top-[4%] left-[11%] w-[78%] h-[85%] rounded-lg"
                    />
                </div>

                <div className="w-full lg:w-1/2 text-white text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                        Explore Legal Support with <span className="italic">SATYADARSHI</span>
                    </h2>
                    <p className="mt-4 text-base sm:text-lg font-medium">
                        Satyadarshi is your AI-powered legal assistant, designed to help you understand your rights, assess your situation, and guide you through legal solutions with ease and confidence.
                    </p>

                    <ul className="mt-6 space-y-3">
                        <li className="flex items-center">
                            <span className="text-green-400 rounded-full border-2 border-green-600 text-xl mr-3 animate-pulse"><FaCheckCircle /></span>
                            <span className="text-base sm:text-lg font-medium">AI-based legal needs assessment for your situation</span>
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 rounded-full border-2 border-green-600 text-xl mr-3 animate-pulse"><FaCheckCircle /></span>
                            <span className="text-base sm:text-lg font-medium">Easy-to-use dashboard to track advice and documents</span>
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 rounded-full border-2 border-green-600 text-xl mr-3 animate-pulse"><FaCheckCircle /></span>
                            <span className="text-base sm:text-lg font-medium">AI-generated legal documents tailored to your needs</span>
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 rounded-full border-2 border-green-600 text-xl mr-3 animate-pulse"><FaCheckCircle /></span>
                            <span className="text-base sm:text-lg font-medium">Voice-assisted legal guidance for faster clarity</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WebDetails;