import { useQuery } from '@apollo/client'
import { Box, Button, List, ListItem, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GET_USERS } from '@/api/queries/getUsers'
import type { GetUsersData } from '@/api/types'
import { redInputSx } from '@/components/constants'
import { CreateUserModal } from '@/components/CreateUserModal/CreateUserModal'
import { SortHeader } from '@/components/SortHeader/SortHeader'
import { UserCard } from '@/components/UserCard/UserCard'
import { useAuth } from '@/hooks/useAuth'
import { Loader } from '@/ui/Loader/Loader'

const columns = Array.from([
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
] as const);

type SortKey = (typeof columns)[number]["key"];
type SortOrder = 'asc' | 'desc'

export const UsersPage = () => {
    const { data, loading, error, refetch } = useQuery<GetUsersData>(GET_USERS)
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('firstName')
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const { id: currentUserId, role: userRole } = useAuth()

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    useEffect(() => {
        if (!currentUserId) { navigate('/auth/login') }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

                return sortOrder === 'asc'
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
    }, [data, search, sortKey, sortOrder, currentUserId])

    if (loading) {
        return (<Loader />);
    }
    if (error) return <Typography color="error">Error: {error.message}</Typography>

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <TextField
                    label="Find by username or email"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        borderRadius: '15px',
                        width: '400px',
                        ...redInputSx
                    }}
                />
                {userRole === 'Admin' && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ backgroundColor: 'rgb(198, 48, 49)' }}>
                            Create User
                        </Button>
                    </Box>
                )}
            </Box>

            {filteredUsers.length === 0 ? (
                <Typography>User not found.</Typography>
            ) : (
                <Box component={'section'} sx={{ '>div:nth-child(1)': { m: '0 10%', width: '80%' } }}>
                    <SortHeader columns={columns} sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />

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
                </Box>
            )}
            <CreateUserModal open={openModal} onClose={() => setOpenModal(false)} onCreated={refetch} />
        </Box>
    )
}
