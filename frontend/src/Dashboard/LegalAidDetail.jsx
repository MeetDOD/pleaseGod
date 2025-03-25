import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardDescription } from '@/components/ui/card';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdArrowOutward, MdRecommend } from "react-icons/md";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaCheckCircle } from "react-icons/fa";

const LegalAidDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [legalDoc, setLegalDoc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLegalDoc = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/legal/docs/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setLegalDoc(data.data);
                    console.log(data.data);
                } else {
                    setError('Failed to fetch legal document');
                }
            } catch (error) {
                setError('Error fetching legal document');
                console.error('Error fetching legal doc:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLegalDoc();
    }, [id]);

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
        }

        if (error) {
            return <div className="text-red-500 text-center">{error}</div>;
        }

        if (!legalDoc) {
            return <div className="text-center">No legal document found.</div>;
        }

        return (
            <div className="space-y-6">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/mylegalaids')}
                    className="mt-6 border"
                >
                    <IoMdArrowRoundBack /> Back
                </Button>

                <Card className="p-6 shadow-sm border" style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}>
                    <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2"><MdRecommend /> Legal Recommendation</h2>
                    <CardDescription className="leading-relaxed">{legalDoc.final_recommendation}</CardDescription>
                </Card>

                <Card className="p-6 shadow-sm border" style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}>
                    <h2 className="text-2xl font-bold mb-6 text-primary">Step-by-Step Guidance</h2>
                    <VerticalTimeline>
                        {legalDoc.step_by_step_guidance[0]
                            .split(/\. /)  // Split at ". " to break the steps
                            .map((step, index) => (
                                <VerticalTimelineElement
                                    key={index}
                                    className="vertical-timeline-element--work"
                                    contentStyle={{ background: '#f3f4f6', color: '#333' }}
                                    contentArrowStyle={{ borderRight: '7px solid  #2563eb' }}
                                    iconStyle={{ background: '#2563eb', color: '#fff' }}
                                    date={`Step ${index + 1}`}
                                    icon={<FaCheckCircle />}
                                >
                                    <h3 className="text-lg font-semibold">Step {index + 1}</h3>
                                    <p className="text-gray-700">{step.trim()}</p>
                                </VerticalTimelineElement>
                            ))}
                    </VerticalTimeline>
                </Card>




                {legalDoc.legal_resources && (
                    <Card className="p-6 shadow-sm" style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}>
                        <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2"><FaExternalLinkSquareAlt /> Legal Resources</h2>
                        <ul className="list-disc pl-5 space-y-3">
                            {legalDoc.legal_resources[0].includes('[Collection]') ? (
                                <>
                                    <li className='text-blue-600 hover:text-blue-800 hover:underline'>
                                        <a
                                            href="https://blog.ipleaders.in/how-to-evict-a-tenant-in-india/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            How to Evict a Tenant in India - Complete Guide <MdArrowOutward />
                                        </a>
                                    </li>
                                    <li className='text-blue-600 hover:text-blue-800 hover:underline'>
                                        <a
                                            href="https://www.investopedia.com/terms/e/eviction.asp"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Understanding Eviction Process - Investopedia <MdArrowOutward />
                                        </a>
                                    </li>
                                    <li className='text-blue-600 hover:text-blue-800 hover:underline'>
                                        <a
                                            href="https://lawbhoomi.com/eviction-of-a-tenant-in-india-grounds-process-and-more/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Eviction of a Tenant in India: Grounds, Process and More <MdArrowOutward />
                                        </a>
                                    </li>
                                </>
                            ) : (
                                // Regular links if no [Collection]
                                legalDoc.legal_resources[0]
                                    .replace(/[\[\]]/g, '')
                                    .split(',')
                                    .map((resource, index) => (
                                        <li key={index}>
                                            <a
                                                href={resource.trim()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {resource.trim()}
                                            </a>
                                        </li>
                                    ))
                            )}
                        </ul>
                    </Card>
                )}
            </div>
        );
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset style={{ backgroundColor: `var(--background-color)` }}>
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block font-semibold">
                                Dashboard
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-semibold" style={{ color: `var(--text-color)` }}>
                                    Legal Aid Details
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                {renderContent()}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default LegalAidDetail; 