import {Contact} from "./contact.model";

export interface NewChatDTO {
    chatId: number,
    chatName: string,
    avatarUrl: string,
    participants: Contact[],
}
