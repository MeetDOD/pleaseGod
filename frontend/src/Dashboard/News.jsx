import { SidebarContent } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/api/serp/news`)
            .then((res) => res.json())
            .then((data) => {
                setNews(data.news_results || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching news:", err);
                setLoading(false);
            });
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset style={{ backgroundColor: `var(--background-color)` }}>
                <div className="flex items-center gap-2 p-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block font-semibold">
                                Dashboard
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="p-4 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Latest News</h1>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid gap-4">
                            {news.length > 0 ? (
                                news.map((article, index) => (
                                    <div key={index} className="border rounded-lg p-4 flex items-start space-x-4">
                                        {article.thumbnail && (
                                            <img
                                                src={article.thumbnail || article.thumbnail_small}
                                                alt={article.title}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <h2 className="text-lg font-semibold">{article.title}</h2>
                                            <p className="text-gray-600 text-sm">{article.source?.name}</p>
                                            <a
                                                href={article.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                Read more
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No news available.</p>
                            )}
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default News;
