import { Box, Button, CircularProgress, List, Typography, useTheme } from "@mui/material";

import { SkillCard } from "@/components/SkillCard/SkillCard";
import { AddSkillDialog } from "@/components/SkillDialog/Add";
import { EditSkillDialog } from "@/components/SkillDialog/Edit";
import { useProfileSkills } from "@/hooks/useProfileSkills";

export const ProfileSkills = () => {
    const theme = useTheme();

    const {
        skillsLoading,
        skillsError,
        groupedSkills,
        groupedSelectSkills,
        deleteMode,
        setDeleteMode,
        selectedForDelete,
        setSelectedForDelete,
        addOpen,
        setAddOpen,
        editOpen,
        setEditOpen,
        selectedSkillId,
        setSelectedSkillId,
        selectedMastery,
        setSelectedMastery,
        handleAddSkill,
        handleUpdateSkill,
        handleDelete,
        handleEditClick,
    } = useProfileSkills();

    if (skillsLoading) return <CircularProgress />;
    if (skillsError) return <Typography color="error">Failed to load skills</Typography>;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Skills</Typography>
            {Object.entries(groupedSkills).length === 0 ? (
                <Typography>No skills added.</Typography>
            ) : (
                Object.entries(groupedSkills).map(([category, skills]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {category}
                        </Typography>
                        <List dense sx={{ display: "flex", flexWrap: "wrap" }}>
                            {skills.map((skill) => (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    deleteMode={deleteMode}
                                    isSelected={selectedForDelete.includes(skill.name)}
                                    onClick={() => {
                                        if (deleteMode) {
                                            const isSelected = selectedForDelete.includes(skill.name);
                                            setSelectedForDelete(prev =>
                                                isSelected
                                                    ? prev.filter(name => name !== skill.name)
                                                    : [...prev, skill.name]
                                            );
                                        } else {
                                            handleEditClick(skill);
                                        }
                                    }}
                                />
                            ))}
                        </List>
                    </Box>
                ))
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: '10px', mb: 2 }}>
                <Button
                    sx={{ background: 'transparent', color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'action.hover' } }}
                    onClick={() => setAddOpen(true)}
                >
                    Add Skill
                </Button>

                {deleteMode ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button sx={{ color: '#C63031', '&:hover': { backgroundColor: 'action.hover' } }} onClick={() => { setDeleteMode(false); setSelectedForDelete([]); }}>
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
                    <Button
                        sx={{ color: '#C63031', '&:hover': { backgroundColor: 'action.hover' } }}
                        onClick={() => setDeleteMode(true)}
                    >
                        Delete Skill
                    </Button>
                )}
            </Box>

            <AddSkillDialog
                open={addOpen}
                setOpen={setAddOpen}
                selectedSkillId={selectedSkillId}
                selectedMastery={selectedMastery}
                setSelectedSkillId={setSelectedSkillId}
                setSelectedMastery={setSelectedMastery}
                handleAddSkill={handleAddSkill}
                groupedSelectSkills={groupedSelectSkills}
            />

            <EditSkillDialog
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                selectedMastery={selectedMastery}
                setSelectedMastery={setSelectedMastery}
                handleUpdateSkill={handleUpdateSkill}
            />
        </Box>
    );
};
