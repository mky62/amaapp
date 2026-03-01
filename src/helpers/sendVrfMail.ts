import { resend } from '@/lib/resend';
import VerificationEmail from '../emails/VerifEmail';
import { ApResp } from '@/types/ApResponse';


export async function sendVrfMail(
    email: string,
    username: string,
    verifyCode: string
):  Promise<ApResp> {

    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: ' Verification Code',
        react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'Verification email sent successfully.' };
    } 
    catch (error) 
    {
        console.error('Error sending verification email:', error);
        return { success: false, message: 'Failed to send verification email' };
    }
        }
