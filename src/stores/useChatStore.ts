import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { chatState } from "@/types/store"
import {
	fetchConversations,
	fetchMessages,
	sendDirectMessage,
	sendGroupMessage,
} from "@/service/chatSevice"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create<chatState>()(
	persist(
		(set, get) => ({
			conversations: [],
			messages: {},
			activeConversationId: null,
			loading: false,
			messagesLoading: false,

			setActiveConversation: (conversationId) => {
				const userId = useAuthStore.getState().user?._id
				set((state) => ({
					activeConversationId: conversationId,
					conversations: state.conversations.map((conversation) => {
						if (!conversationId || !userId || conversation._id !== conversationId) {
							return conversation
						}

						return {
							...conversation,
							unreadCounts: {
								...(conversation.unreadCounts || {}),
								[userId]: 0,
							},
						}
					}),
				}))
			},

			resetChatState: () => {
				set({
					conversations: [],
					messages: {},
					activeConversationId: null,
					loading: false,
				})
				localStorage.removeItem("chat-storage")
			},

			loadConversations: async () => {
				try {
					set({ loading: true, conversations: [] })
					const { conversations } = await fetchConversations()
					set({ conversations, loading: false })
				} catch (error) {
					console.error("❌ [useChatStore] Error loading conversations:", error)
					set({ loading: false })
				}
			},

			fetchMessages: async (conversationId) => {
				const { activeConversationId, messages } = get()
				const { user } = useAuthStore.getState()

				const converId = conversationId || activeConversationId
				if (!converId) return

				const currentMessages = messages?.[converId]
				const nextCursor = currentMessages?.nextCursor
				const isFirstLoad = !currentMessages

				if (!isFirstLoad && nextCursor === null) return

				set({ messagesLoading: true })

				try {
					const { messages: fetched, cursor } = await fetchMessages(
						converId,
						nextCursor ?? undefined
					)

					const processedMessages = fetched.map((msg) => ({
						...msg,
						isOwn: msg.senderId === user?._id,
					}))

					set((state) => {
						const prev = state.messages[converId]?.items ?? []
						const merged =
							prev.length > 0
								? [...processedMessages, ...prev]
								: processedMessages

						return {
							messages: {
								...state.messages,
								[converId]: {
									items: merged,
									hasMore: !!cursor,
									nextCursor: cursor ?? null,
								},
							},
						}
					})
				} catch (error) {
					console.log("lỗi xảy ra khi fetchMessages", error)
				} finally {
					set({ messagesLoading: false })
				}
			},

			sendDirectMessage: async (recipientId, content, imageUrl, conversationId) => {
				try {
					const { activeConversationId } = get()
					const targetConversationId = conversationId || activeConversationId
					const currentUserId = useAuthStore.getState().user?._id

					const response = await sendDirectMessage(
						recipientId,
						content,
						imageUrl,
						targetConversationId || undefined
					)

					const sentMessage = response?.message
					if (sentMessage) {
						await get().addMessage({
							...sentMessage,
							conversationId: String(sentMessage.conversationId || sentMessage.conversation || targetConversationId),
							senderId: String(sentMessage.senderId || currentUserId || ""),
						})
					}

					if (response?.conversation) {
						get().updateConversation(response.conversation)
					}

					if (!targetConversationId && !response?.conversation) {
						await get().loadConversations()
						return
					}

					set((state) => ({
						conversations: state.conversations.map((c) => {
							const resolvedConversationId = targetConversationId || response?.conversation?._id
							if (!resolvedConversationId || c._id !== resolvedConversationId || !c.lastMessage) return c

							return {
								...c,
								lastMessage: {
									...c.lastMessage,
									content,
								},
							}
						}),
					}))
				} catch (error) {
					console.error("lỗi xảy ra khi sendDirectMessage", error)
				}
			},

			sendGroupMessage: async (_conversationId, _content, _imageUrl) => {
				try {
					const response = await sendGroupMessage(_conversationId, _content, _imageUrl)
					const sentMessage = response?.message
					if (sentMessage) {
						await get().addMessage({
							...sentMessage,
							conversationId: String(sentMessage.conversationId || sentMessage.conversation || _conversationId),
							senderId: String(sentMessage.senderId),
						})
					}

					if (response?.conversation) {
						get().updateConversation(response.conversation)
					}

					set((state) => ({
						conversations: state.conversations.map((c) => {
							if (c._id !== _conversationId || !c.lastMessage) return c

							return {
								...c,
								lastMessage: {
									...c.lastMessage,
									content: _content,
								},
							}
						}),
					}))
				} catch (error) {
					console.error("lỗi xảy ra khi sendGroupMessage", error)
				}
			},
			addMessage: async (message) => {
				const { user } = useAuthStore.getState()
				const convoId = String(message.conversationId)
				const currentUserId = user?._id
				const isOwn = String(message.senderId) === currentUserId

				set((state) => {
					const prevItems = state.messages?.[convoId]?.items || []
					if (prevItems.some((m) => m._id === message._id)) {
						return state
					}

					return {
						messages: {
							...state.messages,
							[convoId]: {
								...state.messages?.[convoId],
								items: [
									...prevItems,
									{
										...message,
										conversationId: convoId,
										senderId: String(message.senderId),
										isOwn,
									},
								],
								hasMore: state.messages?.[convoId]?.hasMore ?? true,
								nextCursor: state.messages?.[convoId]?.nextCursor ?? null,
							},
						},
					}
				})
			},
			updateConversation: (conversation) => {
				const userId = useAuthStore.getState().user?._id
				set((state) => {
					const index = state.conversations.findIndex((c) => c._id === conversation._id)
					const mergedConversation = {
						...(index >= 0 ? state.conversations[index] : {}),
						...conversation,
						unreadCounts: {
							...(index >= 0 ? state.conversations[index].unreadCounts : {}),
							...(conversation.unreadCounts || {}),
						},
					}

					if (userId && state.activeConversationId === mergedConversation._id) {
						mergedConversation.unreadCounts[userId] = 0
					}

					if (index < 0) {
						return {
							conversations: [mergedConversation, ...state.conversations],
						}
					}

					const remaining = state.conversations.filter((c) => c._id !== conversation._id)
					return {
						conversations: [mergedConversation, ...remaining],
					}
				})
			}
		}),
		{
			name: "chat-storage",
			partialize: (state) => ({
				conversations: state.conversations,
			}),
		}
	)
)
