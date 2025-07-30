import { Box, Button, List, Typography } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

import { SkillCard } from "@/components/SkillCard/SkillCard";
import { AddSkillDialog } from "@/components/SkillDialog/Add";
import { EditSkillDialog } from "@/components/SkillDialog/Edit";
import { useSkillsTab } from "@/hooks/useSkillTab";
import type { SkillsTabProps } from "@/types/types";


export const SkillsTab: React.FC<SkillsTabProps> = ({ initialSkills, cvId }) => {
    const {
        groupedSkills,
        deleteMode,
        selectedForDelete,
        handleEditClick,
        handleDelete,
        setDeleteMode,
        setSelectedForDelete,
        renderAddDialog,
        renderEditDialog,
    } = useSkillsTab({ initialSkills, cvId });

    return (
        <Box>
            {Object.entries(groupedSkills).length === 0 ? (
                <Typography>No skills added.</Typography>
            ) : (
                Object.entries(groupedSkills).map(([category, skills]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {category}
                        </Typography>
                        <List dense sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {skills.map((skill) => (
                                <SkillCard
                                    key={skill.name}
                                    skill={skill}
                                    deleteMode={deleteMode}
                                    isSelected={selectedForDelete.includes(skill.name)}
                                    onClick={() => {
                                        if (deleteMode) {
                                            const isChecked = selectedForDelete.includes(skill.name);
                                            setSelectedForDelete((prev) =>
                                                isChecked ? prev.filter(n => n !== skill.name) : [...prev, skill.name]
                                            );
                                        } else {
                                            handleEditClick(skill)
                                        }
                                    }}
                                />
                            ))}
                        </List>
                    </Box>
                ))
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: '10px', mb: 2 }}>
                <Button sx={{ color: 'rgb(118, 118, 118)', '&:hover': { background: 'action.hover' }, }} onClick={() => renderAddDialog.setOpen(true)}>
                    <Plus width={20} height={20} />Add Skill
                </Button>

                {deleteMode ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button sx={{ color: '#C63031' }} onClick={() => { setDeleteMode(false); setSelectedForDelete([]); }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={selectedForDelete.length === 0}
                            onClick={handleDelete}
                        >
                            Delete Selected
                        </Button>
                    </Box>
                ) : Object.entries(groupedSkills).length > 0 && (
                    <Button sx={{
                        color: '#C63031',
                        gap: '5px',
                        '&:hover': { background: 'action:hover' },
                    }} variant="text" onClick={() => setDeleteMode(true)}>
                        <Trash2 width={20} height={20} />Delete Skill
                    </Button>
                )}
            </Box>

            <AddSkillDialog {...renderAddDialog} />
            <EditSkillDialog {...renderEditDialog} />
        </Box>
    );
};
