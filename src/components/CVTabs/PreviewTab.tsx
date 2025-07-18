import { Box, Typography } from "@mui/material";
import React from "react";

interface PreviewTabProps {
    cvName: string;
    description: string;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ cvName, description }) => (
    <Box>
        <Typography variant="h5" gutterBottom>{cvName}</Typography>
        <Typography variant="body1">{description}</Typography>
    </Box>
);
