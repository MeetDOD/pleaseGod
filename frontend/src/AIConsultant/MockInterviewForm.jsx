import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { userState } from "@/store/auth";
import { useRecoilValue } from "recoil";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { startAssistant } from "@/services/vapi";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/Dashboard/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const avatar = [
    {
        imageUrl: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671140.jpg",
    },
    {
        imageUrl: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671163.jpg",
    },
    {
        imageUrl: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671132.jpg",
    },
    {
        imageUrl: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671159.jpg",
    },
    {
        imageUrl: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg",
    },
    {
        imageUrl: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671151.jpg",
    }
]

const MockInterviewForm = () => {
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");  // State for phone number
    const navigate = useNavigate();
    const user = useRecoilValue(userState);

    const handleStartCall = async () => {
        if (!phoneNumber) {
            alert("Please enter your phone number.");
            return;
        }

        setLoading(true);
        try {
            const data = await startAssistant(phoneNumber);
            if (data?.id) {
                navigate(`/interviewscreen?call_id=${data.id}&phone=${phoneNumber}`);
            } else {
                alert("Failed to start the call. Please try again.");
            }
        } catch (error) {
            console.error("Error starting call:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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
                                    <BreadcrumbPage className="font-semibold" style={{ color: `var(--text-color)` }}>AI Legal Consultant</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div
                        className="flex flex-col border p-8 rounded-lg shadow-sm mt-10"
                        style={{ borderColor: `var(--borderColor)`, backgroundColor: `var(--background-color)` }}
                    >
                        <div className="mb-2 items-center justify-center flex">
                            <AvatarCircles avatarUrls={avatar} />
                        </div>
                        <h2 className="text-2xl font-semibold text-center">AI Legal Consultant</h2>
                        <h2 className="text-sm font-semibold text-center mb-2 text-gray-500">
                            Get Expert Legal Guidance in Minutes
                        </h2>
                        <Label>Your phone number<span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            className="inputField mt-3"
                        />

                        <div className="w-full mt-6 flex sm:flex-row flex-col justify-center gap-4">
                            <Button className="w-full border" variant="secondary" onClick={() => navigate("/legalaid")}>
                                Legal Aid
                            </Button>
                            <Button className="w-full" onClick={handleStartCall} disabled={loading}>
                                {loading ? "Starting..." : "Start Interview"}
                            </Button>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default MockInterviewForm;