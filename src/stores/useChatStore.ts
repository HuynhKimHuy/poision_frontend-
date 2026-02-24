import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { chatState } from "@/types/store";
import { fetchConversations } from "@/service/chatSevice";

export const useChatStore = create<chatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,

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
            },
            loadConversations: async () => {
                try {
                    set({ loading: true })
                    const { conversations } = await fetchConversations();
                    set({ conversations, loading: false })
                } catch (error) {
                    console.log(error);
                    set({ loading: false })
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
