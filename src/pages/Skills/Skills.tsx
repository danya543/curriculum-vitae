import { Box, Button, CircularProgress, List, Typography } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { SkillCard } from "@/components/SkillCard/SkillCard";
import { AddSkillDialog } from "@/components/SkillDialog/Add";
import { EditSkillDialog } from "@/components/SkillDialog/Edit";
import { useAuth } from "@/hooks/useAuth";
import { useProfileSkills } from "@/hooks/useProfileSkills";

export const ProfileSkills = () => {
    const location = useLocation();
    const [id, setId] = useState<string>('')
    const { id: paramsId } = useParams();
    const { id: userId, role: userRole } = useAuth()

    useEffect(() => {
        if (location.pathname.includes('/users') && paramsId) {
            setId(paramsId);
        } else if (userId) {
            setId(userId);
        }
    }, [location.pathname, paramsId, userId]);

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
    } = useProfileSkills({ id });

    if (skillsLoading) return <CircularProgress />;
    if (skillsError) return <Typography color="error">Failed to load skills</Typography>;

    const isAble = (!paramsId && userId) || paramsId === userId || userRole === 'Admin';

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Skills</Typography>
            {Object.entries(groupedSkills || {}).length === 0 ? (
                <Typography>No skills added.</Typography>
            ) : (
                Object.entries(groupedSkills || {}).map(([category, skills]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {category}
                        </Typography>
                        <List dense sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            {skills.map((skill) => (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    deleteMode={deleteMode}
                                    isSelected={selectedForDelete.includes(skill.name)}
                                    onClick={() => {
                                        if (isAble) {
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
                                        }
                                    }}
                                />
                            ))}
                        </List>
                    </Box>
                ))
            )}

            {isAble ?
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: '10px', mb: 2 }}>
                    {!deleteMode && <Button
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            color: 'rgb(118, 118, 118)',
                            '&:hover': { backgroundColor: 'action.hover' }
                        }}
                        onClick={() => setAddOpen(true)}
                    >
                        <Plus width={20} height={20} />Add Skill
                    </Button>}

                    {deleteMode ? (
                        <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
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
                    ) : Object.entries(groupedSkills || {}).length > 0 && (
                        <Button
                            sx={{ color: '#C63031', gap: '5px', '&:hover': { backgroundColor: 'action.hover' } }}
                            onClick={() => setDeleteMode(true)}
                        >
                            <Trash2 width={20} height={20} />Delete Skill
                        </Button>
                    )}
                </Box> : null}

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
