import { useQuery } from '@apollo/client'
import { Box, List, ListItem, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

import { GET_USERS } from '@/api/queries/getUsers'
import type { GetUsersData } from '@/api/types'
import { UserCard } from '@/components/UserCard/UserCard'

export const UsersPage = () => {
    const { data, loading, error } = useQuery<GetUsersData>(GET_USERS)
    const [search, setSearch] = useState('')

    const filteredUsers = useMemo(() => {
        if (!data?.users) return []
        return data.users.filter(user => {
            const fullName = `${user.profile.first_name} ${user.profile.last_name}`.toLowerCase()
            return (
                fullName.includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            )
        })
    }, [data, search])

    if (loading) return <Typography>Loading...</Typography>
    if (error) return <Typography color="error">Error: {error.message}</Typography>

    return (
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
            <TextField
                label="Find by username or email"
                variant="outlined"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />

            {filteredUsers.length === 0 ? (
                <Typography>User not found.</Typography>
            ) : (
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 0 }}>
                    {filteredUsers.map(user => (
                        <ListItem key={user.id} disablePadding>
                            <UserCard
                                id={user.id}
                                firstName={user.profile.first_name}
                                lastName={user.profile.last_name}
                                email={user.email}
                                departmentName={user.department_name}
                                positionName={user.position_name}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    )
}
