import { getProjects } from "@/actions/project";
import {
	AddProjectModal,
	ProjectFilters,
	ProjectTable,
} from "@/components/pages/project";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
	// Cria uma instância do QueryClient
	const queryClient = new QueryClient();
	// Pré-busca os projetos do usuário
	await queryClient.prefetchQuery({
		queryKey: ["projects", { page: 1, pageSize: 10 }],
		queryFn: () => getProjects({}),
		staleTime: 1000 * 60 * 30, // 30 minutos
	});

	// Desidrata o cache para ser passado para o cliente
	const dehydratedState = dehydrate(queryClient);

	return (
		<div
			className="flex flex-col p-8 min-h-[calc(100vh-theme(spacing.16))]"
			role="main"
		>
			<div className="flex-1">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
					<section
						className="md:col-span-12"
						aria-labelledby="projects-heading"
					>
						<div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-4">
							<h1
								id="projects-heading"
								className="text-2xl font-bold tracking-tight"
							>
								Meus Projetos
							</h1>
							<div className="flex items-center gap-2">
								<ProjectFilters />
								<AddProjectModal />
							</div>
						</div>
						<div className="grid grid-cols-1 gap-6">
							{/* Envolve o componente ProjectTable com HydrationBoundary */}
							{/* Isso garante que o estado desidratado seja usado corretamente */}
							<HydrationBoundary state={dehydratedState}>
								<ProjectTable />
							</HydrationBoundary>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
