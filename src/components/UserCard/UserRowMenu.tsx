import { useMutation } from '@apollo/client'
import { MoreVert } from '@mui/icons-material'
import {
    IconButton, Menu, MenuItem
} from '@mui/material'
import { type FC, type MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DELETE_USER } from '@/api/mutations/deleteUser'
import { useAuth } from '@/hooks/useAuth'
import type { UserCardProps } from '@/types/types'
import { useAlert } from '@/ui/Alert/useAlert'

export const UserRowMenu: FC<{ user: UserCardProps['user'] }> = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { showAlert } = useAlert()
    const { id: authId } = useAuth()
    const navigate = useNavigate()
    const [deleteUserMutation] = useMutation(DELETE_USER)

    const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handleProfileClick = () => {
        navigate(`/users/${user.id}`)
        handleClose()
    }

    const handleDelete = async () => {
        try {
            await deleteUserMutation({ variables: { id: authId } })
            showAlert({ type: 'success', message: 'User deleted successfully' })
            handleClose()
        } catch {
            showAlert({ type: 'error', message: 'Failed to delete user' })
        }
    }

    return (
        <>
            <IconButton onClick={handleOpen}>
                <MoreVert />
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleDelete} disabled={user.role !== 'admin'}>Delete user</MenuItem>
            </Menu>
        </>
    )
}