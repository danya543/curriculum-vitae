import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { GET_CV } from "@/api/queries/getCV";
import { CVTabs } from "@/components/CVTabs/CVTabs";
import { DetailsTab } from "@/components/CVTabs/DetailsTab";
import { PreviewTab } from "@/components/CVTabs/PreviewTab";
import { ProjectsTab } from "@/components/CVTabs/ProjectsTab";
import { SkillsTab } from "@/components/CVTabs/SkillsTab";
import { BreadcrumbsNav } from "@/components/Nav/Nav";

export const CVPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data, loading, error } = useQuery(GET_CV, {
        variables: { cvId: id },
    });

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <Typography color="error">
                Error loading CV: {error.message}
            </Typography>
        );

    if (!data?.cv) return <Typography>CV not found</Typography>;

    const cv = data.cv;

    return (
        <Box sx={{ p: 3 }}>
            <BreadcrumbsNav breadcrumbs={[
                { label: "CVs", to: "/cvs" },
                { label: cv.name },
            ]} />
            <CVTabs
                details={
                    <DetailsTab
                        description={cv.description}
                        education={cv.education}
                        createdAt={cv.created_at}
                    />
                }
                skills={<SkillsTab skills={cv.skills} />}
                projects={<ProjectsTab projects={cv.projects} />}
                preview={<PreviewTab cvName={cv.name} description={cv.description} />}
            />
        </Box>
    );
};
