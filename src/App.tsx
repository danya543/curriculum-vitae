import { ApolloProvider } from '@apollo/client'
import { RouterProvider } from 'react-router-dom'

import { client } from '@/api/client'
import { ToggleThemeButton } from '@/components/ThemeButton/ThemeButton';
import { router } from '@/router/AppRouter'
import { AppThemeProvider } from '@/theme/ThemeProvider';
import { AlertProvider } from '@/ui/Alert/AlertContext';
import { ScrollbarStyles } from '@/ui/Scrollbar/Scrollbar';

export const App = () => {

  return (
    <ApolloProvider client={client}>
      <AppThemeProvider>
        <ScrollbarStyles />
        <AlertProvider>
          <RouterProvider router={router} />
          <ToggleThemeButton />
        </AlertProvider>
      </AppThemeProvider>
    </ApolloProvider>
  )
}
