import { Message } from "@/src/model/User";

export interface ApResp{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}