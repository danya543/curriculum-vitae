import { Box, Typography } from "@mui/material";
import React from "react";

import type { PreviewTabProps } from "@/types/types";

export const PreviewTab: React.FC<PreviewTabProps> = ({ cvName, description }) => (
    <Box>
        <Typography variant="h5" gutterBottom>{cvName}</Typography>
        <Typography variant="body1">{description}</Typography>
    </Box>
);
