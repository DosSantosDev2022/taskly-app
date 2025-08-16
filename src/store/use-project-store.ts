import { ProjectStatus, ProjectType } from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 1. Defina a interface do estado
interface ProjectState {
	type?: ProjectType;
	status?: ProjectStatus;
	page: number;
	pageSize: number;
}

// 2. Defina a interface das ações
interface ProjectActions {
	// Use Partial para permitir a atualização parcial do estado
	setSearchParams: (params: Partial<ProjectState>) => void;
}

export const useProjectStore = create<ProjectState & ProjectActions>()(
	devtools(
		(set, get) => ({
			type: undefined,
			status: undefined,
			page: 1,
			pageSize: 10,
			setSearchParams: (params) => {
				set((state) => ({ ...state, ...params }));
			},
		}),
		{ name: "project-store" },
	),
);
