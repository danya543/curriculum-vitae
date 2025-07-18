import { List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

interface Skill {
    skill: {
        id: string;
        name: string;
    };
    level: string;
}

interface SkillsTabProps {
    skills: Skill[];
}

export const SkillsTab: React.FC<SkillsTabProps> = ({ skills }) => (
    <>
        {skills.length === 0 ? (
            <Typography>No skills added.</Typography>
        ) : (
            <List dense>
                {skills.map(({ skill, level }) => (
                    <ListItem key={skill.id}>
                        <ListItemText primary={skill.name} secondary={`Level: ${level}`} />
                    </ListItem>
                ))}
            </List>
        )}
    </>
);
