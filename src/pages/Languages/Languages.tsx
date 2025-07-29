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
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { MenuPropsSx, redInputSx } from "@/components/constants";
import { useAuth } from "@/hooks/useAuth";
import { useProfileLang } from "@/hooks/useProfileLang";

export const Languages = () => {
    const { paramsId } = useParams();
    const { id: userId, role: userRole } = useAuth()
    const location = useLocation();
    const [id, setId] = useState<string | null>(null)

    useEffect(() => {
        if (location.pathname.includes('/users') && paramsId) {
            setId(paramsId);
        } else if (userId) {
            setId(userId);
        }
    }, [location.pathname, paramsId, userId]);

    const { langsLoading,
        profsLoading,
        langsData,
        profsData,
        profileLanguages,
        selectedForDelete,
        deleting,
        handleSelectForDelete,
        handleOpenAddDialog,
        handleOpenEditDialog,
        handleDelete,
        handleToggleDeleteMode,
        editingLanguageName,
        handleDialogClose,
        dialogOpen,
        setSelectedLangId,
        selectedLangId,
        selectedProficiency,
        setSelectedProficiency,
        handleSave
    } = useProfileLang({ id: id || '' });
    if (langsLoading || profsLoading) return <CircularProgress />;
    if (!langsData || !profsData) return <Typography color="error">Failed to load data</Typography>;



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

            {(!paramsId && userId) || paramsId === userId || userRole === 'Admin' ?
                <Box mt={2} display="flex" justifyContent='end' gap={2}>
                    <Button sx={{
                        color: 'rgb(198, 48, 49)'
                    }} onClick={handleOpenAddDialog}>Add Language</Button>

                    {profileLanguages.length > 0 && (
                        <Box display="flex" gap={2}>
                            <Button
                                color="error"
                                sx={{ gap: '5px' }}
                                onClick={deleting ? handleDelete : handleToggleDeleteMode}
                                disabled={deleting && selectedForDelete.length === 0}
                            >
                                <Trash2 width={20} height={20} />{deleting ? "Delete Selected" : "Delete Languages"}
                            </Button>
                            {deleting && (
                                <Button variant="text" sx={{ color: '#C63031' }} onClick={handleToggleDeleteMode}>
                                    Cancel
                                </Button>
                            )}
                        </Box>
                    )}
                </Box> : null}


            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>{editingLanguageName ? "Edit Language" : "Add Language"}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{
                        mt: 2,
                        ...redInputSx,
                    }
                    }>
                        <InputLabel id="select-language-label">Language</InputLabel>
                        <Select
                            labelId="select-language-label"
                            value={selectedLangId}
                            label="Language"
                            onChange={(e) => setSelectedLangId(e.target.value)}
                            disabled={!!editingLanguageName}
                            MenuProps={MenuPropsSx}
                        >
                            {langsData.languages.map((lang) => (
                                <MenuItem key={lang.id} value={lang.id}>
                                    {lang.name} ({lang.native_name})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{
                        mt: 2,
                        ...redInputSx,
                    }}>
                        <InputLabel id="select-proficiency-label">Proficiency</InputLabel>
                        <Select
                            labelId="select-proficiency-label"
                            value={selectedProficiency}
                            label="Proficiency"
                            onChange={(e) => setSelectedProficiency(e.target.value)}
                            MenuProps={MenuPropsSx}
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
                    <Button sx={{ color: 'rgba(198, 48, 49,0.8)', '&:hover': { background: 'rgba(198, 48, 49,0.2)' }, }} onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        variant="text"
                        sx={{ color: 'rgb(198, 48, 49)', '&:hover': { background: 'rgba(198, 48, 49,0.3)' } }}
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
