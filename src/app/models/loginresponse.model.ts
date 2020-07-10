export interface ChatDTO {
    chatId: number,
    chatName: string,
    avatarUrl: string,
    members: number[]
}

export interface ContactDTO {
    userId: number,
    userName: string,
    phoneNumber: string,
    avatarUrl: string,
    lastSeen: Date
}

export interface LoginUserResponse {
    userId: number,
    userName: string,
    phoneNumber: string,
    avatarUrl: string,
    password: string
    contacts: ContactDTO[],
    chats: ChatDTO[]
}

