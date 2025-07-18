import { useQuery } from "@apollo/client";
import {
    Box,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";

import { GET_CVS } from "@/api/queries/getCVs";
import { getId } from "@/components/constants";

import { AddCV } from "./AddCV";

interface Skill {
    skill: {
        id: string;
        name: string;
    };
    level: string;
}

interface Language {
    language: {
        id: string;
        name: string;
    };
    level: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
}

interface Cv {
    id: number;
    created_at: string;
    name: string;
    education: string | null;
    description: string;
    skills: Skill[];
    languages: Language[];
    projects: Project[];
}

interface CvsData {
    cvs: Cv[];
}

export const CVs = () => {
    const userId = getId();
    const { data, loading, error } = useQuery<CvsData>(GET_CVS, {
        variables: { userId },
    });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error loading CVs</Typography>;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                CVs
            </Typography>
            <AddCV />
            {(data && data.cvs.length > 0) ? data?.cvs.map(cv => (
                <Box key={cv.id} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1">{cv.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Created: {new Date(cv.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>Description: {cv.description}</Typography>
                    {cv.education && <Typography>Education: {cv.education}</Typography>}

                    <Typography sx={{ mt: 2, fontWeight: "bold" }}>Skills:</Typography>
                    <List dense>
                        {cv.skills.map(skill => (
                            <ListItem key={skill.skill.id}>
                                <ListItemText
                                    primary={skill.skill.name}
                                    secondary={`Level: ${skill.level}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Typography sx={{ mt: 2, fontWeight: "bold" }}>Languages:</Typography>
                    <List dense>
                        {cv.languages.map(lang => (
                            <ListItem key={lang.language.id}>
                                <ListItemText
                                    primary={lang.language.name}
                                    secondary={`Level: ${lang.level}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    {cv.projects.length > 0 && (
                        <>
                            <Typography sx={{ mt: 2, fontWeight: "bold" }}>Projects:</Typography>
                            <List dense>
                                {cv.projects.map(project => (
                                    <ListItem key={project.id}>
                                        <ListItemText
                                            primary={project.name}
                                            secondary={project.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                    <Divider sx={{ my: 2 }} />
                </Box>
            )) : 'No CVs yet'}
        </Box>
    );
};
