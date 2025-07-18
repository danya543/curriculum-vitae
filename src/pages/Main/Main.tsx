import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getId } from "@/components/constants"

export const MainPage = () => {
    const navigate = useNavigate();
    const id = getId();
    useEffect(() => {
        if (id) {
            navigate('/auth/login')
        }
    }, [navigate, id])
    return (
        <section>Main</section>
    )
}
