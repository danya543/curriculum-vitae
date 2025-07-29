import { Box, ListItem, ListItemButton, Typography } from '@mui/material';

import type { LanguageCardProps } from '@/types/types';

import { levelColors } from '../constants';

export const LanguageCard = ({ lang, context }: LanguageCardProps) => {
    const {
        isAble,
        deleting,
        selectedForDelete,
        handleSelectForDelete,
        handleOpenEditDialog
    } = context;

    return (<ListItem
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
            onClick={() => {
                if (isAble) {
                    if (deleting) {
                        handleSelectForDelete(lang.name);
                    } else {
                        handleOpenEditDialog(lang);
                    }
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    sx={{
                        color: levelColors[lang.proficiency] || "#ccc",
                        fontWeight: 600,
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 1,
                        minWidth: 40,
                        textAlign: "center",
                    }}
                >
                    {lang.proficiency}
                </Box>
                <Typography>{lang.name}</Typography>
            </Box>
        </ListItemButton>
    </ListItem>)
}