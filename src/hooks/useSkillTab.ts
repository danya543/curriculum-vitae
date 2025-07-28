import { useMutation, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";

import { ADD_CV_SKILL } from "@/api/mutations/addSkill";
import { DELETE_CV_SKILL } from "@/api/mutations/deleteSkill";
import { UPDATE_CV_SKILL } from "@/api/mutations/updSkill";
import { GET_SKILL_CATEGORIES } from "@/api/queries/getSkillCategories";
import { GET_SKILLS } from "@/api/queries/getSkills";
import type { MasteryLevel, Skill, SkillCategory, Skills, SkillsTabProps } from "@/types/types";
import { useAlert } from "@/ui/Alert/useAlert";

export const useSkillsTab = ({ initialSkills, cvId }: SkillsTabProps) => {
    const { showAlert } = useAlert();
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);
    const [selectedSkillId, setSelectedSkillId] = useState<string>("");
    const [selectedMastery, setSelectedMastery] = useState<MasteryLevel | "">("");
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    const { data: skillData } = useQuery<Skills>(GET_SKILLS);
    const { data: categoryData } = useQuery<{ skillCategories: SkillCategory[] }>(GET_SKILL_CATEGORIES);

    const [addCvSkill] = useMutation(ADD_CV_SKILL);
    const [updateCvSkill] = useMutation(UPDATE_CV_SKILL);
    const [deleteCvSkill] = useMutation(DELETE_CV_SKILL);

    const categoryMap = useMemo(() => {
        const map: Record<string, string> = {};
        categoryData?.skillCategories.forEach(cat => {
            map[cat.id] = cat.name;
        });
        return map;
    }, [categoryData]);

    const groupedSkills = useMemo(() => {
        return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
            const category = skill.category_name || categoryMap[skill.categoryId!] || "Uncategorized";
            (acc[category] ??= []).push(skill);
            return acc;
        }, {});
    }, [skills, categoryMap]);

    const groupedSelectSkills = useMemo(() => {
        return (skillData?.skills ?? []).reduce<Record<string, Skill[]>>((acc, skill) => {
            const category = skill.category_name || categoryMap[skill.categoryId!] || "Uncategorized";
            (acc[category] ??= []).push(skill);
            return acc;
        }, {});
    }, [skillData, categoryMap]);

    const handleEditClick = (skill: Skill) => {
        if (deleteMode) {
            const isSelected = selectedForDelete.includes(skill.name);
            setSelectedForDelete(prev =>
                isSelected ? prev.filter(n => n !== skill.name) : [...prev, skill.name]
            );
        } else {
            setEditingSkill(skill);
            setSelectedMastery(skill.mastery);
            setEditOpen(true);
        }
    };

    const handleAddSkill = async () => {
        const skill = skillData?.skills.find(s => s.id === selectedSkillId);
        if (!skill || !selectedMastery) return;
        const alreadyExist = skills.some(s => s.name === skill.name)
        if (alreadyExist) {
            showAlert({ type: 'error', message: 'Skill already existed' });
            return
        }
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
                showAlert({ type: "success", message: "Skill added" });
                setOpen(false);
                setSelectedSkillId("");
                setSelectedMastery("");
            }
        } catch {
            showAlert({ type: "error", message: "Failed to add skill" });
        }
    };

    const handleUpdateSkill = async () => {
        if (!editingSkill || !selectedMastery) return;
        try {
            const { data } = await updateCvSkill({
                variables: {
                    skill: {
                        cvId,
                        name: editingSkill.name,
                        categoryId: editingSkill.categoryId,
                        mastery: selectedMastery,
                    },
                },
            });
            if (data) {
                setSkills(data.updateCvSkill.skills);
                showAlert({ type: "success", message: "Skill updated" });
                setEditOpen(false);
                setEditingSkill(null);
            }
        } catch {
            showAlert({ type: "error", message: "Failed to update skill" });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCvSkill({
                variables: {
                    skill: {
                        cvId,
                        name: selectedForDelete,
                    },
                },
            });
            setSkills(skills.filter(s => !selectedForDelete.includes(s.name)));
            showAlert({ type: "success", message: "Skills deleted" });
        } catch {
            showAlert({ type: "error", message: "Failed to delete skills" });
        }
        setDeleteMode(false);
        setSelectedForDelete([]);
    };

    return {
        groupedSkills,
        deleteMode,
        selectedForDelete,
        setDeleteMode,
        setSelectedForDelete,
        handleEditClick,
        handleDelete,
        renderAddDialog: {
            open,
            setOpen,
            selectedSkillId,
            selectedMastery,
            setSelectedSkillId,
            setSelectedMastery,
            handleAddSkill,
            groupedSelectSkills,
        },
        renderEditDialog: {
            editOpen,
            setEditOpen,
            selectedMastery,
            setSelectedMastery,
            handleUpdateSkill,
        }
    };
};
