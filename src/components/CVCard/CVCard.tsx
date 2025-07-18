import { Paper, Typography } from "@mui/material";
import React from "react";

interface CvCardProps {
    cv: {
        id: number;
        name: string;
        education: string | null;
        description: string;
    };
    onClick: (id: number) => void;
}

export const CvCard: React.FC<CvCardProps> = ({ cv, onClick }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 2,
                cursor: "pointer",
                "&:hover": { backgroundColor: "grey.100" },
            }}
            onClick={() => onClick(cv.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick(cv.id)}
        >
            <Typography variant="h6" sx={{ borderBottom: 1, borderColor: "divider" }}>
                {cv.name}
            </Typography>
            {cv.education && (
                <Typography sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
                    Education: {cv.education}
                </Typography>
            )}
            <Typography variant="body2">{cv.description}</Typography>
        </Paper>
    );
};
