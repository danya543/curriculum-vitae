import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { MenuPropsSx, redInputSx } from '@/components/constants'
import type { LanguageDialogProps } from '@/types/types'

export const LanguageDialog = ({
    dialogOpen,
    handleDialogClose,
    editingLanguageName,
    selectedLangId,
    setSelectedLangId,
    langsData,
    selectedProficiency,
    setSelectedProficiency,
    profsData,
    handleSave }: LanguageDialogProps) => (
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
)
