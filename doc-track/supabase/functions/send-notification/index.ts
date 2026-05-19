const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      requester,
      contact,
      documentId,
      documentTitle,
    } = await req.json()

    if (!contact || !documentId || !documentTitle) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const resendKey    = Deno.env.get('RESEND_API_KEY')
    const semaphoreKey = Deno.env.get('SEMAPHORE_API_KEY')

    const results = { email: null, sms: null }
    const errors  = { email: null, sms: null }

    // ── Determine channel from contact ────────────────────────────────────────
    const isEmail = contact.includes('@')
    const isPhone = /^(09|\+639)\d{9}$/.test(contact.replace(/\s/g, ''))

    // ── Send email via Resend ─────────────────────────────────────────────────
    if (isEmail && resendKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from:    'DocTracker <onboarding@resend.dev>',
            to:      [contact],
            subject: `Your document is ready for pickup — ${documentId}`,
            html: `
              <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
                <div style="background: #1c1917; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <h1 style="color: #ffffff; font-size: 18px; margin: 0 0 4px;">DocTracker</h1>
                  <p style="color: #a8a29e; font-size: 13px; margin: 0;">Government Document Tracking System</p>
                </div>

                <h2 style="color: #1c1917; font-size: 20px; margin: 0 0 8px;">
                  Your document is ready for pickup
                </h2>
                <p style="color: #57534e; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                  Hi ${requester || 'Requester'}, your document has been processed and is now ready for pickup at our office.
                </p>

                <div style="background: #f5f5f4; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                  <p style="color: #78716c; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.05em;">Tracking Number</p>
                  <p style="color: #1c1917; font-size: 18px; font-weight: 600; font-family: monospace; margin: 0 0 12px;">${documentId}</p>
                  <p style="color: #78716c; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.05em;">Document</p>
                  <p style="color: #1c1917; font-size: 14px; margin: 0;">${documentTitle}</p>
                </div>

                <p style="color: #57534e; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
                  Please bring a valid ID and this tracking number when you come to claim your document.
                </p>
                <p style="color: #a8a29e; font-size: 12px; margin: 0;">
                  Office hours: Monday–Friday, 8:00 AM – 5:00 PM
                </p>
              </div>
            `,
          }),
        })

        const emailData = await emailRes.json()
        if (!emailRes.ok) throw new Error(emailData.message || 'Resend error')
        results.email = emailData.id
      } catch (err) {
        errors.email = err.message
      }
    }

    // ── Send SMS via Semaphore ────────────────────────────────────────────────
    if (isPhone && semaphoreKey) {
      try {
        // Normalize PH number to 09XXXXXXXXX
        const normalized = contact.replace(/\s/g, '').replace(/^\+63/, '0')

        const smsBody = new URLSearchParams({
          apikey:      semaphoreKey,
          number:      normalized,
          message:     `DocTracker: Hi ${requester || 'Requester'}, your document "${documentTitle}" (${documentId}) is ready for pickup. Please bring a valid ID. Office hours: Mon-Fri 8AM-5PM.`,
          sendername:  'DOCTRACK',
        })

        const smsRes = await fetch('https://api.semaphore.co/api/v4/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: smsBody.toString(),
        })

        const smsData = await smsRes.json()
        if (!smsRes.ok) throw new Error(JSON.stringify(smsData))
        results.sms = smsData[0]?.message_id || 'sent'
      } catch (err) {
        errors.sms = err.message
      }
    }

    // ── If contact is a phone number, skip email (and vice versa) ─────────────
    const anySent = results.email || results.sms
    const anyError = errors.email || errors.sms

    return new Response(
      JSON.stringify({
        success: !!anySent,
        results,
        errors: anyError ? errors : undefined,
        channel: isEmail ? 'email' : isPhone ? 'sms' : 'unknown',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})