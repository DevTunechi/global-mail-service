import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { recipients, subject, html, ref, apiToken } = await req.json();

  // 1. Format the batch for Postmark
  // recipients is an array of email strings
  const emailBatch = recipients.map((email: string) => ({
    From: `SwitchMail Support <noreply@swtchmail.live>`,
    To: email,
    Subject: subject,
    HtmlBody: html,
    MessageStream: "outbound",
    TrackOpens: true
  }));

  try {
    const response = await fetch("https://api.postmarkapp.com/email/batch", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": apiToken // Postmark Server Token
      },
      body: JSON.stringify(emailBatch),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, delivered: data.length });
  } catch (error) {
    return NextResponse.json({ error: "Postmark Failed" }, { status: 500 });
  }
}