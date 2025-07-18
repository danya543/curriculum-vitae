import { List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

interface Project {
    id: string;
    name: string;
    description: string;
}

interface ProjectsTabProps {
    projects: Project[];
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => (
    <>
        {projects.length === 0 ? (
            <Typography>No projects added.</Typography>
        ) : (
            <List dense>
                {projects.map(({ id, name, description }) => (
                    <ListItem key={id}>
                        <ListItemText primary={name} secondary={description} />
                    </ListItem>
                ))}
            </List>
        )}
    </>
);
