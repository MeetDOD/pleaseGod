import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { MdSpaceDashboard } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from "../assets/logo.png";
import { Separator } from "@/components/ui/separator"
import { tokenState, userState } from '@/store/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'sonner';
import { FaBandAid, FaFolderOpen, FaNewspaper, FaVideo } from "react-icons/fa";
import { MdSettingsVoice } from "react-icons/md";
import { Crown } from 'lucide-react';
import { FaMapMarked } from "react-icons/fa";
import { PiKanbanFill } from "react-icons/pi";

const data = {
    navMain: [
        { title: 'Dashboard', url: '/dashboard', icon: MdSpaceDashboard },
        { title: 'Legal Aid', url: '/legalaid', icon: FaBandAid },
        { title: 'My Legal Aids', url: '/mylegalaids', icon: FaFolderOpen },
        { title: 'AI Consultant', url: '/aiconsultant', icon: FaVideo },
        { title: 'AI Podcast', url: '/podcast', icon: MdSettingsVoice },
        { title: 'News', url: '/news', icon: FaNewspaper },
        { title: 'Legal Videos', url: '/legalvideos', icon: FaVideo },
        { title: 'Search Map', url: '/map', icon: FaMapMarked },
        { title: 'Kanban Board', url: '/kanbanboard', icon: PiKanbanFill }
    ],
};

const AppSidebar = () => {

    const location = useLocation();
    const setTokenState = useSetRecoilState(tokenState);
    const navigate = useNavigate();
    const user = useRecoilValue(userState);
    console.log(user)
    const handleLogout = () => {
        localStorage.removeItem("token");
        setTokenState("");
        toast.success("Logged out successfully");
        navigate("/");
    };

    const proFeatures = ['Legal Aid', 'AI Consultant', 'AI Podcast'];

    return (
        <Sidebar className="w-[275px] min-h-screen shadow-md" style={{ color: `var(--text-color)`, borderColor: `var(--borderColor)` }}>
            <SidebarHeader className="px-4" style={{ backgroundColor: `var(--background-color)` }}>
                <div className="flex items-center gap-3 justify-center my-1">
                    <img src={logo} onClick={() => navigate("/")} alt="Logo" className="w-auto h-16 cursor-pointer object-contain" />
                </div>
            </SidebarHeader>

            <SidebarContent className="flex flex-col px-4" style={{ backgroundColor: `var(--background-color)` }}>
                <Separator orientation="horizontal" className="my-1.5 h-[0.2px] bg-primary" />
                <SidebarMenu>
                    {data.navMain.map((item, index) => {
                        const isActive = location.pathname === item.url;
                        const isPro = proFeatures.includes(item.title);

                        return (
                            <SidebarMenuItem key={index}>
                                <Link
                                    to={item.url}
                                    className={`flex items-center gap-3.5 px-3 py-2 my-0.5 rounded-lg text-sm font-medium transition-all duration-200
                                        hover:bg-primary hover:text-white hover:shadow-sm
                                        ${isActive ? "bg-primary shadow-md" : ''}`}
                                    style={{ color: `var(--text-color)` }}>

                                    <div className="p-1.5 rounded-md" style={{ backgroundColor: `var(--text-color)` }}>
                                        <item.icon style={{ color: `var(--background-color)` }} size={20} />
                                    </div>

                                    <div className="text-sm font-semibold flex items-center">
                                        {item.title}
                                        {user?.isPaid && isPro && (
                                            <Crown className="text-yellow-400 ml-2" size={18} />
                                        )}
                                    </div>
                                </Link>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4" style={{ backgroundColor: `var(--background-color)`, color: `var(--text - color)` }}>
                <Separator orientation="horizontal" className="my-1.5 h-[0.2px] bg-primary" />
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full py-2 text-sm font-medium hover:bg-red-600 hover:text-white transition"
                >
                    Logout
                </Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default AppSidebar;
