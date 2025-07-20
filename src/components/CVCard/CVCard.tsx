import { useMutation } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Fade,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import React from "react";

import { DELETE_CV } from "@/api/mutations/deleteCV";
import type { CvCardProps } from "@/types/types";

export const CvCard: React.FC<CvCardProps> = ({ cv, onClick, onDeleteSuccess, showAlert }) => {
    const [deleteCv] = useMutation(DELETE_CV);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const { data } = await deleteCv({ variables: { cv: { cvId: cv.id } } });

            if (data?.deleteCv?.affected > 0) {
                showAlert({ type: "success", message: "CV deleted successfully" });
                onDeleteSuccess(cv.id);
            } else {
                showAlert({ type: "info", message: "CV not found or not deleted" });
            }
        } catch (error) {
            showAlert({ type: "error", message: "Error during removal CV" });
            console.error("Failed to delete CV:", error);
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 2,
                cursor: "pointer",
                position: "relative",
                "&:hover": {
                    backgroundColor: "grey.100",
                    ".delete-btn": {
                        opacity: 1,
                    },
                },
            }}
            onClick={() => onClick(cv.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick(cv.id)}
        >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <Fade in>
                    <IconButton
                        className="delete-btn"
                        onClick={handleDelete}
                        sx={{ opacity: 0, transition: "opacity 0.3s" }}
                        aria-label="delete CV"
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Fade>
            </Box>

            <Typography
                variant="h6"
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                {cv.name}
            </Typography>
            {cv.education && (
                <Typography
                    sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}
                >
                    Education: {cv.education}
                </Typography>
            )}
            <Typography variant="body2">{cv.description}</Typography>
        </Paper>
    );
};
