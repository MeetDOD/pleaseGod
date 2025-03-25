import React, { useState, useEffect } from 'react';
import { Card, CardDescription } from '@/components/ui/card';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useNavigate } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LegalAid = () => {
    const [legalDocs, setLegalDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLegalDocs = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/legal/docs`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setLegalDocs(data.data);
                } else {
                    setError('Failed to fetch legal documents');
                }
            } catch (error) {
                setError('Error fetching legal documents');
                console.error('Error fetching legal docs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLegalDocs();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
        }

        if (error) {
            return <div className="text-red-500 text-center">{error}</div>;
        }

        if (!legalDocs.length) {
            return <div className="text-center">No legal documents found.</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
                {legalDocs.map((doc) => (
                    <Card key={doc._id} className="p-6 shadow-sm hover:shadow-md border" style={{ backgroundColor: `var(--background-color)`, borderColor: `var(--borderColor)` }}>
                        <h2 className="text-xl font-bold mb-4 text-primary">Legal Recommendation</h2>
                        <CardDescription className="leading-relaxed line-clamp-3">
                            {doc.final_recommendation}
                        </CardDescription>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-primary mb-2">Legal Resources</h3>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                {doc.legal_resources[0].includes('[Collection]') ? (
                                    <>
                                        <li className='text-blue-600 hover:text-blue-800 hover:underline'>
                                            <a
                                                href="https://blog.ipleaders.in/how-to-evict-a-tenant-in-india/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                How to Evict a Tenant in India - Complete Guide
                                            </a>
                                        </li>
                                        <li className='text-blue-600 hover:text-blue-800 hover:underline'>
                                            <a
                                                href="https://www.investopedia.com/terms/e/eviction.asp"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Understanding Eviction Process - Investopedia
                                            </a>
                                        </li>
                                        <li className='text-blue-600 hover:text-blue-800 hover:underline'>
                                            <a
                                                href="https://lawbhoomi.com/eviction-of-a-tenant-in-india-grounds-process-and-more/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Eviction of a Tenant in India: Grounds, Process and More
                                            </a>
                                        </li>
                                    </>
                                ) : (
                                    doc.legal_resources[0]
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
                            <div className="flex justify-between items-center">
                                <Button
                                    onClick={() => navigate(`/mylegalaids/${doc._id}`)}
                                >
                                    View Details
                                </Button>
                                <Badge className="text-sm ">
                                    ID: {doc._id.slice(-6)}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                ))
                }
            </div >
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
                                <BreadcrumbPage className="font-semibold" style={{ color: `var(--text-color)` }}>Legal Aid</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                {renderContent()}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default LegalAid;
