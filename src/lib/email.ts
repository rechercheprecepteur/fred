
// lib/email.ts
import nodemailer from 'nodemailer'

// Log la configuration au démarrage
console.log('📧 Configuration email:', {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || '587',
  user: process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 5)}...` : 'NON DÉFINI',
  pass: process.env.SMTP_PASS ? '***défini***' : 'NON DÉFINI'
})

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  // Ajouter des logs de debug
  logger: true,
  debug: true
})

// Vérifier la connexion au démarrage
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Erreur de connexion SMTP:', error)
  } else {
    console.log('✅ Serveur SMTP prêt à envoyer des emails')
  }
})

export async function sendEmail(to: string, subject: string, html: string) {
  console.log('📧 ========== TENTATIVE D\'ENVOI D\'EMAIL ==========')
  console.log('📧 À:', to)
  console.log('📧 Sujet:', subject)
  console.log('📧 HTML length:', html.length, 'caractères')
  console.log('📧 SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 5) + '...' : 'MANQUANT'
  })
  
  try {
    const mailOptions = {
      from: `"Plateforme Précepteurs" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    }

    console.log('📧 Options d\'envoi:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    })

    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email envoyé avec succès!')
    console.log('✅ Message ID:', info.messageId)
    console.log('✅ Response:', info.response)
    console.log('✅ Accepté:', info.accepted)
    console.log('✅ Rejeté:', info.rejected)
    
    return { success: true, messageId: info.messageId }
    
  } catch (error: any) {
    console.error('❌ ========== ERREUR ENVOI EMAIL ==========')
    console.error('❌ Message:', error.message)
    console.error('❌ Code:', error.code)
    console.error('❌ Command:', error.command)
    console.error('❌ Stack:', error.stack)
    
    if (error.code === 'EAUTH') {
      console.error('❌ Erreur d\'authentification - Vérifiez SMTP_USER et SMTP_PASS')
    } else if (error.code === 'ESOCKET') {
      console.error('❌ Erreur de connexion - Vérifiez SMTP_HOST et SMTP_PORT')
    } else if (error.code === 'EENVELOPE') {
      console.error('❌ Erreur d\'enveloppe - Vérifiez les adresses email')
    }
    
    return { success: false, error: error.message }
  }
}

// lib/emailTemplates.ts

export function getVerificationEmail(username: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; background: #f9fafb; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; background: white; }
        .token-box { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-family: monospace; color: #4f46e5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏫 Vérifiez votre email</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${username} !</h2>
          <p>Merci de vous être inscrit sur la <strong>Plateforme Précepteurs</strong>. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Vérifier mon email</a>
          </div>
          
          <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <div class="token-box">
            ${verificationUrl}
          </div>
          
          <p><strong>Ce lien expire dans 24 heures.</strong></p>
          <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Plateforme Précepteurs. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getPasswordResetEmail(username: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; background: #f9fafb; }
        .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #d97706; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; background: white; }
        .token-box { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-family: monospace; color: #d97706; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${username} !</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur la <strong>Plateforme Précepteurs</strong>.</p>
          
          <div class="warning-box">
            <strong>⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</strong>
          </div>
          
          <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </div>
          
          <p>Ou copiez ce lien :</p>
          <div class="token-box">
            ${resetUrl}
          </div>
          
          <p><strong>Ce lien expire dans 1 heure.</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Plateforme Précepteurs. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `
}