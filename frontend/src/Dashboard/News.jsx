import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import AppSidebar from "./AppSidebar";
import { FaRegNewspaper } from "react-icons/fa6";

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
                <div className="flex items-center gap-2 mb-4">
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
                                    Google News
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-primary my-6 flex items-center gap-2"><FaRegNewspaper /> Latest News</h1>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill().map((_, index) => (
                                <Skeleton key={index} className="h-48 rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.length > 0 ? (
                                news.map((article, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                                        style={{ backgroundColor: `var(--backgroundColor)`, borderColor: `var(--borderColor)` }}
                                    >
                                        {article.thumbnail && (
                                            <img
                                                src={article.thumbnail}
                                                alt={article.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <h2 className="text-xl font-semibold">{article.title}</h2>
                                            <p className="text-gray-500 text-sm mt-2">
                                                {article.source?.name || "Unknown Source"}
                                            </p>
                                            <div className="mt-4">
                                                <a
                                                    href={article.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 font-medium transition duration-200"
                                                >
                                                    Read more →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No news available.</p>
                            )}
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default News;
