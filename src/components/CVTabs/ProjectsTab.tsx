import { useMutation } from "@apollo/client";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

import { CREATE_PROJECT } from "@/api/mutations/createProject";
import type { ProjectsTabProps } from "@/types/types";
import { useAlert } from "@/ui/Alert/useAlert";

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
    const { showAlert } = useAlert();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: "",
        domain: "",
        start_date: "",
        end_date: "",
        description: "",
        environment: "",
    });

    const [createProject] = useMutation(CREATE_PROJECT);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setForm({ name: "", domain: "", start_date: "", end_date: "", description: "", environment: "" });
        setOpen(false);
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await createProject({
                variables: {
                    project: {
                        name: form.name,
                        domain: form.domain,
                        start_date: form.start_date,
                        end_date: form.end_date || null,
                        description: form.description,
                        environment: form.environment.split(',').map(e => e.trim()),
                    },
                },
            });

            showAlert({ type: "success", message: "Project created" });
            handleClose();
        } catch (err) {
            console.error("Failed to create project:", err);
            showAlert({ type: "error", message: "Failed to create project" });
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <TextField
                    label="Search Projects"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                />
                <Button variant="contained" onClick={handleOpen}>
                    Create Project
                </Button>
            </Box>

            {filteredProjects.length === 0 ? (
                <Typography>No projects found.</Typography>
            ) : (
                <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                    <List dense>
                        {filteredProjects.map(({ id, name, description }) => (
                            <ListItem key={id}>
                                <ListItemText primary={name} secondary={description} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create New Project</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={e => handleChange("name", e.target.value)}
                            required
                        />
                        <TextField
                            label="Domain"
                            value={form.domain}
                            onChange={e => handleChange("domain", e.target.value)}
                            required
                        />
                        <TextField
                            label="Start Date"
                            value={form.start_date}
                            onChange={e => handleChange("start_date", e.target.value)}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            label="End Date"
                            value={form.end_date}
                            onChange={e => handleChange("end_date", e.target.value)}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Description"
                            value={form.description}
                            onChange={e => handleChange("description", e.target.value)}
                            required
                        />
                        <TextField
                            label="Environment (comma separated)"
                            value={form.environment}
                            onChange={e => handleChange("environment", e.target.value)}
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
