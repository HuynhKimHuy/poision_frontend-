import { Skeleton } from "@/components/ui/skeleton";

const ChatWindowSkeleton = () => {
	return (
		<div className="flex h-full w-full flex-col rounded-lg border border-border bg-background">
			<div className="flex items-center justify-between border-b border-border p-4">
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded-md" />
					<Skeleton className="h-8 w-8 rounded-md" />
					<Skeleton className="h-8 w-8 rounded-md" />
				</div>
			</div>

			<div className="flex-1 space-y-4 overflow-hidden p-4">
				<div className="flex items-end gap-2">
					<Skeleton className="h-7 w-7 rounded-full" />
					<Skeleton className="h-11 w-52 rounded-2xl" />
				</div>
				<div className="flex justify-end">
					<Skeleton className="h-11 w-44 rounded-2xl" />
				</div>
				<div className="flex items-end gap-2">
					<Skeleton className="h-7 w-7 rounded-full" />
					<Skeleton className="h-11 w-64 rounded-2xl" />
				</div>
				<div className="flex justify-end">
					<Skeleton className="h-11 w-36 rounded-2xl" />
				</div>
				<div className="flex items-end gap-2">
					<Skeleton className="h-7 w-7 rounded-full" />
					<Skeleton className="h-11 w-48 rounded-2xl" />
				</div>
			</div>

			<div className="border-t border-border p-4">
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded-md" />
					<Skeleton className="h-10 flex-1 rounded-full" />
					<Skeleton className="h-10 w-20 rounded-full" />
				</div>
			</div>
		</div>
	);
};

export default ChatWindowSkeleton;
