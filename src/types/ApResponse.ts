import { Message } from "@/model/User";

export interface ApResp{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}