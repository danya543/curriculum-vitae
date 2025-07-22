import { Box, Checkbox, LinearProgress, ListItem, ListItemText } from "@mui/material";

import { masteryToColor, masteryToProgress } from "@/components/CVTabs/constants";
import type { Skill } from "@/types/types";

interface Props {
    skill: Skill;
    deleteMode: boolean;
    isSelected: boolean;
    onClick: () => void;
    onCheck: () => void;
}

export const SkillCard: React.FC<Props> = ({ skill, deleteMode, isSelected, onClick, onCheck }) => (
    <ListItem
        onClick={onClick}
        sx={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'fit-content',
            borderRadius: 4,
            bgcolor: isSelected ? 'error.light' : 'transparent',
            cursor: 'pointer',
        }}
    >
        {deleteMode && <Checkbox checked={isSelected} onClick={(e) => { e.stopPropagation(); onCheck(); }} />}

        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={masteryToProgress[skill.mastery]}
                sx={{
                    width: '80px',
                    height: 6,
                    backgroundColor: '#eee',
                    '& .MuiLinearProgress-bar': { backgroundColor: masteryToColor[skill.mastery] },
                }}
            />
        </Box>
        <ListItemText primary={skill.name} primaryTypographyProps={{ textAlign: 'center', fontWeight: 500, fontSize: 14 }} />
    </ListItem>
);
