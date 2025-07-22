import { useQuery } from "@apollo/client"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { Avatar, Box, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { GET_USER } from "@/api/queries/getUser"
import { getId, removeTokens } from "@/components/constants"
import type { SideMenuProps } from "@/types/types"
import { ICONS } from "@/ui/constants"

export const SideMenu = ({ open, toggleMenu }: SideMenuProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const theme = useTheme()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const { data, loading } = useQuery(GET_USER, {
        variables: { userId: getId() },
    })

    const menuItems = [
        { label: 'Employees', Icon: ICONS.Employees, link: '/users', active: location.pathname.includes('/users') },
        { label: 'Skills', Icon: ICONS.Skills, link: '/skills', active: location.pathname.includes('/skills') },
        { label: 'Languages', Icon: ICONS.Language, link: '/languages', active: location.pathname.includes('/langs') },
        { label: 'CVs', Icon: ICONS.CVs, link: '/cvs', active: location.pathname.includes('/cvs') },
    ]

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        removeTokens();
        navigate('/auth/login')
    }

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: open ? 240 : 56,
                    height: '100vh',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    transition: 'width 0.3s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 1000,
                    p: open ? 2 : 1,
                    overflowX: 'hidden',
                }}
            >
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {menuItems.map(({ label, Icon, link, active }) => (
                        <Box
                            onClick={() => navigate(link)}
                            key={label}
                            component="li"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: open ? 1 : 0,
                                p: 1,
                                borderRadius: 7,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                '&:hover': { bgcolor: 'action.hover' },
                                justifyContent: open ? 'flex-start' : 'center',
                            }}
                        >
                            <Icon
                                style={{
                                    width: 24,
                                    height: 24,
                                    transition: 'color 0.3s',
                                    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
                                }}
                            />
                            {open && <Typography>{label}</Typography>}
                        </Box>
                    ))}
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    {!loading && data?.user ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: open ? 'flex-start' : 'center',
                                gap: 1,
                                cursor: 'pointer',
                                mb: 1,
                                p: '5px 7px',
                                borderRadius: 10,
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                            onClick={handleMenuOpen}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#C63031' }}>
                                {data.user.profile.first_name[0]}
                            </Avatar>
                            {open && (
                                <Typography variant="body2" noWrap>
                                    {data.user.profile.first_name} {data.user.profile.last_name}
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        open && <Typography>Loading...</Typography>
                    )}

                    <IconButton size="small" onClick={toggleMenu}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={() => { handleMenuClose(); navigate(`/users/${data.user.id}`) }}>
                    Profile
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); handleLogout() }}>
                    Log out
                </MenuItem>
            </Menu>
        </>
    )
}
