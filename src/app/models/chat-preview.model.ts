export interface ChatPreview {
    id: string,
    name: string,
    imageUrl: string,
    unreadMessages: number,
    lastMessageSenderName: string,
    lastMessageText: string,
    lastMessageDate: Date
}
