export interface ChatPreview {
    id: string,
    name: string,
    imageUrl: string,
    unreadMessages: number,
    lastMessageSenderId: string,
    lastMessageSenderName: string,
    lastMessageText: string,
    lastMessageDate: Date
}
