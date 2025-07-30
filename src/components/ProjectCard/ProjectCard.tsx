import { useMutation } from "@apollo/client";
import { MoreVert } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import type { CvProject } from "cv-graphql";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { REMOVE_CV_PROJECT } from "@/api/mutations/deleteCvProject";
import { UPDATE_CV_PROJECT } from "@/api/mutations/updCvProject";
import { useAlert } from "@/ui/Alert/useAlert";

import { redInputSx } from "../constants";

type ProjectCardProps = {
    project: CvProject;
    onDelete: (id: string) => void;
    onUpdate: (updated: CvProject) => void;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, onUpdate }) => {
    const { showAlert } = useAlert();
    const { id: cvId } = useParams();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({
        start_date: project.start_date,
        end_date: project.end_date ?? "",
        roles: project.roles.join(", "),
        responsibilities: project.responsibilities.join(", "),
    });

    const [deleteProject] = useMutation(REMOVE_CV_PROJECT);
    const [updateProject] = useMutation(UPDATE_CV_PROJECT);

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDelete = async () => {
        try {
            await deleteProject({
                variables: {
                    project: {
                        cvId,
                        projectId: project.project.id,
                    }
                },
            });
            onDelete(project.id)
            showAlert({ type: "success", message: "Project deleted" });
        } catch {
            showAlert({ type: "error", message: "Failed to delete project" });
        }
        handleMenuClose();
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
        handleMenuClose();
    };
    const handleDialogClose = () => setOpenDialog(false);

    const handleFormChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        try {
            const projectPayload = {
                cvId,
                projectId: project.id,
                start_date: new Date(form.start_date).toISOString(),
                end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
                roles: form.roles.split(",").map(s => s.trim()),
                responsibilities: form.responsibilities.split(",").map(s => s.trim()),
            };
            await updateProject({
                variables: {
                    project: projectPayload
                },
            });
            onUpdate({
                ...project,
                start_date: projectPayload.start_date,
                end_date: projectPayload.end_date,
                roles: projectPayload.roles,
                responsibilities: projectPayload.responsibilities,
            });
            showAlert({ type: "success", message: "Project updated" });
            handleDialogClose();
        } catch {
            showAlert({ type: "error", message: "Failed to update project" });
        }
    };

    return (
        <Box sx={{ p: 2, mb: 2, border: "none" }}>
            <Box sx={{
                display: "grid", gridTemplateColumns: `repeat(5, 1fr)`,
                gap: 2, alignItems: "center"
            }}>
                <Typography><b>{project.name}</b></Typography>
                <Typography>{project.domain}</Typography>
                <Typography>{(project.start_date)}</Typography>
                <Typography>{project.end_date ? (project.end_date) : "Till now"}</Typography>
                <IconButton onClick={handleMenuOpen}>
                    <MoreVert />
                </IconButton>
            </Box>

            <Typography sx={{ mt: 1, whiteSpace: "pre-line" }}>{project.description}</Typography>

            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {project.responsibilities.map((resp, idx) => (
                    <Box
                        key={idx}
                        sx={() => ({
                            backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[200],
                            borderRadius: 5,
                            px: 1.5,
                            py: 0.5,
                            fontSize: 14,
                        })}
                    >
                        {resp}
                    </Box>
                ))}
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleDialogOpen}>Update</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

            <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Update Project</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            sx={redInputSx}
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={form.start_date}
                            onChange={e => handleFormChange("start_date", e.target.value)}
                        />
                        <TextField
                            sx={redInputSx}
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={form.end_date}
                            onChange={e => handleFormChange("end_date", e.target.value)}
                        />
                        <TextField
                            sx={redInputSx}
                            label="Roles"
                            value={form.roles}
                            onChange={e => handleFormChange("roles", e.target.value)}
                            placeholder="Comma separated"
                        />
                        <TextField
                            sx={redInputSx}
                            label="Responsibilities"
                            value={form.responsibilities}
                            onChange={e => handleFormChange("responsibilities", e.target.value)}
                            placeholder="Comma separated"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: '#c63031' }} onClick={handleDialogClose}>Cancel</Button>
                    <Button sx={{ backgroundColor: '#c63031' }} variant="contained" onClick={handleUpdate}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
