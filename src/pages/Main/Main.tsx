import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

export const MainPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login')
        }
    }, [navigate, isAuthenticated])
    return (
        <section>Main</section>
    )
}
