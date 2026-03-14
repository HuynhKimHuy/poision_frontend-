import { useChatStore } from "@/stores/useChatStore"
import MessageInput from "./MessageInput"

const ChatWindowFooter = () => {
    const { activeConversationId, conversations } = useChatStore()
    const selectedConversation = conversations.find((conversation) => conversation._id === activeConversationId) ?? null
    return (
        <div className="sticky bottom-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-t bg-background px-4">
            <MessageInput selectedConversation={selectedConversation} />
        </div>
    )
}

export default ChatWindowFooter