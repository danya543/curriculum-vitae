import { useQuery } from "@apollo/client";
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material";

import { GET_SKILLS } from "@/api/queries/getSkills";
import type { SkillsData } from "@/api/types";

export const Skills = () => {
    const { data, loading, error } = useQuery<SkillsData>(GET_SKILLS);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error loading skills</Typography>;

    return (
        <Box
            sx={{
                maxHeight: "100vh",
                boxSizing: 'border-box',
                pr: 1,
            }}
        >
            <Typography variant="h6" gutterBottom>
                Skills List
            </Typography>
            <List>
                {data?.skills.map(skill => (
                    <ListItem key={skill.id} divider>
                        <ListItemText
                            primary={skill.name}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.primary">
                                        Category: {skill.category?.name || skill.category_name || "N/A"}
                                    </Typography>
                                    <br />
                                    <Typography component="span" variant="body2" color="text.secondary">
                                        Parent Category: {skill.category_parent_name || "N/A"}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
