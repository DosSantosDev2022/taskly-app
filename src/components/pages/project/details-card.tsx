import { Card, CardTitle } from "@/components/ui";

interface DetailCardProps {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

const DetailCard = ({ title, icon, children }: DetailCardProps) => (
	<Card className="rounded-lg shadow-sm p-4 w-full">
		<CardTitle className="flex gap-1 items-center font-semibold text-xl">
			{icon}
			{title}
		</CardTitle>
		<div className="mt-2">{children}</div>
	</Card>
);

export { DetailCard };
