export interface User {
    id: string,
    name: string,
    avatarUrl: string
}

export interface Message {
    id: string,
    senderId: string,
    message: string,
    time: Date
}

export interface Chat {
    id: string,
    name: string,
    avatarUrl: string,
    participants: User[],
    messages: Message[],
    lastReadMessageId: string
}
