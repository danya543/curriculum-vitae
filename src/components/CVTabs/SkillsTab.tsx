import { List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

import type { SkillsTabProps } from "@/types/types";

export const SkillsTab: React.FC<SkillsTabProps> = ({ skills }) => (
    <>
        {skills.length === 0 ? (
            <Typography>No skills added.</Typography>
        ) : (
            <List dense>
                {skills.map(({ name, mastery, categoryId }) => (
                    <ListItem key={categoryId}>
                        <ListItemText primary={name} secondary={`Level: ${mastery}`} />
                    </ListItem>
                ))}
            </List>
        )}
    </>
);
