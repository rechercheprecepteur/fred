// app/api/send-contract-status-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  console.log('📧 API: send-contract-status-email appelée')
  
  try {
    const body = await request.json()
    console.log('📧 Body reçu:', body)
    
    const {
      to,
      parentName,
      precepteurName,
      eleveName,
      matiere,
      dateDebut,
      dateFin,
      status,
      isAccepted,
      contractId
    } = body

    // Vérifier les champs requis
    if (!to || !parentName || !precepteurName || !eleveName || !matiere) {
      console.error('❌ Champs manquants')
      return NextResponse.json({ 
        success: false, 
        error: 'Champs requis manquants' 
      }, { status: 400 })
    }

    const subject = isAccepted
      ? '✅ Votre demande de contrat a été acceptée !'
      : '❌ Votre demande de contrat a été refusée'

    const statusColor = isAccepted ? '#10b981' : '#ef4444'
    const statusEmoji = isAccepted ? '✅' : '❌'
    const statusText = isAccepted ? 'acceptée' : 'refusée'

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColor}; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .info-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { color: #6b7280; font-weight: 600; }
          .info-value { color: #111827; font-weight: 500; }
          .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; }
          .alert { padding: 15px; border-radius: 8px; margin: 20px 0; }
          .alert-success { background: #d1fae5; color: #065f46; }
          .alert-error { background: #fee2e2; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusEmoji} Contrat ${statusText} !</h1>
            <p>Votre demande de contrat a été ${statusText}</p>
          </div>
          <div class="content">
            <p>Bonjour <strong>${parentName}</strong>,</p>
            
            <div class="alert ${isAccepted ? 'alert-success' : 'alert-error'}">
              <strong>${precepteurName}</strong> a ${statusText} votre demande de contrat pour <strong>${eleveName}</strong>.
            </div>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #4f46e5;">📋 Détails du contrat</h3>
              
              <div class="info-item">
                <span class="info-label">Élève</span>
                <span class="info-value">${eleveName}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Matière</span>
                <span class="info-value">${matiere}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Précepteur</span>
                <span class="info-value">${precepteurName}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Période</span>
                <span class="info-value">Du ${dateDebut} au ${dateFin}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Statut</span>
                <span class="info-value" style="color: ${statusColor}; font-weight: 700;">${statusText.toUpperCase()}</span>
              </div>
            </div>
            
            ${isAccepted ? `
            <div style="text-align: center;">
              <p style="color: #065f46;">🎉 Félicitations ! Le précepteur a accepté votre demande.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parent/contrats/${contractId}" class="button">
                Voir le contrat
              </a>
            </div>
            ` : `
            <div style="text-align: center;">
              <p style="color: #991b1b;">Le précepteur a malheureusement refusé votre demande. Vous pouvez rechercher d'autres précepteurs.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parent/recherche" class="button">
                Rechercher un autre précepteur
              </a>
            </div>
            `}
            
            <div class="footer">
              <p>Cet email a été envoyé automatiquement par la Plateforme Précepteurs</p>
              <p>© ${new Date().getFullYear()} Plateforme Précepteurs. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    console.log('📧 Envoi email à:', to)
    const emailResult = await sendEmail(to, subject, html)

    if (emailResult.success) {
      console.log('✅ Email envoyé avec succès:', emailResult.messageId)
      return NextResponse.json({ success: true, messageId: emailResult.messageId })
    } else {
      console.error('❌ Erreur envoi email:', emailResult.error)
      return NextResponse.json({ success: false, error: emailResult.error }, { status: 500 })
    }

  } catch (error: any) {
    console.error('❌ Erreur API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur serveur' 
    }, { status: 500 })
  }
}