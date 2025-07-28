import { useQuery } from '@apollo/client'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Button, List, ListItem, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

import { GET_USERS } from '@/api/queries/getUsers'
import type { GetUsersData } from '@/api/types'
import { redInputSx } from '@/components/constants'
import { CreateUserModal } from '@/components/CreateUserModal/CreateUserModal'
import { UserCard } from '@/components/UserCard/UserCard'
import { useAuth } from '@/hooks/useAuth'

type SortKey = 'firstName' | 'lastName' | 'email' | 'department' | 'position'

export const UsersPage = () => {
    const { data, loading, error, refetch } = useQuery<GetUsersData>(GET_USERS)
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<SortKey | null>(null)
    const [sortAsc, setSortAsc] = useState(true)
    const [openModal, setOpenModal] = useState(false);

    const { id: currentUserId } = useAuth()

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortAsc(prev => !prev)
        } else {
            setSortKey(key)
            setSortAsc(true)
        }
    }

    const filteredUsers = useMemo(() => {
        if (!data?.users) return []

        const currentUser = data.users.find(u => u.id === currentUserId)
        const otherUsers = data.users.filter(u => u.id !== currentUserId)

        const lowerSearch = search.toLowerCase()
        const filtered = otherUsers.filter(user => {
            const fullName = `${user.profile.first_name} ${user.profile.last_name}`.toLowerCase()
            return (
                fullName.includes(lowerSearch) ||
                user.email.toLowerCase().includes(lowerSearch)
            )
        })

        if (sortKey) {
            const getFieldValue = (user: GetUsersData['users'][0]): string | null => {
                switch (sortKey) {
                    case 'firstName': return user.profile.first_name || null
                    case 'lastName': return user.profile.last_name || null
                    case 'email': return user.email || null
                    case 'department': return user.department_name || null
                    case 'position': return user.position_name || null
                    default: return null
                }
            }

            filtered.sort((a, b) => {
                const aVal = getFieldValue(a)
                const bVal = getFieldValue(b)

                if (!aVal && !bVal) return 0
                if (!aVal) return 1
                if (!bVal) return -1

                return sortAsc
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal)
            })
        }

        const result = currentUser &&
            (`${currentUser.profile.first_name} ${currentUser.profile.last_name}`.toLowerCase().includes(lowerSearch) ||
                currentUser.email.toLowerCase().includes(lowerSearch))
            ? [currentUser, ...filtered]
            : filtered

        return result
    }, [data, search, sortKey, sortAsc, currentUserId])

    if (loading) return <Typography>Loading...</Typography>
    if (error) return <Typography color="error">Error: {error.message}</Typography>

    const renderSortArrow = (key: SortKey) => {
        if (sortKey !== key) return null
        return sortAsc ? <ArrowDropUp fontSize="small" /> : <ArrowDropDown fontSize="small" />
    }

    return (
        <Box sx={{ width: '100%' }}>
            {filteredUsers[0].role === 'Admin' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ backgroundColor: 'rgb(198, 48, 49)' }}>
                        Create User
                    </Button>
                </Box>
            )}
            <TextField
                label="Find by username or email"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    mb: 3,
                    borderRadius: '15px',
                    width: '400px',
                    ...redInputSx
                }}
            />

            {filteredUsers.length === 0 ? (
                <Typography>User not found.</Typography>
            ) : (
                <section>
                    <Box sx={{
                        borderBottom: '1px solid #515151',
                        width: '100%', display: 'flex', justifyContent: 'space-between', px: 2, pb: 1, fontSize: '14px', fontWeight: 'bold'
                    }}>
                        <Box sx={{ width: '8%' }}></Box>
                        <Box onClick={() => handleSort('firstName')} sx={{ cursor: 'pointer', width: '10%' }}>
                            First Name {renderSortArrow('firstName')}
                        </Box>
                        <Box onClick={() => handleSort('lastName')} sx={{ cursor: 'pointer', width: '10%' }}>
                            Last Name {renderSortArrow('lastName')}
                        </Box>
                        <Box onClick={() => handleSort('email')} sx={{ cursor: 'pointer', width: '20%' }}>
                            Email {renderSortArrow('email')}
                        </Box>
                        <Box onClick={() => handleSort('department')} sx={{ cursor: 'pointer', width: '20%' }}>
                            Department {renderSortArrow('department')}
                        </Box>
                        <Box onClick={() => handleSort('position')} sx={{ cursor: 'pointer', width: '14%' }}>
                            Position {renderSortArrow('position')}
                        </Box>
                        <Box sx={{ width: '10%' }}></Box>
                    </Box>

                    <List sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
                        {filteredUsers.map(user => (
                            <ListItem key={user.id} disablePadding>
                                <UserCard
                                    user={user}
                                    isCurrentUser={user.id === currentUserId}
                                />
                            </ListItem>
                        ))}
                    </List>
                </section>
            )}
            <CreateUserModal open={openModal} onClose={() => setOpenModal(false)} onCreated={refetch} />
        </Box>
    )
}
