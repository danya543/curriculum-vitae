import { Box, Typography } from "@mui/material";
import React from "react";

interface DetailsTabProps {
    description: string;
    education: string | null;
    createdAt: string;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
    description,
    education,
    createdAt,
}) => (
    <Box>
        <Typography variant="body1" paragraph>
            {description}
        </Typography>
        {education && (
            <Typography variant="body2" color="text.secondary" paragraph>
                Education: {education}
            </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
            Created at: {new Date(+createdAt).toLocaleDateString()}
        </Typography>
    </Box>
);
