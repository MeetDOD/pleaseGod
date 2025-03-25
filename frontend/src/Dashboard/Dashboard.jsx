import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import AppSidebar from './AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
    const [legalDocs, setLegalDocs] = useState(null);

    useEffect(() => {
        const fetchLegalDocs = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
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
                }
            } catch (error) {
                console.error('Error fetching legal docs:', error);
            }
        };

        fetchLegalDocs();
    }, []);

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
                                <BreadcrumbPage className="font-semibold" style={{ color: `var(--text-color)` }}>My Profile</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                
                {legalDocs && (
                    <div className="mt-6 grid gap-6">
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Legal Recommendation</h2>
                            <p className="text-gray-700">{legalDocs.final_recommendation}</p>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Step-by-Step Guidance</h2>
                            {legalDocs.step_by_step_guidance[0].split(', ').map((step, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="font-semibold text-lg">{step.split(': ')[0]}</h3>
                                    <p className="text-gray-700">{step.split(': ')[1]}</p>
                                </div>
                            ))}
                        </Card>
                    </div>
                )}

                <Profile />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Dashboard;
