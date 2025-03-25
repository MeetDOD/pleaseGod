import React, { useState } from 'react';

const FAQ = () => {
    const [activeIndexLeft, setActiveIndexLeft] = useState(null);
    const [activeIndexRight, setActiveIndexRight] = useState(null);

    const toggleQuestionLeft = (index) => {
        setActiveIndexLeft(activeIndexLeft === index ? null : index);
        if (activeIndexRight !== null) {
            setActiveIndexRight(null);
        }
    };

    const toggleQuestionRight = (index) => {
        setActiveIndexRight(activeIndexRight === index ? null : index);
        if (activeIndexLeft !== null) {
            setActiveIndexLeft(null);
        }
    };

    const questionsLeft = [
        {
            id: 1,
            question: 'What is Satyadarshi?',
            answer: 'Satyadarshi is a legal aid web application that helps users understand their rights and connect with suitable legal resources through AI-driven assistance.',
        },
        {
            id: 2,
            question: 'How do I sign up for Satyadarshi?',
            answer: 'You can sign up by clicking the "Sign Up" button on the homepage and entering your name, email address, and password.',
        },
        {
            id: 3,
            question: 'What kind of legal issues does Satyadarshi cover?',
            answer: 'Satyadarshi covers common legal areas like consumer rights, family law, property disputes, workplace issues, and basic criminal and civil matters.',
        },
        {
            id: 4,
            question: 'Is Satyadarshi free to use?',
            answer: 'Yes, Satyadarshi offers free legal insights and AI-based suggestions. Some features may require login or future premium plans.',
        },
    ];
    
    const questionsRight = [
        {
            id: 5,
            question: 'How does Satyadarshi generate legal suggestions?',
            answer: 'Satyadarshi uses AI to analyze your selected symptoms or concerns and maps them to legal domains and relevant resources.',
        },
        {
            id: 6,
            question: 'Can I get lawyer recommendations?',
            answer: 'Yes, Satyadarshi suggests lawyers based on your issue type and location using data fetched from our database.',
        },
        {
            id: 7,
            question: 'Does Satyadarshi provide official legal advice?',
            answer: 'No, Satyadarshi provides basic legal awareness and helps connect users to professionals. For official advice, consult a licensed advocate.',
        },
        {
            id: 8,
            question: 'How do I contact support if I need help?',
            answer: 'Visit the "Contact Us" page to raise any queries or feedback. Our support team will get back to you shortly.',
        },
    ];
    

    return (
        <div className="mb-10 pt-12">
            <div className="flex flex-col items-center gap-5 px-4 my-20">
                <h1 className='text-2xl md:text-3xl font-bold text-center'>
                    Frequently <span className="text-primary">Asked Questions</span>
                </h1>
                <p className='text-center text-lg opacity-90 tracking-tight'>
                    Discover how Satyadarshi empowers you to understand legal matters and make informed decisions with ease.
                </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-y-8 md:gap-x-6 sectionMargin">
                <div className="w-full md:w-1/2 space-y-4">
                    {questionsLeft.map((item, index) => (
                        <div key={item.id} className="rounded-lg shadow-md">
                            <div
                                className={`question px-5 py-4 cursor-pointer flex justify-between items-center ${activeIndexLeft === index ? 'font-semibold' : 'font-medium'
                                    }`}
                                onClick={() => toggleQuestionLeft(index)}
                            >
                                {item.question}
                                <span
                                    className={`transform transition-transform duration-200 text-2xl ${activeIndexLeft === index ? 'rotate-45 text-primary' : 'rotate-0 text-gray-400'
                                        }`}
                                >
                                    +
                                </span>
                            </div>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndexLeft === index ? 'max-h-[200px] py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                                    }`}
                            >
                                <div className="answer px-5 text-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                    {questionsRight.map((item, index) => (
                        <div key={item.id} className="rounded-lg shadow-md">
                            <div
                                className={`question px-5 py-4 cursor-pointer flex justify-between items-center ${activeIndexRight === index ? 'font-semibold' : 'font-medium'
                                    }`}
                                onClick={() => toggleQuestionRight(index)}
                            >
                                {item.question}
                                <span
                                    className={`transform transition-transform duration-200 text-2xl ${activeIndexRight === index ? 'rotate-45 text-primary' : 'rotate-0 text-gray-400'
                                        }`}
                                >
                                    +
                                </span>
                            </div>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndexRight === index ? 'max-h-[200px] py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                                    }`}
                            >
                                <div className="answer px-5 text-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;