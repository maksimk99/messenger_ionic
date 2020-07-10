export interface Participant {
    participantId: number,
    participantName: string,
    avatarUrl: string
}

export interface Message {
    messageId: number,
    senderId: number,
    message: string,
    time: Date
}

export interface Chat {
    chatId: number,
    chatName: string,
    avatarUrl: string,
    participants: Participant[],
    messages: Message[],
    lastReadMessageId: number
}
