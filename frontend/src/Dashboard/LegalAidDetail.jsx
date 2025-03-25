import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';

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
                    variant="outline" 
                    onClick={() => navigate('/legal-assistant')}
                    className="mb-6"
                >
                    ← Back to All Recommendations
                </Button>

                <Card className="p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Legal Recommendation</h2>
                    <p className="text-gray-700 leading-relaxed">{legalDoc.final_recommendation}</p>
                </Card>

                <Card className="p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-primary">Step-by-Step Guidance</h2>
                    <div className="space-y-6">
                        {legalDoc.step_by_step_guidance[0].split(', ').map((step, index) => (
                            <div key={index} className="border-l-4 border-primary pl-4">
                                <h3 className="font-semibold text-lg mb-2">{step.split(': ')[0]}</h3>
                                <p className="text-gray-700">{step.split(': ')[1]}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {legalDoc.legal_resources && (
                    <Card className="p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Legal Resources</h2>
                        <ul className="list-disc pl-5 space-y-3">
                            {legalDoc.legal_resources[0]
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