const MessageError = ({ message }: { message: string }) => {
	return (
		<div className="p-4">
			<p className="text-destructive text-xs font-normal">{message}</p>
		</div>
	);
};

export { MessageError };
