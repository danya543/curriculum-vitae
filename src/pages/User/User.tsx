import { useQuery } from "@apollo/client";
import {
    Box,
    Container,
    Tab,
    Tabs,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { GET_USER } from "@/api/queries/getUser";
import { BreadcrumbsNav } from "@/components/Nav/Nav";
import { Profile } from "@/components/Profile/Profile";
import { Languages } from "@/pages/Languages/Languages";
import { ProfileSkills } from "@/pages/Skills/Skills";
import { Loader } from "@/ui/Loader/Loader";

const validTabs = ['profile', 'skills', 'languages'] as const;
type TabKey = typeof validTabs[number];

export const UserPage = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentTab = searchParams.get("tab") as TabKey;
    const initialTab: TabKey = validTabs.includes(currentTab) ? currentTab : "profile";
    const [tab, setTab] = useState<TabKey>(initialTab);

    useEffect(() => {
        setTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: TabKey) => {
        setSearchParams({ tab: newValue });
    };

    const { data, loading, error } = useQuery(GET_USER, {
        variables: { userId: id }
    });

    const user = data?.user;

    if (loading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>User not found</div>;

    const fullName = user.profile.full_name || user.email;
    const tabLabel = tab === "skills" ? "Skills" : tab === "languages" ? "Languages" : null;

    return (
        <Container sx={{ mt: 2, height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <BreadcrumbsNav
                breadcrumbs={[
                    { label: "Employees", to: "/users" },
                    tab !== "profile"
                        ? {
                            label: fullName,
                            to: `/users/${user.id}?tab=profile`
                        }
                        : { label: fullName },
                    ...(tabLabel ? [{ label: tabLabel }] : []),
                ]}
            />

            <Box sx={{ mt: 3, flexShrink: 0 }}>
                <Tabs
                    value={tab}
                    onChange={(e, value) => handleTabChange(e, value)}
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
                    <Tab label="Profile" value="profile" />
                    <Tab label="Skills" value="skills" />
                    <Tab label="Languages" value="languages" />
                </Tabs>
            </Box>

            <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'auto' }}>
                {tab === 'profile' && <Profile key={user.id} user={user} />}
                {tab === 'skills' && <ProfileSkills />}
                {tab === 'languages' && <Languages />}
            </Box>
        </Container>
    );
};
