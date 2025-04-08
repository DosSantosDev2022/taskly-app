import { Resend } from 'resend';
import {EmailVerificationEmail} from '@/components/emails/verify-email'
import React from 'react';


const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST (req: Request) {
  const { name, email, token } = await req.json()

  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${token}`

  try {
      const {data, error} = await resend.emails.send({
        from: 'Acme <delivered@resend.dev>',
        to: [email],
        subject: 'Verifique o seu e-mail',
        react: React.createElement(EmailVerificationEmail, {
          userName: name,
          verificationUrl,
        })
      })
      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data)

  } catch(error) {
    return Response.json({error}, {status: 500})
  }
}