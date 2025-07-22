import { useMutation, useQuery } from "@apollo/client";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { ADD_PROFILE_LANGUAGE } from "@/api/mutations/addProfileLang";
import { DELETE_PROFILE_LANGUAGE } from "@/api/mutations/deleteProfileLang";
import { UPDATE_PROFILE_LANGUAGE } from "@/api/mutations/updProfileLang";
import { GET_PROFICIENCY_LEVELS } from "@/api/queries/getLangProfieciency";
import { GET_LANGUAGES } from "@/api/queries/getLanguages";
import { GET_PROFILE_LANGUAGES } from "@/api/queries/getProfileLangs";
import { getId } from "@/components/constants";

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

type ProfileLanguagesData = {
    profile: {
        id: string;
        languages: ProfileLanguage[];
    };
};

type ProfileLanguagesVars = {
    userId: string | null;
};

export const Languages = () => {
    const id = getId();

    const { data: langsData, loading: langsLoading } = useQuery<{ languages: Language[] }>(GET_LANGUAGES);
    const { data: profsData, loading: profsLoading } = useQuery<{ __type: { enumValues: LanguageProficiency[] } }>(
        GET_PROFICIENCY_LEVELS
    );
    const { data: userLangs, loading } = useQuery<ProfileLanguagesData, ProfileLanguagesVars>(
        GET_PROFILE_LANGUAGES,
        { variables: { userId: id } }
    );

    const [profileLanguages, setProfileLanguages] = useState<ProfileLanguage[]>([]);
    const [selectedLangId, setSelectedLangId] = useState("");
    const [selectedProficiency, setSelectedProficiency] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingLanguageName, setEditingLanguageName] = useState<string | null>(null);

    const [deleting, setDeleting] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);

    const [addProfileLanguage] = useMutation(ADD_PROFILE_LANGUAGE);
    const [updateProfileLanguage] = useMutation(UPDATE_PROFILE_LANGUAGE);
    const [deleteProfileLanguage] = useMutation(DELETE_PROFILE_LANGUAGE);

    useEffect(() => {
        if (!loading && userLangs) {
            setProfileLanguages(userLangs.profile.languages);
        }
    }, [loading, userLangs]);

    if (langsLoading || profsLoading) return <CircularProgress />;
    if (!langsData || !profsData) return <Typography color="error">Failed to load data</Typography>;

    const handleOpenAddDialog = () => {
        setSelectedLangId("");
        setSelectedProficiency("");
        setEditingLanguageName(null);
        setDialogOpen(true);
    };

    const handleOpenEditDialog = (lang: ProfileLanguage) => {
        const foundLang = langsData.languages.find(l => l.name === lang.name);
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
        const selectedLanguage = langsData.languages.find(l => l.id === selectedLangId);
        if (!selectedLanguage) return;

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
                setProfileLanguages(data?.addProfileLanguage.languages || []);
            }
            handleDialogClose();
        } catch {
            alert("Error saving language");
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
            setProfileLanguages(data?.deleteProfileLanguage.languages || []);

            setSelectedForDelete([]);
            setDeleting(false);
        } catch {
            alert("Error deleting language(s)");
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Languages</Typography>

            <List>
                {profileLanguages.length === 0 && <Typography>No languages added</Typography>}
                {profileLanguages.map(lang => (
                    <ListItem
                        key={lang.name}
                        disablePadding
                        sx={{
                            backgroundColor: selectedForDelete.includes(lang.name)
                                ? 'rgba(255, 0, 0, 0.1)'
                                : 'inherit',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        <ListItemButton
                            onClick={() =>
                                deleting ? handleSelectForDelete(lang.name) : handleOpenEditDialog(lang)
                            }
                        >
                            <ListItemText
                                primary={lang.name}
                                secondary={`Proficiency: ${lang.proficiency}`}
                            />
                        </ListItemButton>
                    </ListItem>

                ))}
            </List>

            <Box mt={2} display="flex" justifyContent='space-between' gap={2}>
                <Button variant="contained" onClick={handleOpenAddDialog}>Add Language</Button>

                {profileLanguages.length > 0 && (
                    <Box display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={deleting ? handleDelete : handleToggleDeleteMode}
                            disabled={deleting && selectedForDelete.length === 0}
                        >
                            {deleting ? "Delete Selected" : "Delete Languages"}
                        </Button>
                        {deleting && (
                            <Button variant="text" onClick={handleToggleDeleteMode}>
                                Cancel
                            </Button>
                        )}
                    </Box>
                )}
            </Box>


            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>{editingLanguageName ? "Edit Language" : "Add Language"}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="select-language-label">Language</InputLabel>
                        <Select
                            labelId="select-language-label"
                            value={selectedLangId}
                            label="Language"
                            onChange={(e) => setSelectedLangId(e.target.value)}
                            disabled={!!editingLanguageName}
                        >
                            {langsData.languages.map((lang) => (
                                <MenuItem key={lang.id} value={lang.id}>
                                    {lang.name} ({lang.native_name})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="select-proficiency-label">Proficiency</InputLabel>
                        <Select
                            labelId="select-proficiency-label"
                            value={selectedProficiency}
                            label="Proficiency"
                            onChange={(e) => setSelectedProficiency(e.target.value)}
                        >
                            {profsData.__type.enumValues.map((p) => (
                                <MenuItem key={p.name} value={p.name}>
                                    {p.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!selectedLangId || !selectedProficiency}
                    >
                        {editingLanguageName ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
