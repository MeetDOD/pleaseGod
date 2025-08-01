import React from 'react';
import logo from '../assets/logo.png';
import { FaGithub, FaLinkedin, FaHome, FaInfoCircle, FaBook } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { BiWater } from "react-icons/bi";
import { IoIosPricetags } from "react-icons/io";

const socialLinks = [
    { id: 'github', url: 'https://github.com/shreyak-29', icon: FaGithub },
    { id: 'linkedin', url: 'https://www.linkedin.com/in/shreyakathe', icon: FaLinkedin }
];

const quickLinks = [
    { id: 'home', label: 'Home', hash: '/', icon: FaHome },
    { id: 'courses', label: 'Legal Basics', hash: '/courses', icon: FaBook },
    { id: 'about', label: 'About', hash: '/about', icon: FaInfoCircle },
    { id: 'riverflow', label: 'Case Explorer', hash: '/riverflow', icon: BiWater },
    { id: 'pricing', label: 'Pro Plans', hash: '/pricing', icon: IoIosPricetags }
];

const Footer = () => {
    return (
        <footer className="px-8 pt-10 pb-5 w-full font-montserrat mt-32 text-white bg-black/80 rounded-t-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-2xl mx-auto">
                <div className="flex flex-col items-center md:items-start p-4">
                    <img src={logo} alt="Logo" className="w-auto h-12 mb-4" />
                    <h2 className="font-bold text-primary text-3xl mb-4">For Source Code</h2>
                    <ul className="flex list-none p-0 gap-2">
                        {socialLinks.map((link) => (
                            <li key={link.id} className="hover:-translate-y-1 transition-transform duration-300 hover:text-primary">
                                <a href={link.url} target="_blank" className="text-2xl">
                                    <link.icon />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4">
                    <h2 className="font-bold text-primary text-3xl mb-4">Quick Links</h2>
                    <ul className="list-none p-0">
                        {quickLinks.map((link) => (
                            <li key={link.id} className="mb-2.5">
                                <Link
                                    to={link.hash}
                                    smooth
                                    className="flex flex-row w-fit items-center gap-2 text-[1rem] font-normal relative before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-primary hover:before:w-full before:transition-all before:duration-300 hover:text-primary"
                                >
                                    <link.icon size={17} /> {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4">
                    <h2 className="font-bold text-primary text-3xl mb-4">About SATYADARSHI</h2>
                    <p className="font-semibold">
                        <span className="text-3xl">👋</span> <span className="font-bold text-xl tracking-tight text-primary">SATYADARSHI</span> is dedicated to empowering individuals with legal awareness, personalized guidance, and access to trusted legal professionals. Begin your journey towards justice and informed decision-making today!
                    </p></div>
            </div>

            
        </footer>
    );
};

export default Footer;