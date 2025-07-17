import { createContext } from 'react'

export interface ThemeContextType {
    toggleMode: () => void
}

export const ThemeModeContext = createContext<ThemeContextType>({
    toggleMode: () => { },
})
