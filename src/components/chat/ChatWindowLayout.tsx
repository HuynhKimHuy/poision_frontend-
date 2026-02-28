import { useChatStore } from "@/stores/useChatStore"
import ChatWellcome from "./ChatWellcome"
import ChatWindowFooter from "./ChatWindowFooter"
import { SidebarInset } from "../ui/sidebar"
import ChatWindowHeader from "./ChatWindowHeader"
import ChatWindowBody from "./ChatWindowBody"



const ChatWindowLayout = () => {
    const {activeConversationId,
        conversations,
        messages,
        messagesLoading:loading,

    } = useChatStore()
    const selectedConversations = conversations.find(c => c._id === activeConversationId) ?? null
    if(!selectedConversations){
        return <ChatWellcome/>
    }
    if(loading || !messages[selectedConversations._id]){
        // return <ChatWindowSkeleton/>
    }
    return (
        <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
           {/* <ChatWindowHeader/> */}
           <ChatWindowHeader/>       
           {/* <ChatWindowBody/> */}
           <ChatWindowBody/>
              {/* <ChatWindowFooter/> */}
            <ChatWindowFooter/>
        </SidebarInset>
    )
}

export default ChatWindowLayout
