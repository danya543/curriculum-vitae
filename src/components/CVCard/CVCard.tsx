import { type Reference, type StoreObject, useMutation } from "@apollo/client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

import { DELETE_CV } from "@/api/mutations/deleteCV";
import type { CvCardProps } from "@/types/types";

export const CvCard: React.FC<CvCardProps> = ({ cv, onClick, showAlert }) => {
    const [deleteCv] = useMutation(DELETE_CV, {
        update(cache, { data }) {
            if (!data?.deleteCv?.affected) return;

            cache.modify({
                fields: {
                    cvs(existingCvs = [], { readField }) {
                        return existingCvs.filter(
                            (cvRef: Reference | StoreObject | undefined) => readField('id', cvRef) !== cv.id
                        );
                    },
                },
            });
        },
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const { data } = await deleteCv({ variables: { cv: { cvId: cv.id } } });

            if (data?.deleteCv?.affected > 0) {
                showAlert({ type: "success", message: "CV deleted successfully" });
            } else {
                showAlert({ type: "info", message: "CV not found or not deleted" });
            }
        } catch (error) {
            showAlert({ type: "error", message: "Error during removal CV" });
            console.error("Failed to delete CV:", error);
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(cv.id);
        handleMenuClose();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmOpen(true);
        handleMenuClose();
    };

    return (
        <>
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
                        onClose={handleMenuClose}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MenuItem onClick={handleDetails}>Details</MenuItem>
                        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
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

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onClick={(e) => e.stopPropagation()}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this CV? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
