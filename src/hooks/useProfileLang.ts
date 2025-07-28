import { useMutation, useQuery } from "@apollo/client";
import type { Profile } from "cv-graphql";
import { useEffect, useState } from "react";

import { ADD_PROFILE_LANGUAGE } from "@/api/mutations/addProfileLang";
import { DELETE_PROFILE_LANGUAGE } from "@/api/mutations/deleteProfileLang";
import { UPDATE_PROFILE_LANGUAGE } from "@/api/mutations/updProfileLang";
import { GET_PROFICIENCY_LEVELS } from "@/api/queries/getLangProfieciency";
import { GET_LANGUAGES } from "@/api/queries/getLanguages";
import { GET_PROFILE_INFO } from "@/api/queries/getProfileLangs";
import { useAlert } from "@/ui/Alert/useAlert";

type Language = {
    id: string;
    name: string;
    iso2: string;
    native_name: string;
};

type LanguageProficiency = {
    name: string;
};

type ProfileLanguage = {
    name: string;
    proficiency: string;
};

export type ProfileData = {
    profile: Profile;
};

export type ProfileVars = {
    userId: string | null;
};

export const useProfileLang = ({ id }: { id: string }) => {
    const { showAlert } = useAlert();

    const { data: langsData, loading: langsLoading } = useQuery<{ languages: Language[] }>(GET_LANGUAGES);
    const { data: profsData, loading: profsLoading } = useQuery<{ __type: { enumValues: LanguageProficiency[] } }>(
        GET_PROFICIENCY_LEVELS
    );
    const { data: userData, loading } = useQuery<ProfileData, ProfileVars>(
        GET_PROFILE_INFO,
        { variables: { userId: id } }
    );
    const [addProfileLanguage] = useMutation(ADD_PROFILE_LANGUAGE);
    const [updateProfileLanguage] = useMutation(UPDATE_PROFILE_LANGUAGE);
    const [deleteProfileLanguage] = useMutation(DELETE_PROFILE_LANGUAGE);

    const [profileLanguages, setProfileLanguages] = useState<ProfileLanguage[]>([]);
    const [selectedLangId, setSelectedLangId] = useState("");
    const [selectedProficiency, setSelectedProficiency] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingLanguageName, setEditingLanguageName] = useState<string | null>(null);

    const [deleting, setDeleting] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);


    useEffect(() => {
        if (!loading && userData) {
            setProfileLanguages(userData.profile.languages);
        }
    }, [loading, userData]);

    const handleOpenAddDialog = () => {
        setSelectedLangId("");
        setSelectedProficiency("");
        setEditingLanguageName(null);
        setDialogOpen(true);
    };

    const handleOpenEditDialog = (lang: ProfileLanguage) => {
        const foundLang = langsData?.languages.find(l => l.name === lang.name);
        setEditingLanguageName(lang.name);
        setSelectedLangId(foundLang?.id ?? "");
        setSelectedProficiency(lang.proficiency);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedLangId("");
        setSelectedProficiency("");
        setEditingLanguageName(null);
    };

    const handleSave = async () => {
        if (!selectedLangId || !selectedProficiency) return;
        const selectedLanguage = langsData?.languages.find(l => l.id === selectedLangId);
        if (!selectedLanguage) return;
        const alreadyExist = userData?.profile.languages.some(l => l.name === selectedLanguage.name)
        if (!editingLanguageName && alreadyExist) {
            showAlert({ type: 'error', message: 'Language already added!' })
            return;
        }

        try {
            if (editingLanguageName) {
                const { data } = await updateProfileLanguage({
                    variables: {
                        language: {
                            userId: id,
                            name: editingLanguageName,
                            proficiency: selectedProficiency,
                        },
                    },
                });
                showAlert({ type: 'success', message: 'Update language successfully' })
                setProfileLanguages(data?.updateProfileLanguage.languages || []);
            } else {
                const { data } = await addProfileLanguage({
                    variables: {
                        language: {
                            userId: id,
                            name: selectedLanguage.name,
                            proficiency: selectedProficiency,
                        },
                    },
                });
                showAlert({ type: 'success', message: 'Add language successfully' })
                setProfileLanguages(data?.addProfileLanguage.languages || []);
            }
            handleDialogClose();
        } catch {
            showAlert({ type: 'error', message: 'Error saving language' })
        }
    };

    const handleToggleDeleteMode = () => {
        setDeleting(prev => !prev);
        setSelectedForDelete([]);
    };

    const handleSelectForDelete = (langName: string) => {
        setSelectedForDelete(prev =>
            prev.includes(langName)
                ? prev.filter(name => name !== langName)
                : [...prev, langName]
        );
    };


    const handleDelete = async () => {
        try {
            const { data } = await deleteProfileLanguage({
                variables: {
                    language: {
                        userId: id,
                        name: selectedForDelete,
                    }
                },
            });
            showAlert({ type: 'success', message: 'Language(s) successfully deleted' })
            setProfileLanguages(data?.deleteProfileLanguage.languages || []);
            setSelectedForDelete([]);
            setDeleting(false);
        } catch {
            showAlert({ type: 'error', message: 'Error deleting language(s)' })
        }
    };

    return {
        langsData,
        selectedForDelete,
        deleting,
        editingLanguageName,
        handleDialogClose,
        dialogOpen,
        setSelectedLangId,
        selectedLangId,
        selectedProficiency,
        setSelectedProficiency,
        profileLanguages,
        profsLoading,
        profsData,
        langsLoading,
        handleOpenAddDialog,
        handleOpenEditDialog,
        handleSave,
        handleToggleDeleteMode,
        handleSelectForDelete,
        handleDelete
    }
}
