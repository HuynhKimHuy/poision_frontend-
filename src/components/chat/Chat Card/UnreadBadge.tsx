import { Badge } from "@/components/ui/badge"

const UnreadCountBadge = ({ UnreadCount }: { UnreadCount: number }) => {
    return (
        <div className='pulse-ring absolute z-20 -top-1 -right-1'>
            <Badge className="size-5 text-xs bg-gradient-chat border-background flex items-center justify-center p-0">
                {UnreadCount > 9 ? "9+" : UnreadCount}
            </Badge>
        </div>
    )
}

export default UnreadCountBadge
