import { useChatStore } from "@/stores/useChatStore"
import MessageInput from "./MessageInput"

const ChatWindowFooter = () => {
     const {activeConversationId, conversations} = useChatStore()
    const selectedConversation = conversations.find((conversation) => conversation._id === activeConversationId) ?? null
    return (
        <div className="  bottom-0 flex h-16 w-full items-center justify-between border-b px-4">   
                <MessageInput selectedConversation={selectedConversation} />
            </div>
    )
}

export default ChatWindowFooter