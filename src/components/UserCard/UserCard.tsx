import { useMutation } from '@apollo/client'
import { ChevronRight, MoreVert } from '@mui/icons-material'
import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from '@mui/material'
import type { FC, MouseEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DELETE_USER } from '@/api/mutations/deleteUser'
import { useAuth } from '@/hooks/useAuth'
import type { UserCardProps } from '@/types/types'
import { useAlert } from '@/ui/Alert/useAlert'

export const UserCard: FC<UserCardProps> = ({
    user,
    isCurrentUser,
}) => {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { showAlert } = useAlert();
    const { id } = useAuth()

    const [deleteUserMutation] = useMutation(DELETE_USER);

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleProfileClick = () => {
        navigate(`/users/${user.id}`)
        handleMenuClose()
    }

    const handleDeleteClick = async () => {
        try {
            await deleteUserMutation({
                variables: { id }
            });
            showAlert({ type: 'success', message: 'User deleted successfully' })
            handleMenuClose()
        } catch {
            showAlert({ type: 'error', message: 'Failed to delete user' })
        }
    }

    const handleNavigate = () => {
        if (!isCurrentUser) {
            navigate(`/users/${user.id}`)
        }
    }

    return (
        <Paper
            elevation={3}
            sx={{
                background: 'transparent',
                borderBottom: '1px solid #515151',
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                width: '100%',
                boxSizing: 'border-box',
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
                userSelect: 'none',
            }}
        >
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                {user.profile.avatar ? (
                    <Avatar src={user.profile.avatar} sx={{ width: 40, height: 40 }} />
                ) : (
                    <Avatar sx={{ bgcolor: 'grey.500', width: 40, height: 40 }}>
                        {user.profile.first_name?.charAt(0).toUpperCase()}
                    </Avatar>
                )}
            </Box>

            <Typography sx={{ flex: 1 }} noWrap>
                {user.profile.first_name}
            </Typography>
            <Typography sx={{ flex: 1 }} noWrap>
                {user.profile.last_name}
            </Typography>
            <Typography sx={{ flex: 2 }} noWrap>
                {user.email}
            </Typography>
            <Typography sx={{ flex: 2 }} noWrap>
                {user.department_name}
            </Typography>
            <Typography sx={{ flex: 2 }} noWrap>
                {user.position_name}
            </Typography>

            <Box sx={{ width: 48, display: 'flex', justifyContent: 'center' }}>
                {isCurrentUser ? (
                    <>
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVert />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
                            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                            <MenuItem onClick={handleDeleteClick} disabled={user.role !== 'admin'}>Delete user</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <IconButton onClick={handleNavigate}>
                        <ChevronRight />
                    </IconButton>
                )}
            </Box>
        </Paper>
    )
}
