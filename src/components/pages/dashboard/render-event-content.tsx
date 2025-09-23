const statusColors = {
	PENDING: "var(--danger)",
	IN_PROGRESS: "var(--warning)",
	COMPLETED: "var(--success)",
};

const renderEventContent = (eventInfo: any) => {
	const status = eventInfo.event.extendedProps
		.status as keyof typeof statusColors;
	const dotColor = statusColors[status];

	return (
		<div
			className="flex items-center gap-1 p-1.5 rounded-lg"
			style={{ backgroundColor: "var(--secondary)" }}
		>
			<span
				style={{ backgroundColor: dotColor }}
				className="w-2 h-2 rounded-full inline-block"
			></span>
			<span className="truncate" style={{ color: "var(--foreground)" }}>
				{eventInfo.event.title}
			</span>
		</div>
	);
};

export { renderEventContent };
