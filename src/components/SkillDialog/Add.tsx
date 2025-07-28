import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    ListSubheader,
    MenuItem,
    Select,
} from "@mui/material";

import { Mastery } from "@/components/CVTabs/constants";
import type { MasteryLevel, Skill } from "@/types/types";

import { redInputSx } from "../constants";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    selectedSkillId: string;
    selectedMastery: MasteryLevel | "";
    setSelectedSkillId: (id: string) => void;
    setSelectedMastery: (m: MasteryLevel | '') => void;
    handleAddSkill: () => void;
    groupedSelectSkills: Record<string, Skill[]>;
}

export const AddSkillDialog: React.FC<Props> = ({
    open,
    setOpen,
    selectedSkillId,
    selectedMastery,
    setSelectedSkillId,
    setSelectedMastery,
    handleAddSkill,
    groupedSelectSkills,
}) => (
    <Dialog open={open} onClose={() => { setSelectedMastery(''); setSelectedSkillId(''); setOpen(false) }} fullWidth maxWidth="sm">
        <DialogTitle>Add Skill</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required sx={{ mt: 2, ...redInputSx, }}>
                <InputLabel>Skill</InputLabel>
                <Select
                    label="Skill"
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300,
                            },
                        },
                    }}
                >
                    {Object.entries(groupedSelectSkills).map(([category, skills]) => [
                        <ListSubheader key={category}>{category}</ListSubheader>,
                        ...skills.map((skill) => (
                            <MenuItem key={skill.id} value={skill.id}>
                                {skill.name}
                            </MenuItem>
                        )),
                    ])}
                </Select>
            </FormControl>

            <FormControl fullWidth required sx={redInputSx}>
                <InputLabel>Mastery</InputLabel>
                <Select
                    label="Mastery"
                    value={selectedMastery}
                    onChange={(e) => setSelectedMastery(e.target.value as MasteryLevel)}
                >
                    {Mastery.map((level) => (
                        <MenuItem key={level} value={level}>
                            {level}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button style={{ color: '#C63031' }} onClick={() => { setSelectedMastery(''); setSelectedSkillId(''); setOpen(false) }}>Cancel</Button>
            <Button
                variant="contained"
                onClick={() => { handleAddSkill(); setSelectedMastery(''); setSelectedSkillId(''); }}
                disabled={!selectedSkillId || !selectedMastery}
                sx={{ backgroundColor: "transparent", color: '#C63031', "&:hover": { backgroundColor: "#a82525" } }}
            >
                Add
            </Button>
        </DialogActions>
    </Dialog>
);
