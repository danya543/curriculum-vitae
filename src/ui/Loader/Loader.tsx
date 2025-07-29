import { Box, CircularProgress } from '@mui/material'

export const Loader = () => (<Box
    sx={{
        height: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}
>
    <CircularProgress size={48} thickness={4} color="error" />
</Box>)
