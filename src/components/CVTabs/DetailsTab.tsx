import { Box, Typography } from "@mui/material";
import React from "react";

import type { DetailsTabProps } from "@/types/types";

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
