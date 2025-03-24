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
        document.title = `CAREERINSIGHT | ${user?.fullName?.toUpperCase()}'s PROFILE`;
    }, [user]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="py-10 min-h-screen">
            {user.fullName}
        </div>
    );
};

export default Profile;
