export interface User {
    id: number,
    name: string,
    avatarUrl: string
}

export interface Message {
    id: number,
    senderId: number,
    message: string,
    time: Date
}

export interface Chat {
    id: number,
    name: string,
    avatarUrl: string,
    participants: User[],
    messages: Message[],
    lastReadMessageId: number
}
