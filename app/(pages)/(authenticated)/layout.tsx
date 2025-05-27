'use client'
import AuthProvider from '@/providers/auth'
import { AppSidebar } from '@/components/global/SideBarApp'
import { Header } from '@/components/global/header/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // Dados serão considerados 'stale' (velhos) após 5 minutos.
			// Isso significa que, se você pedir os mesmos dados novamente após 5 min,
			// o React Query tentará buscar uma nova versão, mas ainda mostrará a versão em cache
			// enquanto a nova está sendo buscada.
			refetchOnWindowFocus: false, // Desabilita o refetch automático ao focar na janela.
			// Habilite se for um requisito para o seu caso.
		},
	},
})

export default function PagesLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<div className='flex h-screen w-full flex-row overflow-hidden'>
					<AppSidebar />
					<div className='flex flex-1 flex-col'>
						<Header />
						<main className='min-h-0 flex-grow overflow-hidden p-4'>
							{children}
						</main>
					</div>
				</div>
			</QueryClientProvider>
		</AuthProvider>
	)
}
