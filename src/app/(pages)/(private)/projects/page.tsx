// Remova todas as importações e lógicas do React Query aqui
import {
	AddProjectModal,
	ProjectFilters,
	ProjectTable,
} from "@/components/pages/project";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
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
							<ProjectTable />
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
