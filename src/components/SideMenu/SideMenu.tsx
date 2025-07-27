import { useQuery } from "@apollo/client"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { alpha, Avatar, Box, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material"
import { type MouseEvent, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { GET_USER } from "@/api/queries/getUser"
import { removeTokens } from "@/components/constants"
import { useAuth } from "@/hooks/useAuth"
import type { SideMenuProps } from "@/types/types"
import { ICONS } from "@/ui/constants"

export const SideMenu = ({ open, toggleMenu }: SideMenuProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const theme = useTheme()
    const { id } = useAuth()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const { data, loading } = useQuery(GET_USER, {
        variables: { userId: id },
        skip: !id,
    })

    const menuItems = [
        { label: 'Employees', Icon: ICONS.Employees, link: '/users' },
        { label: 'Skills', Icon: ICONS.Skills, link: '/skills' },
        { label: 'Languages', Icon: ICONS.Language, link: '/languages' },
        { label: 'CVs', Icon: ICONS.CVs, link: '/cvs' },
    ]

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => setAnchorEl(null)

    const handleLogout = () => {
        removeTokens()
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
                    {menuItems.map(({ label, Icon, link }) => {
                        const active = location.pathname.startsWith(link)
                        return (
                            <Box
                                key={label}
                                onClick={() => navigate(link)}
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
                                        color: active
                                            ? alpha(theme.palette.text.secondary, 1)
                                            : alpha(theme.palette.text.secondary, 0.6),
                                    }}
                                />
                                {open && <Typography sx={{
                                    color: active
                                        ? alpha(theme.palette.text.secondary, 1)
                                        : alpha(theme.palette.text.secondary, 0.6),
                                }} >{label}</Typography>}
                            </Box>
                        )
                    })}
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
                            <Avatar
                                src={data.user.profile.avatar || undefined}
                                sx={{ width: 32, height: 32, bgcolor: data.user.profile.avatar ? 'transparent' : '#C63031' }}
                            >
                                {!data.user.profile.avatar &&
                                    (data.user.profile.first_name?.[0] || data.user.email[0])}
                            </Avatar>
                            {open && (
                                <Typography variant="body2" noWrap>
                                    {data.user.profile.first_name ? `${data.user.profile.first_name} ${data.user.profile.last_name}` : data.user.email}
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
                {data?.user && (
                    <MenuItem
                        onClick={() => {
                            handleMenuClose()
                            navigate(`/users/${data.user.id}`)
                        }}
                    >
                        Profile
                    </MenuItem>
                )}
                <MenuItem onClick={() => { handleMenuClose(); handleLogout() }}>
                    Log out
                </MenuItem>
            </Menu>
        </>
    )
}
