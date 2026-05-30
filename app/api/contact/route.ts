import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, phone, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Hiányzó mezők' }, { status: 400 })
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: 'Érvénytelen adatok' }, { status: 400 })
  }

  if (name.length > 100 || email.length > 200 || message.length > 3000 || (phone && String(phone).length > 50)) {
    return NextResponse.json({ error: 'Túl hosszú mező' }, { status: 400 })
  }

  const safeName    = escapeHtml(name.trim())
  const safeEmail   = escapeHtml(email.trim())
  const safePhone   = phone ? escapeHtml(String(phone).trim()) : '–'
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>')

  try {
    await resend.emails.send({
      from: 'Bringabarát Testbike <noreply@testbikevelence.hu>',
      to: safeEmail,
      subject: 'Köszönjük érdeklődésedet – Bringabarát Testbike',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
          <div style="margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 900; color: #111111; margin: 0 0 4px 0;">Bringabarát</h1>
            <p style="font-size: 12px; color: #999999; margin: 0;">Testbike – Kápolnásnyék · Velence</p>
          </div>
          <p style="font-size: 16px; color: #111111; margin-bottom: 16px;">Kedves ${safeName}!</p>
          <p style="font-size: 15px; line-height: 1.7; color: #444444; margin-bottom: 16px;">
            Köszönjük, hogy felvetted velünk a kapcsolatot. Üzenetedet megkaptuk, és hamarosan – általában néhány órán belül – visszahívunk a megadott telefonszámon.
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444444; margin-bottom: 24px;">
            Ha sürgős a dolog, hívj minket közvetlenül: <strong>+36 30 889 7559</strong>
          </p>
          <div style="background: #f9f9f7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="font-size: 13px; font-weight: 700; color: #111111; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Amit nálunk kapsz:</p>
            <ul style="margin: 0; padding-left: 20px; color: #444444; font-size: 14px; line-height: 2;">
              <li>Minden kerékpár személyesen ellenőrzött</li>
              <li>Garancia minden bringára</li>
              <li>Adásvételi szerződés</li>
              <li>2008 óta több mint 1000 elégedett vásárló</li>
            </ul>
          </div>
          <a href="https://testbikevelence.hu" style="display: inline-block; background: #e8c547; color: #111111; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; text-decoration: none; margin-bottom: 32px;">
            Böngéssz a kínálatban →
          </a>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin-bottom: 24px;" />
          <p style="font-size: 13px; color: #999999; line-height: 1.6; margin: 0;">
            <strong style="color: #111111;">Tamás</strong><br />
            Bringabarát Testbike<br />
            Kápolnásnyék, Tó utca 6.<br />
            +36 30 889 7559<br />
            bringabarat@hotmail.com
          </p>
        </div>
      `,
    })

    await resend.emails.send({
      from: 'Bringabarát Testbike <noreply@testbikevelence.hu>',
      to: 'bringabarat@hotmail.com',
      subject: `Új érdeklődés – ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #111111;">Új érdeklődés érkezett</h2>
          <p><strong>Név:</strong> ${safeName}</p>
          <p><strong>Telefon:</strong> ${safePhone}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Üzenet:</strong></p>
          <p style="background: #f9f9f7; padding: 16px; border-radius: 8px;">${safeMessage}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Email küldés sikertelen' }, { status: 500 })
  }
}
