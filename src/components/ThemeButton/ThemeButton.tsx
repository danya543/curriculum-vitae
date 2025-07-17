import { Brightness4, Brightness7 } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useContext } from 'react'

import { ThemeModeContext } from '@/theme/ThemeContext'

export const ToggleThemeButton = () => {
    const theme = useTheme()
    const { toggleMode } = useContext(ThemeModeContext)

    return (
        <IconButton
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 2000,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 3,
            }}
            onClick={toggleMode}
            color="inherit"
        >
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    )
}
