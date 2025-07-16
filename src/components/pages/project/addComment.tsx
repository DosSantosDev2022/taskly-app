import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Textarea,
} from "@/components/ui";

const AddComment = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Adicionar</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[768px]">
				<DialogHeader>
					<DialogTitle>Nova comentário</DialogTitle>
				</DialogHeader>
				<div className="w-full space-y-1.5">
					<Textarea placeholder="Deixe seu comentário..." />
					<Button className="w-full" variant="outline">
						Adicionar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export { AddComment };
