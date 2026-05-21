
// lib/emailTemplates.ts

export function getNewContractRequestEmail(data: {
  precepteurName: string
  parentName: string
  matiere: string
  dateDebut: string
  dateFin: string
  jours: string
  horaires: string
  tarif: string
  message?: string
}) {
  console.log('📧 Génération du template email avec les données:', {
    precepteurName: data.precepteurName,
    parentName: data.parentName,
    matiere: data.matiere,
    dateDebut: data.dateDebut,
    dateFin: data.dateFin,
    jours: data.jours,
    horaires: data.horaires,
    tarif: data.tarif || 'Non spécifié',
    hasMessage: !!data.message
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .info-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .info-label { color: #6b7280; font-weight: 600; }
        .info-value { color: #111827; font-weight: 500; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; }
        .highlight { color: #4f46e5; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><img src="/icon.png"/> Nouvelle Demande de Cours !</h1>
          <p>Un parent souhaite travailler avec vous</p>
        </div>
        <div class="content">
          <p>Bonjour <strong>${data.precepteurName}</strong>,</p>
          <p>Félicitations ! <strong>${data.parentName}</strong> vous a envoyé une proposition de contrat pour des cours particuliers.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #4f46e5;">📋 Détails de la demande</h3>
            
            <div class="info-item">
              <span class="info-label">Matière</span>
              <span class="info-value">${data.matiere}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Période</span>
              <span class="info-value">Du ${data.dateDebut} au ${data.dateFin}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Jours</span>
              <span class="info-value">${data.jours}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Horaires</span>
              <span class="info-value">${data.horaires}</span>
            </div>
            
            ${data.tarif ? `
            <div class="info-item">
              <span class="info-label">Tarif proposé</span>
              <span class="info-value highlight">${data.tarif} FC/h</span>
            </div>
            ` : ''}
          </div>
          
          ${data.message ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>💬 Message du parent :</strong>
            <p style="margin: 10px 0 0 0;">${data.message}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/precepteur/contrats" class="button">
              Voir mes contrats
            </a>
          </div>
          
          <p style="margin-top: 20px;">Vous pouvez accepter ou refuser cette proposition depuis votre tableau de bord.</p>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement par la Plateforme Précepteurs</p>
            <p>© ${new Date().getFullYear()} Plateforme Précepteurs. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  console.log('📧 Template HTML généré, longueur:', html.length, 'caractères')
  return html
}


// lib/emailTemplates.ts

export function getVerificationEmail(username: string, token: string, code: string) {
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
        .code-box { 
          background: white; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 20px 0; 
          text-align: center;
          border: 2px dashed #4f46e5;
        }
        .code { 
          font-size: 36px; 
          font-weight: bold; 
          letter-spacing: 8px; 
          color: #4f46e5; 
          font-family: 'Courier New', monospace;
          margin: 10px 0;
        }
        .button { 
          display: inline-block; 
          background: #4f46e5; 
          color: white; 
          padding: 15px 35px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600; 
          margin: 20px 0; 
        }
        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 25px 0;
          color: #9ca3af;
        }
        .separator::before,
        .separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #d1d5db;
        }
        .separator span {
          padding: 0 15px;
          font-size: 14px;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          color: #9ca3af; 
          font-size: 12px; 
          background: white; 
        }
        .info-text {
          color: #6b7280;
          font-size: 14px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏫 Vérifiez votre email</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${username} !</h2>
          <p>Merci de vous être inscrit sur la <strong>Plateforme Précepteurs</strong>. Pour activer votre compte, utilisez l'une des méthodes ci-dessous :</p>
          
          <!-- Méthode 1 : Bouton -->
          <h3 style="color: #4f46e5;">🔗 Méthode 1 : Cliquez sur le bouton</h3>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Vérifier mon email</a>
          </div>
          
          <div class="separator">
            <span>OU</span>
          </div>
          
          <!-- Méthode 2 : Code -->
          <h3 style="color: #4f46e5;">🔢 Méthode 2 : Utilisez ce code</h3>
          <p class="info-text">Copiez ce code de vérification dans l'application :</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
            <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
              Ce code expire dans 24 heures
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>⚠️ Important :</strong> Si vous n'avez pas créé de compte, ignorez cet email.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Plateforme Précepteurs. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getPasswordResetEmail(username: string, token: string, code: string) {
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
        .code-box { 
          background: white; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 20px 0; 
          text-align: center;
          border: 2px dashed #d97706;
        }
        .code { 
          font-size: 36px; 
          font-weight: bold; 
          letter-spacing: 8px; 
          color: #d97706; 
          font-family: 'Courier New', monospace;
          margin: 10px 0;
        }
        .button { 
          display: inline-block; 
          background: #d97706; 
          color: white; 
          padding: 15px 35px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600; 
          margin: 20px 0; 
        }
        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 25px 0;
          color: #9ca3af;
        }
        .separator::before,
        .separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #d1d5db;
        }
        .separator span {
          padding: 0 15px;
          font-size: 14px;
        }
        .warning-box { 
          background: #fef3c7; 
          border-left: 4px solid #f59e0b; 
          padding: 15px; 
          margin: 20px 0; 
          border-radius: 4px; 
        }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; background: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${username} !</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Choisissez une méthode :</p>
          
          <!-- Méthode 1 : Bouton -->
          <h3 style="color: #d97706;">🔗 Méthode 1 : Cliquez sur le bouton</h3>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </div>
          
          <div class="separator">
            <span>OU</span>
          </div>
          
          <!-- Méthode 2 : Code -->
          <h3 style="color: #d97706;">🔢 Méthode 2 : Utilisez ce code</h3>
          <p style="color: #6b7280; font-size: 14px;">Copiez ce code dans l'application :</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
            <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
              Ce code expire dans 1 heure
            </p>
          </div>
          
          <div class="warning-box">
            <strong>⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</strong>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Plateforme Précepteurs. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `
}