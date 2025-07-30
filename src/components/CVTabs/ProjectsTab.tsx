import { gql, type Reference, useMutation, useQuery } from "@apollo/client";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { AddCvProjectInput, CvProject, Project } from "cv-graphql";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { ADD_CV_PROJECT } from "@/api/mutations/addCvProject";
import { GET_PROJECTS } from "@/api/queries/getProjects";
import { MenuPropsSx, redInputSx } from "@/components/constants";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import { SortHeader } from "@/components/SortHeader/SortHeader";
import type { ProjectsTabProps } from "@/types/types";
import { useAlert } from "@/ui/Alert/useAlert";

const columns = Array.from([
    { key: "name", label: "Name" },
    { key: "domain", label: "Domain" },
    { key: "startDate", label: "Start date" },
    { key: "endDate", label: "End date" },
] as const);

type SortKey = (typeof columns)[number]["key"];
type SortOrder = "asc" | "desc";

const fieldMap: Record<SortKey, keyof CvProject> = {
    name: "name",
    domain: "domain",
    startDate: "start_date",
    endDate: "end_date",
};


export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
    const { id } = useParams();
    const { showAlert } = useAlert();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const [form, setForm] = useState({
        name: "",
        domain: "",
        start_date: "",
        end_date: "",
        description: "",
        environment: "",
        responsibilities: '',
    });

    const { data: projectsData, loading: loadingProjects } = useQuery(GET_PROJECTS);
    const projectOptions = projectsData?.projects ?? [];

    const handleProjectSelect = (projectId: string) => {
        const selected = projectOptions.find((p: Project) => p.id === projectId);
        if (!selected) return;
        setForm({
            name: selected.id,
            domain: selected.domain,
            start_date: selected.start_date,
            end_date: selected.end_date ?? "",
            description: selected.description,
            environment: selected.environment.join(", "),
            responsibilities: selected.responsibilities ?? ''
        });
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const [createProject] = useMutation(ADD_CV_PROJECT, {
        update(cache, { data }) {
            const addedProjectData = data?.addCvProject;
            if (!addedProjectData || !id) return;

            const addedProjectOption = projectOptions.find((p: Project) => p.id === form.name);
            if (!addedProjectOption) return;

            const newProject = {
                __typename: "CvProject",
                id: addedProjectData.id,
                name: addedProjectOption.name,
                description: addedProjectOption.description,
                domain: addedProjectOption.domain,
                start_date: form.start_date,
                end_date: form.end_date,
                environment: addedProjectOption.environment,
                roles: [],
                responsibilities: form.responsibilities
                    ? form.responsibilities.split(',').map(s => s.trim())
                    : [],
                project: {
                    __typename: "Project",
                    id: addedProjectOption.id,
                    name: addedProjectOption.name,
                },
                internal_name: "",
            };

            const newProjectRef = cache.writeFragment({
                data: newProject,
                fragment: gql`
                    fragment NewCvProject on CvProject {
                        id
                        name
                        description
                        domain
                        start_date
                        end_date
                        environment
                        roles
                        responsibilities
                        project {
                            id
                            name
                        }
                        internal_name
                    }
                `,
            });

            cache.modify({
                id: cache.identify({ __typename: "Cv", id }),
                fields: {
                    projects(existingRefs = [] as readonly Reference[]) {
                        if (existingRefs.some((ref: Reference) => ref === newProjectRef)) {
                            return existingRefs;
                        }

                        return [...existingRefs, newProjectRef] as readonly Reference[];
                    },
                },
            });
        },
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setForm({ name: "", domain: "", start_date: "", end_date: "", description: "", environment: "", responsibilities: '' });
        setOpen(false);
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!id) return;
            const project: AddCvProjectInput = {
                cvId: id,
                projectId: form.name.trim(),
                start_date: new Date(form.start_date).toISOString(),
                responsibilities: form.responsibilities.length > 0 ? form.responsibilities.trim().split(',') : [],
                roles: [],
            };

            if (form.end_date) {
                project.end_date = new Date(form.end_date).toISOString();
            }

            await createProject({ variables: { project } });

            showAlert({ type: "success", message: "Project created" });
            handleClose();
        } catch (err) {
            console.error("Failed to create project:", err);
            showAlert({ type: "error", message: "Failed to create project" });
        }
    };

    const filteredProjects = [...projects]
        .filter(project =>
            project.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const key = fieldMap[sortKey];
            const aVal = a[key];
            const bVal = b[key];

            if (key.includes("date")) {
                const aDate = aVal ? new Date(aVal as string) : new Date("9999-12-31");
                const bDate = bVal ? new Date(bVal as string) : new Date("9999-12-31");

                return sortOrder === "asc"
                    ? aDate.getTime() - bDate.getTime()
                    : bDate.getTime() - aDate.getTime();
            }

            const aStr = typeof aVal === "string" ? aVal.toLowerCase() : "";
            const bStr = typeof bVal === "string" ? bVal.toLowerCase() : "";

            if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
            if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <TextField
                    label="Search Projects"
                    value={search}
                    sx={{
                        ...redInputSx,
                        '& .MuiOutlinedInput-root': {
                            height: '40px',
                            borderRadius: '25px',
                            '&.Mui-focused fieldset': { borderColor: '#C63031' },
                        },
                    }}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                />
                <Button sx={{ color: '#c63031' }} onClick={handleOpen}>
                    <Plus width={20} height={20} />Add Project
                </Button>
            </Box>

            <Box sx={{ width: '84%' }}>
                <SortHeader columns={columns} sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
            </Box>

            {filteredProjects.length === 0 ? (
                <Typography>No projects found.</Typography>
            ) : (filteredProjects.map((project: CvProject) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            )))}


            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create New Project</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1} sx={redInputSx}>
                        <Select
                            sx={redInputSx}
                            value={form.name}
                            onChange={(e) => handleProjectSelect(e.target.value)}
                            displayEmpty
                            disabled={loadingProjects}
                            MenuProps={MenuPropsSx}
                        >
                            <MenuItem value="" disabled>
                                Select a project
                            </MenuItem>
                            {projectOptions.map((project: Project) => (
                                <MenuItem key={project.id} value={project.id}>
                                    {project.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            sx={redInputSx}
                            label="Domain"
                            value={form.domain}
                            onChange={e => handleChange("domain", e.target.value)}
                            required
                            disabled
                        />
                        <TextField
                            sx={redInputSx}
                            label="Start Date"
                            value={form.start_date}
                            onChange={e => handleChange("start_date", e.target.value)}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            sx={redInputSx}
                            label="End Date"
                            value={form.end_date}
                            onChange={e => handleChange("end_date", e.target.value)}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            sx={redInputSx}
                            label="Description"
                            value={form.description}
                            onChange={e => handleChange("description", e.target.value)}
                            required
                            disabled
                        />
                        <TextField
                            sx={redInputSx}
                            label="Environment"
                            value={form.environment}
                            onChange={e => handleChange("environment", e.target.value)}
                            required
                            disabled
                        />
                        <TextField
                            sx={redInputSx}
                            label="Responsibilities (separate by comma)"
                            value={form.responsibilities}
                            onChange={e => handleChange("responsibilities", e.target.value)}
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: '#c63031' }} onClick={handleClose}>Cancel</Button>
                    <Button sx={{ backgroundColor: '#c63031' }} variant="contained" onClick={handleSubmit}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
