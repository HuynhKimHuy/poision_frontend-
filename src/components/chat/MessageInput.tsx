import { useAuthStore } from "@/stores/useAuthStore"
import { ImagePlay, Send } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import EmojiPicker from "./Chat Card/EmojiPicker"
import { useChatStore } from "@/stores/useChatStore"
import type { Conversation } from "@/types/chat"

const MessageInput = ({selectedConversation}:{selectedConversation: Conversation | null}) => {
const {user } = useAuthStore()
const [value , setValue] = useState("")


    const sendMessage = async () => {
        if(!value.trim() || !selectedConversation) return
        try {
            if(selectedConversation.type === "direct"){
             const participan = selectedConversation.participants.find((p) => p.userId !== user?._id)
             if(!participan) return

             await useChatStore.getState().sendDirectMessage(participan.userId, value.trim(), undefined, selectedConversation._id)
             setValue("")
             return
            }

            await useChatStore.getState().sendGroupMessage(selectedConversation._id, value.trim())
            setValue("")
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }
    if(!user) {
        return null
    }
    
    return (
        <div className="flex w-full items-center gap-2 p-3 min-h-[50px] bg-background rounded-md">   
           <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full hover:bg-primary-forground/10">
            <ImagePlay className="size-4"/>
           </Button>

           <div
            className="flex-1 relative">
            <Input 
                onKeyDown={(e)=> {
                    if(e.key === "Enter" && !e.shiftKey){
                        e.preventDefault()
                        sendMessage()
                    }
                }}
                type="text" 
                placeholder="Nhập Tin Nhắn ...." 
                className=" w-full bg-transparent border-none focus:outline-none transition-smooth pr-10 resize-none "
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <EmojiPicker onChange={(emoji) => setValue((prev) => prev + emoji)} />
            </div>
            
           </div>
           <Button 
            onClick={sendMessage}
            className="bg-gradient-chat hover:shadow-glow transition-smooth transform  rounded-full" disabled={!value.trim()}>
                <Send className="size-4 text-white"/>
            </Button>
        </div>
    )
}

export default  MessageInput