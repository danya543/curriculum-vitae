import { useQuery } from "@apollo/client"
import {
    Box,
    Breadcrumbs,
    Container,
    Tab,
    Tabs,
    Typography,
} from "@mui/material"
import { useState } from "react"
import { useParams } from "react-router-dom"

import { GET_USER } from "@/api/queries/getUser"
import { Languages } from "@/components/Languages/Languages"
import { Profile } from "@/components/Profile/Profile"
import { Skills } from "@/components/Skills/Skills"

// UserPage.tsx
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>User not found</div>;

    return (
        <Container sx={{ mt: 2 }}>
            <Breadcrumbs>
                <Typography color="text.secondary">Employees</Typography>
                <Typography color="text.primary">
                    {user.profile.first_name} {user.profile.last_name}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 3 }}>
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab label="Profile" />
                    <Tab label="Skills" />
                    <Tab label="Languages" />
                </Tabs>

                <Box sx={{ mt: 2 }}>
                    {tab === 0 && <Profile user={user} />}
                    {tab === 1 && <Skills />}
                    {tab === 2 && <Languages />}
                </Box>
            </Box>
        </Container>
    );
};
