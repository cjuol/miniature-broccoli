import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      // En móvil el foco de ventana no es relevante como en escritorio
      refetchOnWindowFocus: false,
    },
  },
})
