import {
    Button,
    Dialog, DialogActions,
    DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select
} from "@mui/material";
import { useEffect, useState } from "react";

import { Mastery } from "@/components/CVTabs/constants";
import type { MasteryLevel } from "@/types/types";

import { MenuPropsSx, redInputSx } from "../constants";

interface Props {
    editOpen: boolean;
    setEditOpen: (value: boolean) => void;
    selectedMastery: MasteryLevel | "";
    setSelectedMastery: (m: MasteryLevel) => void;
    handleUpdateSkill: () => void;
}

export const EditSkillDialog: React.FC<Props> = ({
    editOpen,
    setEditOpen,
    selectedMastery,
    setSelectedMastery,
    handleUpdateSkill,
}) => {
    const [initialMastery, setInitialMastery] = useState<MasteryLevel | "">("");

    useEffect(() => {
        if (editOpen) {
            setInitialMastery(selectedMastery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editOpen]);
    return (
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogContent>
                <FormControl fullWidth required sx={{ mt: 2, ...redInputSx }}>
                    <InputLabel>Mastery</InputLabel>
                    <Select
                        label="Mastery"
                        value={selectedMastery}
                        onChange={(e) => setSelectedMastery(e.target.value as MasteryLevel)}
                        MenuProps={MenuPropsSx}
                    >
                        {Mastery.map(level => (
                            <MenuItem key={level} value={level}>{level}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button sx={{ color: '#c63031' }} onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button sx={{ background: '#c63031' }} variant="contained" onClick={handleUpdateSkill} disabled={!selectedMastery || selectedMastery === initialMastery}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}
