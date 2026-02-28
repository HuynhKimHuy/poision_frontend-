import { useChatStore } from "@/stores/useChatStore"
import type { Conversation } from "@/types/chat"
import { SidebarTrigger } from "../ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"

const ChatWindowHeader = ({chat}:{chat?:Conversation }) => {
    const {conversations , activeConversationId} = useChatStore()
    chat = chat ?? conversations.find(c => c._id === activeConversationId) ?? undefined
    let otherUser
    if(!chat){
        return(
            <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
            <SidebarTrigger className="-ml-1 text-foreground"/>
         </header>
        )
    }
    if(chat.type === "direct"){
        const otherUsers = chat.participants.filter(p => p.userId !== useAuthStore.getState().user?._id)
        otherUser = otherUsers.length > 0 ? otherUsers[0] : null
    }
    return (
        <header className="flex h-16 w-full items-center justify-between border-b px-4">   
            Chat Window Header
        </header>
    )
}

export default ChatWindowHeader