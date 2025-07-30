import { GlobalStyles, useTheme } from '@mui/material'

export const ScrollbarStyles = () => {
    const theme = useTheme()

    return (
        <GlobalStyles
            styles={{
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${theme.palette.mode === 'dark' ? '#fff' : '#000'} transparent`,
                },
                '*::-webkit-scrollbar': {
                    width: '1px',
                    height: '1px',
                },
                '*::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    borderRadius: 3,
                    border: 'none',
                },
            }}
        />
    )
}
