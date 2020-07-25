export interface ChatPreview {
    id: number,
    name: string,
    imageUrl: string,
    unreadMessages: number,
    lastMessageSenderName: string,
    lastMessageText: string,
    lastMessageDate: Date
}
