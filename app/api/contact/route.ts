import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  console.log('Contact API called')
  const body = await request.json()
  console.log('Body:', body)

  const { name, email, phone, message } = body

  if (!name || !email || !message) {
    console.log('Missing fields')
    return NextResponse.json({ error: 'Hiányzó mezők' }, { status: 400 })
  }

  try {
    console.log('Sending email to:', email)
    const result = await resend.emails.send({
      from: 'Bringabarát Tesztbike <noreply@testbikevelence.hu>',
      to: email,
      subject: 'Köszönjük érdeklődésedet – Bringabarát Tesztbike',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
          <div style="margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 900; color: #111111; margin: 0 0 4px 0;">Bringabarát</h1>
            <p style="font-size: 12px; color: #999999; margin: 0;">Tesztbike – Kápolnásnyék · Velence</p>
          </div>
          <p style="font-size: 16px; color: #111111; margin-bottom: 16px;">Kedves ${name}!</p>
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
            Bringabarát Tesztbike<br />
            Kápolnásnyék, Tó utca 6.<br />
            +36 30 889 7559<br />
            bringabarat@hotmail.com
          </p>
        </div>
      `,
    })

    console.log('Resend result:', result)

    await resend.emails.send({
      from: 'Bringabarát Tesztbike <noreply@testbikevelence.hu>',
      to: 'bringabarat@hotmail.com',
      subject: `Új érdeklődés – ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #111111;">Új érdeklődés érkezett</h2>
          <p><strong>Név:</strong> ${name}</p>
          <p><strong>Telefon:</strong> ${phone ?? '–'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Üzenet:</strong></p>
          <p style="background: #f9f9f7; padding: 16px; border-radius: 8px;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('Resend error:', error)
    return NextResponse.json({ error: 'Email küldés sikertelen' }, { status: 500 })
  }
}
