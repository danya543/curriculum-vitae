import { Avatar, Box, Paper, Typography } from '@mui/material'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import type { UserCardProps } from '@/types/types'

export const UserCard: FC<UserCardProps> = ({
    id,
    firstName,
    lastName,
    email,
    departmentName,
    positionName,
    avatarUrl,
}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/users/${id}`)
    }

    return (
        <Paper
            elevation={3}
            onClick={handleClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                padding: 2,
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box',
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
                userSelect: 'none',
            }}
        >
            {avatarUrl ? (
                <Avatar
                    src={avatarUrl}
                    alt={`${firstName} ${lastName}`}
                    sx={{ width: 56, height: 56, flexShrink: 0 }}
                />
            ) : (
                <Avatar
                    sx={{
                        bgcolor: 'grey.500',
                        width: 56,
                        height: 56,
                        fontWeight: 'bold',
                        fontSize: 24,
                        flexShrink: 0,
                    }}
                >
                    {firstName?.charAt(0).toUpperCase()}
                </Avatar>
            )}

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {firstName} {lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {email}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {departmentName || 'Without department'} – {positionName || 'Without position'}
                </Typography>
            </Box>
        </Paper>
    )
}
