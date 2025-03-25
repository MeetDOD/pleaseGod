import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ui/themeprovider';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    FaBalanceScale,
    FaHome,
    FaBriefcase,
    FaHeart,
    FaGavel,
    FaFileAlt,
    FaShieldAlt,
    FaUserShield,
    FaArrowRight,
    FaTimes
} from "react-icons/fa";
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';

const legalCategories = [
    {
        id: 1,
        name: "Tenant Rights",
        icon: <FaHome size={35} />,
        prompt: "Learn your rights as a tenant and how to handle eviction or rent issues.",
        details: {
            description: "Tenant rights in India are protected under various laws including the Rent Control Act and Transfer of Property Act.",
            keyPoints: [
                "Right to peaceful possession",
                "Right to basic amenities",
                "Protection against arbitrary eviction",
                "Right to fair rent"
            ],
            relevantLaws: [
                "Rent Control Act",
                "Transfer of Property Act",
                "Consumer Protection Act"
            ]
        }
    },
    {
        id: 2,
        name: "Wage Disputes",
        icon: <FaBriefcase size={35} />,
        prompt: "Understand what to do if you're not paid fairly or face unfair work treatment.",
        details: {
            description: "Wage disputes are governed by various labor laws ensuring fair compensation and working conditions.",
            keyPoints: [
                "Minimum wage rights",
                "Overtime compensation",
                "Equal pay for equal work",
                "Payment of wages act"
            ],
            relevantLaws: [
                "Payment of Wages Act",
                "Minimum Wages Act",
                "Equal Remuneration Act"
            ]
        }
    },
    {
        id: 3,
        name: "Family & Marriage Law",
        icon: <FaHeart size={35} />,
        prompt: "Get guidance on marriage, divorce, child custody, and domestic issues.",
        details: {
            description: "Family law in India covers marriage, divorce, custody, and inheritance matters.",
            keyPoints: [
                "Marriage registration",
                "Divorce procedures",
                "Child custody rights",
                "Maintenance laws"
            ],
            relevantLaws: [
                "Hindu Marriage Act",
                "Special Marriage Act",
                "Guardian and Wards Act"
            ]
        }
    },
    {
        id: 4,
        name: "Consumer Protection",
        icon: <FaShieldAlt size={35} />,
        prompt: "Learn how to file complaints and protect yourself from fraud and bad services.",
        details: {
            description: "Consumer protection laws safeguard your rights as a consumer against unfair trade practices.",
            keyPoints: [
                "Right to safety",
                "Right to information",
                "Right to choose",
                "Right to redressal"
            ],
            relevantLaws: [
                "Consumer Protection Act",
                "Competition Act",
                "Sale of Goods Act"
            ]
        }
    },
    {
        id: 5,
        name: "Criminal & Civil Law",
        icon: <FaGavel size={35} />,
        prompt: "Know your rights in legal matters like FIRs, bail, and small civil cases.",
        details: {
            description: "Criminal and civil laws govern different aspects of legal disputes and offenses.",
            keyPoints: [
                "FIR filing process",
                "Bail procedures",
                "Civil litigation",
                "Court procedures"
            ],
            relevantLaws: [
                "Indian Penal Code",
                "Code of Criminal Procedure",
                "Code of Civil Procedure"
            ]
        }
    },
    {
        id: 6,
        name: "Legal Documents",
        icon: <FaFileAlt size={35} />,
        prompt: "Create or understand documents like legal notices, agreements, and RTIs.",
        details: {
            description: "Legal documents are essential for various legal procedures and agreements.",
            keyPoints: [
                "Document preparation",
                "Notarization",
                "Registration",
                "RTI filing"
            ],
            relevantLaws: [
                "Registration Act",
                "Notaries Act",
                "Right to Information Act"
            ]
        }
    },
    {
        id: 7,
        name: "Cyber Law",
        icon: <FaUserShield size={35} />,
        prompt: "Protect yourself online – learn laws related to digital threats and privacy.",
        details: {
            description: "Cyber laws protect individuals and organizations from digital crimes and privacy violations.",
            keyPoints: [
                "Digital privacy",
                "Cybercrime prevention",
                "Data protection",
                "Online fraud"
            ],
            relevantLaws: [
                "Information Technology Act",
                "Personal Data Protection Bill",
                "Cybercrime Prevention Act"
            ]
        }
    },
    {
        id: 8,
        name: "Know the Law",
        icon: <FaBalanceScale size={35} />,
        prompt: "Basics of the Indian legal system to help you make informed decisions.",
        details: {
            description: "Understanding the fundamental aspects of the Indian legal system.",
            keyPoints: [
                "Constitutional rights",
                "Legal procedures",
                "Court system",
                "Legal aid"
            ],
            relevantLaws: [
                "Constitution of India",
                "Legal Services Authorities Act",
                "Court Fees Act"
            ]
        }
    }
];

const Modal = ({ isOpen, onClose, category }) => {
    if (!category) return null;

    // Add useEffect to handle scroll locking
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
    
        const disableScroll = () => {
            document.body.style.position = 'fixed'; // Fixes body in place
            document.body.style.top = `-${window.scrollY}px`; // Prevents jump on close
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden'; // Disable scrolling
        };
    
        const enableScroll = () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1); // Restore scroll position
        };
    
        if (isOpen) {
            disableScroll();
            window.addEventListener('keydown', handleEscape);
        } else {
            enableScroll();
            window.removeEventListener('keydown', handleEscape);
        }
    
        return () => {
            enableScroll(); // Cleanup
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);
    

    
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-[90%] max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-start mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="text-primary">{category.icon}</div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                    {category.name}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <p className="text-gray-600 dark:text-gray-300">
                                {category.details.description}
                            </p>
                            
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Key Points
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    {category.details.keyPoints.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Relevant Laws
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    {category.details.relevantLaws.map((law, index) => (
                                        <li key={index}>{law}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const Legalbasics = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Legal Basics - SATYADARSHI";
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Effects - Matching Hero.jsx */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(100%_50%_at_50%_0%,rgba(124,58,237,0.25)_0,rgba(124,58,237,0)_50%,rgba(124,58,237,0)_100%)]"></div>
            <div className="absolute inset-0 -z-10 h-full w-full">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(124,58,237,0.5)] opacity-50 blur-[80px]"></div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section - Matching Hero.jsx style */}
                <div className="text-center mb-12">

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Legal Basics: <span className="text-primary">Understanding Indian Law</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-medium">
                        Comprehensive guide to Indian legal system and your rights
                    </p>
                </div>

                {/* Categories Section - Matching Category.jsx style */}
                <section className="pb-20 pt-10 overflow-x-clip">
                    <h3 className="text-center text-gray-500 text-2xl font-semibold mb-12">Explore Legal Categories</h3>
                    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_30%,black_90%,transparent)]">
                        <motion.div
                            animate={{
                                x: "-50%"
                            }}
                            transition={{
                                duration: 25,
                                ease: "linear",
                                repeat: Infinity
                            }}
                            className="flex flex-none gap-24 pr-24"
                        >
                            {Array.from({ length: 2 }).map((_, index) => (
                                <React.Fragment key={index}>
                                    {legalCategories.map((category) => (
                                        <motion.div
                                            key={category.id}
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleCategoryClick(category)}
                                            className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="text-primary mb-2">{category.icon}</div>
                                            <div className="text-xl font-medium text-gray-800 dark:text-gray-200">{category.name}</div>
                                            <p className="text-sm text-gray-500 mt-2 max-w-[200px]">{category.prompt}</p>
                                        </motion.div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Features Section - Matching Features.jsx style */}
                <section className="pb-20 pt-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold sm:text-4xl">
                            Key Legal <span className="text-primary">Components</span>
                        </h2>
                        <p className="mt-4 text-lg font-medium text-gray-500">
                            Understanding the pillars of Indian legal system
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                title: "Supreme Court",
                                description: "The highest court in India with original, appellate, and advisory jurisdiction.",
                                icon: <FaGavel className="text-primary" size={40} />
                            },
                            {
                                title: "High Courts",
                                description: "State-level courts handling civil and criminal cases within their jurisdictions.",
                                icon: <FaBalanceScale className="text-primary" size={40} />
                            },
                            {
                                title: "Subordinate Courts",
                                description: "District courts and lower courts handling local legal matters.",
                                icon: <FaHome className="text-primary" size={40} />
                            },
                            {
                                title: "Legal Aid",
                                description: "Free legal assistance through NALSA and State Legal Services Authorities.",
                                icon: <FaShieldAlt className="text-primary" size={40} />
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="flex flex-col border-2 border-dashed border-primary items-center text-center px-3 py-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                <div className="mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="mt-2 text-gray-500 font-medium">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Action Button - Matching Hero.jsx style */}
                <div className="text-center mt-12">
                    <Button 
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-6 shadow-md"
                    >
                        Start Your Legal Journey
                    </Button>
                </div>
            </div>

            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={selectedCategory}
            />
        </div>
    );
};

export default Legalbasics;