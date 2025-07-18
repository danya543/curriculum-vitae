import { useQuery } from "@apollo/client"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { Box, IconButton, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

import { GET_USER } from "@/api/queries/getUser"
import { ICONS } from "@/ui/constants"

import { getId } from "../constants"

interface SideMenuProps {
    open: boolean
    toggleMenu: () => void
}

export const SideMenu = ({ open, toggleMenu }: SideMenuProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const { data, loading } = useQuery(GET_USER, {
        variables: { userId: getId() }
    });

    const menuItems = [
        { label: 'Employees', Icon: ICONS.Employees, link: '/users', active: location.pathname.includes('/users') },
        { label: 'Skills', Icon: ICONS.Skills, link: '/skills', active: location.pathname.includes('/skills') },
        { label: 'Languages', Icon: ICONS.Language, link: '/languages', active: location.pathname.includes('/langs') },
        { label: 'CVs', Icon: ICONS.CVs, link: '/cvs', active: location.pathname.includes('/cvs') },
    ]

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: open ? 0 : '-240px',
                    width: 240,
                    height: '100vh',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    transition: 'left 0.3s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 1000,
                    p: 2,
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
                                gap: 1,
                                p: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                        >
                            <Icon style={{ width: 24, height: 24, opacity: active ? 1 : 0.6 }} />
                            <Typography>{label}</Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    {!loading ? <Typography variant="body2" mb={1}>{data.user.profile.first_name} {data.user.profile.last_name}</Typography> : 'loading...'}
                    <IconButton size="small" onClick={toggleMenu}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
            </Box>

            {!open && (
                <Box
                    sx={{
                        position: 'fixed',
                        left: 0,
                        bottom: 20,
                        zIndex: 1100,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        py: 0.5,
                        px: 0.5,
                    }}
                >
                    <IconButton onClick={toggleMenu} size="small">
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            )}
        </>
    )
}
