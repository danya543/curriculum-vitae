import { useQuery } from "@apollo/client";
import {
    Box,
    Container,
    Tab,
    Tabs,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { GET_USER } from "@/api/queries/getUser";
import { BreadcrumbsNav } from "@/components/Nav/Nav";
import { Profile } from "@/components/Profile/Profile";
import { Languages } from "@/pages/Languages/Languages";
import { ProfileSkills } from "@/pages/Skills/Skills";
import { Loader } from "@/ui/Loader/Loader";

export const UserPage = () => {
    const { id } = useParams();
    const [tab, setTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const { data, loading, error } = useQuery(GET_USER, {
        variables: { userId: id }
    });

    const user = data?.user;

    if (loading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>User not found</div>;

    return (
        <Container sx={{ mt: 2, height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <BreadcrumbsNav breadcrumbs={[
                { label: "Employees", to: "/users" },
                { label: `${user.profile.full_name || user.email}` },
            ]} />

            <Box sx={{ mt: 3, flexShrink: 0 }}>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'rgb(198, 48, 49)',
                        },
                        '& .MuiTab-root': {
                            '&.Mui-selected': {
                                color: 'rgb(198, 48, 49)',
                            },
                        },
                    }}
                >
                    <Tab label="Profile" />
                    <Tab label="Skills" />
                    <Tab label="Languages" />
                </Tabs>
            </Box>

            <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'auto' }}>
                {tab === 0 && <Profile user={user} />}
                {tab === 1 && <ProfileSkills />}
                {tab === 2 && <Languages />}
            </Box>
        </Container>
    );
};
