import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { chatState } from "@/types/store";
import { fetchConversations } from "@/service/chatSevice";
import { useAuthStore } from "./useAuthStore";
import { fetchMessages } from "@/service/chatSevice";
export const useChatStore = create<chatState>()(
    persist(
        (set,get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,
            messagesLoading: false,
            setActiveConversation: (conversationId) => {
                set({ activeConversationId: conversationId });
            },
            resetChatState: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    loading: false,
                })
                // Clear localStorage
                localStorage.removeItem('chat-storage');
            },
            loadConversations: async () => {
                try {
                    set({ loading: true, conversations: [] })
                    const { conversations } = await fetchConversations();
                    set({ conversations, loading: false })
                } catch (error) {
                    console.error("❌ [useChatStore] Error loading conversations:", error);
                    set({ loading: false })
                }
            },
            fetchMessages:async(conversationId) => {
                const {activeConversationId, messages} = get();
                const {user} = useAuthStore();
                if(!user) {
                    console.error("❌ [useChatStore] No user found in auth store.");
                    return;
                }
                const conversationIdToUse = conversationId ?? activeConversationId;
                if(!conversationIdToUse) {
                    console.error("❌ [useChatStore] No conversation ID provided or active.");
                    return;
                }
                const currentMessages = messages?.[conversationIdToUse]
                const nextCursor  = currentMessages?.nextCursor === undefined ? "" : currentMessages.nextCursor
                if(nextCursor === null) {
                    console.log("✅ [useChatStore] No more messages to fetch for conversation:", conversationIdToUse);
                    return;
                }
                set({ messagesLoading: true })

                try {

                    const {messages: newMessages, cursor} =  await fetchMessages(conversationIdToUse, nextCursor);
                    
                    } catch (error) {
                        console.error("❌ [useChatStore] Error fetching messages:", error);
                    } finally {
                        set({ messagesLoading: false })
                    }
            }
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({
                conversations: state.conversations,
            })
        }
    )
)
