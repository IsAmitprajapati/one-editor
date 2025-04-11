import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);



export const sendEmail = async(email : string,subject : string,rectTemplate : any)=>{
    try {
        const { data, error } = await resend.emails.send({
          from: 'One Editor<onboarding@resend.dev>',
          to: [email],
          subject: subject,
          react: rectTemplate,
        });
    
        if (error) {
          return error
        }

        return data
      } catch (error) {
       return error
      }
}