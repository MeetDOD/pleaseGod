import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton";
import AppSidebar from './AppSidebar';
import { FaPhotoVideo } from "react-icons/fa";

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/api/serp/youtube`)
            .then((res) => res.json())
            .then((data) => {
                setVideos(data.youtube_results || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching videos:", err);
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
                                    Google Videos
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-primary my-6 flex items-center gap-2"><FaPhotoVideo /> Latest Videos</h1>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill().map((_, index) => (
                                <Skeleton key={index} className="h-60 rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.length > 0 ? (
                                videos.map((video, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                                        style={{ backgroundColor: `var(--backgroundColor)`, borderColor: `var(--borderColor)` }}
                                    >
                                        <div className="relative group">
                                            <img
                                                src={video.thumbnail.rich}
                                                alt={video.title}
                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {/* Play Icon Overlay */}
                                            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg
                                                    className="w-12 h-12 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M4.5 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-13zm9.47 6.84l-4.68 2.73a.5.5 0 0 1-.75-.43V6.36a.5.5 0 0 1 .75-.43l4.68 2.73a.5.5 0 0 1 0 .84z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h2 className="text-xl font-semibold line-clamp-2">{video.title}</h2>
                                            <p className="text-gray-500 text-sm mt-2">{video.source}</p>
                                            <div className="mt-4">
                                                <a
                                                    href={video.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 font-medium transition duration-200"
                                                >
                                                    Watch Video →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No videos available.</p>
                            )}
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Videos;
