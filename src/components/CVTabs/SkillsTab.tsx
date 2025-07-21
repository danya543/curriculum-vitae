import { useMutation, useQuery } from "@apollo/client";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    type SelectChangeEvent,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

import { ADD_CV_SKILL } from "@/api/mutations/addSkill";
import { UPDATE_CV_SKILL } from "@/api/mutations/updSkill";
import { GET_SKILLS } from "@/api/queries/getSkills";
import { useAlert } from "@/ui/Alert/useAlert";

const Mastery = ['Novice', 'Advanced', 'Competent', 'Proficient', 'Expert'] as const;
type MasteryLevel = typeof Mastery[number];

interface Skill {
    id: string;
    name: string;
    category: { id: string };
    categoryId: string;
    categoryName: string;
    category_parent_name: string;
    mastery: MasteryLevel;
}

interface Skills {
    skills: Skill[];
}

const masteryToProgress: Record<MasteryLevel, number> = {
    Novice: 20,
    Advanced: 40,
    Competent: 60,
    Proficient: 80,
    Expert: 100,
};

const masteryToColor: Record<MasteryLevel, string> = {
    Novice: "#d3d3d3",
    Advanced: "#00bcd4",
    Competent: "#4caf50",
    Proficient: "#ffeb3b",
    Expert: "#f44336",
};

export interface SkillsTabProps {
    skills: Skill[];
    cvId: number;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({ skills: initialSkills, cvId }) => {
    const { showAlert } = useAlert();
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [open, setOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);

    const [selectedSkillId, setSelectedSkillId] = useState<string>("");
    const [selectedMastery, setSelectedMastery] = useState<MasteryLevel | "">("");
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const { data: skillData } = useQuery<Skills>(GET_SKILLS);
    const [addCvSkill] = useMutation<{ addCvSkill: { skills: Skill[] } }>(ADD_CV_SKILL);
    const [updateCvSkill] = useMutation<{ updateCvSkill: { skills: Skill[] } }>(UPDATE_CV_SKILL);

    const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
        const categoryName: string = skill.categoryName || "Uncategorized";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(skill);
        return acc;
    }, {});

    const handleAddSkill = async (): Promise<void> => {
        const skill = skillData?.skills.find((s) => s.id === selectedSkillId);
        if (!skill || !selectedMastery) return;

        try {
            const { data } = await addCvSkill({
                variables: {
                    skill: {
                        cvId,
                        name: skill.name,
                        categoryId: skill.category?.id ?? null,
                        mastery: selectedMastery,
                    },
                },
            });

            if (data) {
                setSkills(data.addCvSkill.skills);
                showAlert({ type: "success", message: "Skill added successfully" });
            }

            setOpen(false);
            setSelectedSkillId("");
            setSelectedMastery("");
        } catch (err) {
            console.error(err);
            showAlert({ type: "error", message: "Failed to add skill" });
        }
    };

    const handleEditClick = (skill: Skill): void => {
        setEditingSkill(skill);
        setSelectedMastery(skill.mastery);
        setEditOpen(true);
    };

    const handleUpdateSkill = async (): Promise<void> => {
        if (!editingSkill || !selectedMastery) return;

        try {
            const { data } = await updateCvSkill({
                variables: {
                    skill: {
                        cvId,
                        name: editingSkill.name,
                        categoryId: editingSkill.category.id,
                        mastery: selectedMastery,
                    },
                },
            });

            if (data) {
                setSkills(data.updateCvSkill.skills);
                showAlert({ type: "success", message: "Skill updated successfully" });
            }

            setEditOpen(false);
            setEditingSkill(null);
        } catch (err) {
            console.error(err);
            showAlert({ type: "error", message: "Failed to update skill" });
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button variant="contained" onClick={() => { setOpen(true); }}>
                    Add Skill
                </Button>
            </Box>

            {Object.entries(groupedSkills).length === 0 ? (
                <Typography>No skills added.</Typography>
            ) : (
                Object.entries(groupedSkills).map(([category, skills]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>{category}</Typography>
                        <List dense>
                            {skills.map((skill) => (
                                <ListItem
                                    key={`${skill.categoryId}-${skill.name}`}
                                    onClick={() => handleEditClick(skill)}
                                >
                                    <ListItemText
                                        primary={skill.name}
                                        secondary={`Level: ${skill.mastery}`}
                                    />
                                    <Box sx={{ width: 150, ml: 2 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={masteryToProgress[skill.mastery]}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: "#eee",
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor: masteryToColor[skill.mastery],
                                                },
                                            }}
                                        />
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))
            )}

            {/* Add Skill Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Skill</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Skill</InputLabel>
                        <Select
                            value={selectedSkillId}
                            onChange={(e: SelectChangeEvent<string>) => setSelectedSkillId(e.target.value)}
                            label="Skill"
                        >
                            {skillData?.skills.map((skill) => (
                                <MenuItem key={skill.id} value={skill.id}>
                                    {skill.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Mastery</InputLabel>
                        <Select
                            value={selectedMastery}
                            onChange={(e: SelectChangeEvent<MasteryLevel>) => setSelectedMastery(e.target.value as MasteryLevel)}
                            label="Mastery"
                        >
                            {Mastery.map((level) => (
                                <MenuItem key={level} value={level}>
                                    {level}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddSkill}
                        disabled={!selectedSkillId || !selectedMastery}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Skill Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Skill</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Mastery</InputLabel>
                        <Select
                            value={selectedMastery}
                            onChange={(e: SelectChangeEvent<MasteryLevel>) => setSelectedMastery(e.target.value as MasteryLevel)}
                            label="Mastery"
                        >
                            {Mastery.map((level) => (
                                <MenuItem key={level} value={level}>
                                    {level}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateSkill}
                        disabled={!selectedMastery}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
