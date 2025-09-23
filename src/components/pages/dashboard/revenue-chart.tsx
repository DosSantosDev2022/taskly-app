"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils";
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

// Defina a interface para o tipo de dado que o componente espera
interface RevenueChartProps {
	data: {
		name: string;
		total: number;
	}[];
}

const CustomLabel = (props: any) => {
	const { x, y, width, value } = props;
	return (
		<text
			x={x + width / 2}
			y={y}
			dy={-10} // Desloca o texto para cima, longe da barra
			fill="var(--foreground)"
			fontSize={12}
			fontWeight="bold"
			textAnchor="middle" // Alinha o texto no centro
		>
			{formatPrice(value)}
		</text>
	);
};

const RevenueChart = ({ data }: RevenueChartProps) => {
	return (
		<Card className="bg-card/20">
			<CardHeader>
				<CardTitle>Faturamento Mensal</CardTitle>
			</CardHeader>
			<CardContent className="h-[200px] p-4">
				{/* ResponsiveContainer garante que o gráfico se ajuste ao tamanho do card */}
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						margin={{
							top: 20,
							right: 20,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid
							vertical={false}
							className="stroke-muted-foreground/30"
						/>
						<XAxis
							dataKey="name"
							stroke="var(--foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="var(--foreground)"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => formatPrice(value)}
						/>
						<Bar dataKey="total" fill="var(--chart-1)" radius={[4, 4, 0, 0]}>
							<LabelList position="top" content={CustomLabel} />
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export { RevenueChart };
