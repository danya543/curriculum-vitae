import { useMutation } from "@apollo/client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

import { DELETE_CV } from "@/api/mutations/deleteCV";
import type { CvCardProps } from "@/types/types";

export const CvCard: React.FC<CvCardProps> = ({ cv, onClick, onDeleteSuccess, showAlert }) => {
    const [deleteCv] = useMutation(DELETE_CV);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDelete = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
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

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setAnchorEl(null);
    };

    const handleDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(cv.id);
        handleMenuClose();
    };

    return (
        <Paper
            elevation={1}
            sx={{
                px: 2,
                py: 1.5,
                mb: 1,
                borderRadius: 2,
                border: 'none',
                boxShadow: 'none',
                backgroundColor: "transparent",
            }}
            onClick={() => onClick(cv.id)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick(cv.id)}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 2,
                        flex: 1,
                        minWidth: 0,
                        alignItems: "center",
                    }}
                >
                    <Typography noWrap>{cv.name}</Typography>
                    <Typography noWrap sx={{ display: { xs: "none", sm: "block" } }}>
                        {cv.education || "-"}
                    </Typography>
                    <Typography noWrap sx={{ display: { xs: "none", sm: "block" } }}>
                        {cv.user?.email || "-"}
                    </Typography>
                </Box>

                <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    aria-label="menu"
                >
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => handleMenuClose()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MenuItem onClick={handleDetails}>Details</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
            </Box>

            {cv.description && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {cv.description}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};
