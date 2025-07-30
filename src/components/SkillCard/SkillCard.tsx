import { Box, LinearProgress, ListItem, ListItemText } from "@mui/material";

import { masteryToColor, masteryToProgress } from "@/components/CVTabs/constants";
import type { Skill } from "@/types/types";

interface Props {
    skill: Skill;
    deleteMode: boolean;
    isSelected: boolean;
    onClick: () => void;
}

export const SkillCard: React.FC<Props> = ({ skill, deleteMode, isSelected, onClick }) => {
    return <ListItem
        onClick={onClick}
        sx={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'auto',
            borderRadius: 4,
            bgcolor: deleteMode && isSelected ? 'rgba(255, 0, 0, 0.3)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            px: 2,
            py: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
                backgroundColor: deleteMode
                    ? 'rgba(255, 0, 0, 0.15)'
                    : 'action.hover',
            },
        }}
    >
        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={masteryToProgress[skill.mastery]}
                sx={{
                    width: '80px',
                    height: 4,
                    backgroundColor: masteryToColor[skill.mastery].bg,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: masteryToColor[skill.mastery].progress,
                    },
                }}
            />
        </Box>

        <ListItemText
            primary={skill.name}
            primaryTypographyProps={{
                textAlign: 'center',
                fontWeight: 500,
                fontSize: 14,
                pr: '20px',
                color: deleteMode && isSelected ? 'error.main' : 'text.primary',
            }}
        />
    </ListItem>
};
