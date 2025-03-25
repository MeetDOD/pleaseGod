import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
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

const LegalAid = () => {
    const [legalDocs, setLegalDocs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    setLegalDocs(data.data[0]);
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

        if (!legalDocs) {
            return <div className="text-center">No legal documents found.</div>;
        }

        return (
            <div className="space-y-6">
                <Card className="p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Legal Recommendation</h2>
                    <p className="text-gray-700 leading-relaxed">{legalDocs.final_recommendation}</p>
                </Card>

                <Card className="p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-primary">Step-by-Step Guidance</h2>
                    <div className="space-y-6">
                        {legalDocs.step_by_step_guidance[0].split(', ').map((step, index) => (
                            <div key={index} className="border-l-4 border-primary pl-4">
                                <h3 className="font-semibold text-lg mb-2">{step.split(': ')[0]}</h3>
                                <p className="text-gray-700">{step.split(': ')[1]}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {legalDocs.legal_resources && (
                    <Card className="p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Legal Resources</h2>
                        <ul className="list-disc list-inside text-gray-700">
                            {legalDocs.legal_resources.map((resource, index) => (
                                <li key={index}>{resource}</li>
                            ))}
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
