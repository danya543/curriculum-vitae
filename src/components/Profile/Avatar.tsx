import { Avatar, Box, Button, Typography, useTheme } from '@mui/material';
import { X } from 'lucide-react';

import { ICONS } from '@/ui/constants';

type Props = {
    canEdit: boolean;
    avatar: string;
    onDelete: () => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AvatarBlock: React.FC<Props> = ({ canEdit, avatar, onDelete, onUpload }) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                <Avatar src={avatar} sx={{ width: 80, height: 80 }} />
                {avatar !== '/avatar.png' && canEdit && (
                    <Button
                        onClick={onDelete}
                        sx={{
                            color: '#757575',
                            minWidth: 'unset',
                            p: '4px',
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            zIndex: 1,
                        }}
                    >
                        <X size={24} />
                    </Button>
                )}
            </Box>

            {canEdit && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Button
                        variant="text"
                        component="label"
                        sx={{
                            color: theme.palette.mode === 'dark' ? 'white' : 'black',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <ICONS.Upload
                            style={{
                                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                            }}
                        />
                        Upload avatar image
                        <input type="file" hidden accept="image/*" onChange={onUpload} />
                    </Button>
                    <Typography variant="subtitle1">
                        png, jpg or gif no more than 0.5MB
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
