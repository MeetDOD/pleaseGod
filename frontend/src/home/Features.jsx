import React from 'react';
import assessmentGif from '../assets/Features/assessment.gif';
import resumeGif from '../assets/Features/resume.gif';
import interviewGif from '../assets/Features/interview.gif';
import insightGif from '../assets/Features/insights.gif';

const Features = () => {

    const features = [
        {
            gif: assessmentGif,
            title: "Legal Needs Assessment",
            description: "Analyze your legal situation with our smart issue-mapping tool.",
        },
        {
            gif: resumeGif,
            title: "Summary Builder",
            description: "Generate structured legal summaries to help you prepare documents or consultations.",
        },
        {
            gif: interviewGif,
            title: "Voice Assistance",
            description: "Get spoken legal guidance through interactive voice conversations.",
        },
        {
            gif: insightGif,
            title: "Legal Pathway Insights",
            description: "Discover recommended legal options, rights, and action steps powered by AI.",
        },
    ];

    return (
        <div className="pb-20 pt-10">
            <div>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold sm:text-4xl">
                        Elevate with <span className='text-primary'>SATYADARSHI</span>
                    </h2>
                    <p className="mt-4 text-lg font-medium text-gray-500">
                    Empowering Justice Through AI-Powered Legal Guidance
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col border-2 border-dashed border-primary items-center text-center px-3 py-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <img
                                className="mb-4 rounded-lg w-20 shadow-md"
                                src={feature.gif}
                                alt={feature.title}
                            />
                            <h3 className="text-xl font-bold"><span className='bg-primary text-white px-2 rounded-md'>AI</span> {feature.title}</h3>
                            <p className="mt-2 text-gray-500 font-medium">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;