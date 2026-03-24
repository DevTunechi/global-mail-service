// src/lib/providers.ts

export interface MailProvider {
  id: string
  name: string
  shortName: string
  color: string          // brand accent color
  textColor: string      // for contrast on colored bg
  logoUrl: string        // Points to local public file /name.png
  emailHint: string      // placeholder hint
}

export const PROVIDERS: MailProvider[] = [
  {
    id: 'google',
    name: 'Google',
    shortName: 'Gmail',
    color: '#EA4335',
    textColor: '#fff',
    logoUrl: '/google.png',
    emailHint: 'you@gmail.com',
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    shortName: 'Yahoo Mail',
    color: '#6001D2',
    textColor: '#fff',
    logoUrl: '/yahoo.png',
    emailHint: 'you@yahoo.com',
  },
  {
    id: 'outlook',
    name: 'Outlook / Hotmail',
    shortName: 'Outlook',
    color: '#0078D4',
    textColor: '#fff',
    logoUrl: '/outlook.png',
    emailHint: 'you@outlook.com',
  },
  {
    id: 'aol',
    name: 'AOL Mail',
    shortName: 'AOL',
    color: '#FF0B00',
    textColor: '#fff',
    logoUrl: '/aol.png',
    emailHint: 'you@aol.com',
  },
  {
    id: 'mailcom',
    name: 'Mail.com',
    shortName: 'Mail.com',
    color: '#005A9C',
    textColor: '#fff',
    logoUrl: '/mailcom.png',
    emailHint: 'you@mail.com',
  },
  {
    id: 'icloud',
    name: 'iCloud Mail',
    shortName: 'iCloud',
    color: '#1d1d1f',
    textColor: '#fff',
    logoUrl: '/icloud.png',
    emailHint: 'you@icloud.com',
  },
  {
    id: 'proton',
    name: 'Proton Mail',
    shortName: 'Proton',
    color: '#6D4AFF',
    textColor: '#fff',
    logoUrl: '/proton.png',
    emailHint: 'you@proton.me',
  },
  {
    id: 'office365',
    name: 'Office 365',
    shortName: 'Office 365',
    color: '#D83B01',
    textColor: '#fff',
    logoUrl: '/office365.png',
    emailHint: 'you@company.com',
  },
]