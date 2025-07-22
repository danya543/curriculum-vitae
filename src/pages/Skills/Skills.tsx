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
                boxSizing: "border-box",
                pr: 1,
                width: "100%",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Skills List
            </Typography>
            <List
                sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    overflowWrap: "break-word",
                }}
            >
                {data?.skills.map((skill) => (
                    <ListItem key={skill.id} divider>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {skill.name}
                                </Typography>
                            }
                            secondary={
                                <>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                        sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                    >
                                        Category: {skill.category?.name || skill.category_name || "N/A"}
                                    </Typography>
                                    <br />
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                    >
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
