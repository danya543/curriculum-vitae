import {
    Box,
    Button,
    CircularProgress,
    List,
    Typography,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { LanguageCard } from "@/components/Language/LanguageCard";
import { LanguageDialog } from "@/components/Language/LanguageDialog";
import { useAuth } from "@/hooks/useAuth";
import { useProfileLang } from "@/hooks/useProfileLang";

export const Languages = () => {
    const { id: paramsId } = useParams();
    const { id: userId, role: userRole } = useAuth()
    const location = useLocation();
    const [id, setId] = useState<string>('')

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
        dialogProps
    } = useProfileLang({ id });
    if (langsLoading || profsLoading) return <CircularProgress />;
    if (!langsData || !profsData) return <Typography color="error">Failed to load data</Typography>;

    const isAble = ((!paramsId && userId) || paramsId === userId || userRole === 'Admin') as boolean;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Languages</Typography>

            <List sx={{ display: 'flex', gap: 2 }}>
                {profileLanguages.length === 0 && <Typography>No languages added</Typography>}

                {profileLanguages.map(lang => (
                    <LanguageCard
                        lang={lang}
                        context={{
                            selectedForDelete,
                            isAble,
                            deleting,
                            handleSelectForDelete,
                            handleOpenEditDialog,
                        }} />
                ))}
            </List>

            {isAble ?
                <Box mt={2} display="flex" justifyContent='end' gap={2}>
                    {!deleting &&
                        <Button sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            color: 'rgb(118, 118, 118)',
                        }} onClick={handleOpenAddDialog}>
                            <Plus width={20} height={20} />Add Language
                        </Button>}

                    {profileLanguages.length > 0 && (
                        <Box display="flex" gap={2}>
                            <Button
                                color="error"
                                sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
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


            <LanguageDialog
                {...dialogProps}
                langsData={langsData}
                profsData={profsData}
            />
        </Box>
    );
};
