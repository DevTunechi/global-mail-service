// src/lib/providers.ts

export interface MailProvider {
  id: string
  name: string
  shortName: string
  color: string          // brand accent color
  textColor: string      // for contrast on colored bg
  logoUrl: string        // SVG / PNG logo
  emailHint: string      // placeholder hint
}

export const PROVIDERS: MailProvider[] = [
  {
    id: 'google',
    name: 'Google',
    shortName: 'Gmail',
    color: '#EA4335',
    textColor: '#fff',
    logoUrl: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_512dp.png',
    emailHint: 'you@gmail.com',
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    shortName: 'Yahoo Mail',
    color: '#6001D2',
    textColor: '#fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Yahoo%21_logo.svg/320px-Yahoo%21_logo.svg.png',
    emailHint: 'you@yahoo.com',
  },
  {
    id: 'outlook',
    name: 'Outlook / Hotmail',
    shortName: 'Outlook',
    color: '#0078D4',
    textColor: '#fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
    emailHint: 'you@outlook.com',
  },
  {
    id: 'aol',
    name: 'AOL Mail',
    shortName: 'AOL',
    color: '#FF0B00',
    textColor: '#fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/AOL_logo_%282018%29.svg/320px-AOL_logo_%282018%29.svg.png',
    emailHint: 'you@aol.com',
  },
  {
    id: 'mailcom',
    name: 'Mail.com',
    shortName: 'Mail.com',
    color: '#005A9C',
    textColor: '#fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mail.com_logo.svg/320px-Mail.com_logo.svg.png',
    emailHint: 'you@mail.com',
  },
  {
    id: 'icloud',
    name: 'iCloud Mail',
    shortName: 'iCloud',
    color: '#1d1d1f',
    textColor: '#fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/195px-Apple_logo_grey.svg.png',
    emailHint: 'you@icloud.com',
  },
  {
    id: 'proton',
    name: 'Proton Mail',
    shortName: 'Proton',
    color: '#6D4AFF',
    textColor: '#fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Proton_icon_2023.svg/240px-Proton_icon_2023.svg.png',
    emailHint: 'you@proton.me',
  },
  {
    id: 'office365',
    name: 'Office 365',
    shortName: 'Office 365',
    color: '#D83B01',
    textColor: '#fff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/258px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png',
    emailHint: 'you@company.com',
  },
]
