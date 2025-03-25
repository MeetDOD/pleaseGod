import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/auth";
import Loader from "@/services/Loader";

const Profile = () => {
    const user = useRecoilValue(userState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
        window.scrollTo(0, 0);
        document.title = `SATYADARSHI | ${user?.fullName?.toUpperCase()}'s PROFILE`;
    }, [user]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="py-10 min-h-screen">
            <div className="container mx-auto max-w-5xl shadow-lg rounded-xl overflow-hidden border" style={{ borderColor: `var(--borderColor)` }}>

                <div className="relative">
                    <div
                        className="h-48 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://static.canva.com/web/images/e733916c4616f5baa19098cc2844369b.jpg')`,
                        }}
                    ></div>
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <img
                            src={user?.photo}
                            alt="User Avatar"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                        />
                    </div>
                </div>

                <div className="mt-20 p-6 text-center">
                    <h1 className="text-4xl font-bold">{user?.fullName}</h1>
                    <h2 className="text-lg font-semibold text-gray-500 mt-2">{user?.email}</h2>
                </div>
            </div>
        </div>
    );
};

export default Profile;
