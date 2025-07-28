import { useMutation, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";

import { ADD_PROFILE_SKILL } from "@/api/mutations/addProfileSkill";
import { DELETE_PROFILE_SKILL } from "@/api/mutations/deleteProfileSkill";
import { UPDATE_PROFILE_SKILL } from "@/api/mutations/updProfileSkill";
import { GET_PROFILE_INFO } from "@/api/queries/getProfileLangs";
import { GET_SKILL_CATEGORIES } from "@/api/queries/getSkillCategories";
import { GET_SKILLS } from "@/api/queries/getSkills";
import { useAuth } from "@/hooks/useAuth";
import type { MasteryLevel, Skill, Skills } from "@/types/types";
import { useAlert } from "@/ui/Alert/useAlert";

type ProfileSkills = {
    profile: { skills: Skill[] }
}

export const useProfileSkills = () => {
    const { id } = useAuth();
    const { showAlert } = useAlert();

    const { data: skillsData, loading: skillsLoading, error: skillsError } = useQuery<Skills>(GET_SKILLS);
    const { data: profileData } = useQuery<ProfileSkills>(GET_PROFILE_INFO, { variables: { userId: id } });
    const { data: categoryData } = useQuery<{ skillCategories: { id: string; name: string }[] }>(GET_SKILL_CATEGORIES);

    const [addSkill] = useMutation(ADD_PROFILE_SKILL);
    const [updateSkill] = useMutation(UPDATE_PROFILE_SKILL);
    const [deleteSkill] = useMutation(DELETE_PROFILE_SKILL);

    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState("");
    const [selectedMastery, setSelectedMastery] = useState<MasteryLevel | "">("");
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const categoryMap = useMemo(() => {
        const map: Record<string, string> = {};
        categoryData?.skillCategories.forEach(cat => {
            map[cat.id] = cat.name;
        });
        return map;
    }, [categoryData]);

    const groupedSkills = useMemo(() => {
        return profileData?.profile.skills.reduce<Record<string, Skill[]>>((acc, skill) => {
            const category = skill.category_name || categoryMap[skill.categoryId!] || "Uncategorized";
            (acc[category] ??= []).push(skill);
            return acc;
        }, {});
    }, [profileData, categoryMap]);

    const groupedSelectSkills = useMemo(() => {
        return (skillsData?.skills ?? []).reduce<Record<string, Skill[]>>((acc, skill) => {
            const category = skill.category_name || categoryMap[skill.categoryId!] || "Uncategorized";
            (acc[category] ??= []).push(skill);
            return acc;
        }, {});
    }, [skillsData, categoryMap]);

    const handleAddSkill = async () => {
        const skill = skillsData?.skills.find(s => s.id === selectedSkillId);
        const alreadyExists = profileData?.profile.skills.some((s) => s.name === skill?.name);
        if (alreadyExists) {
            showAlert({ type: "error", message: "This skill is already added" });
            return;
        }

        if (!skill || !selectedMastery) return;
        try {
            await addSkill({
                variables: {
                    skill: {
                        userId: id,
                        name: skill.name,
                        categoryId: skill.category.id,
                        mastery: selectedMastery,
                    },
                },
            });
            showAlert({ type: "success", message: "Skill added" });
            setAddOpen(false);
        } catch {
            showAlert({ type: "error", message: "Failed to add skill" });
        }
    };

    const handleUpdateSkill = async () => {
        if (!editingSkill) return;
        try {
            await updateSkill({
                variables: {
                    skill: {
                        userId: id,
                        name: editingSkill.name,
                        mastery: selectedMastery,
                    },
                },
            });
            showAlert({ type: "success", message: "Skill updated" });
            setEditOpen(false);
        } catch {
            showAlert({ type: "error", message: "Failed to update skill" });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteSkill({ variables: { skill: { userId: id, name: selectedForDelete } } });
            showAlert({ type: "success", message: "Skills deleted" });
            setDeleteMode(false);
            setSelectedForDelete([]);
        } catch {
            showAlert({ type: "error", message: "Failed to delete skills" });
        }
    };

    const handleEditClick = (skill: Skill) => {
        setEditingSkill(skill);
        setSelectedMastery(skill.mastery);
        setEditOpen(true);
    };

    return {
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
        editingSkill,
        handleAddSkill,
        handleUpdateSkill,
        handleDelete,
        handleEditClick,
    };
};
