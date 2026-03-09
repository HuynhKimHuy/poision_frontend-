import { useChatStore } from "@/stores/useChatStore"
import MessageInput from "./MessageInput"

const ChatWindowFooter = () => {
     const {activeConversationId} = useChatStore()
    return (
        <div className="  bottom-0 flex h-16 w-full items-center justify-between border-b px-4">   
                <MessageInput selectedConversation={activeConversationId} />
            </div>
    )
}

export default ChatWindowFooter