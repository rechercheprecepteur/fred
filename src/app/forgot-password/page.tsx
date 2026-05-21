
// app/forgot-password/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { forgotPassword, resetPassword, resetPasswordWithCode } from '@/actions/auth'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [step, setStep] = useState<'email' | 'verify' | 'newPassword'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [loading, setLoading] = useState(false)
  const [verifiedCode, setVerifiedCode] = useState('') // Stocker le code vérifié

  // Si un token est présent dans l'URL, passer directement à l'étape nouveau mot de passe
  useEffect(() => {
    if (token) {
      setStep('newPassword')
      setMessage('Lien de réinitialisation détecté. Choisissez votre nouveau mot de passe.')
      setMessageType('success')
    }
  }, [token])

  // Étape 1 : Envoyer l'email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await forgotPassword(email)

    if (result.error) {
      setMessage(result.error)
      setMessageType('error')
    } else {
      setMessage('📧 Un email avec un code et un lien vous a été envoyé.')
      setMessageType('success')
      setStep('verify')
    }
    
    setLoading(false)
  }

  // Gestion du code à 6 chiffres
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus suivant
    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`reset-code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      setCode(pastedData.split(''))
    }
  }

// Dans forgot-password/page.tsx - Remplacer la fonction handleVerifyCode

const handleVerifyCode = async () => {
    const fullCode = code.join('')
    
    if (fullCode.length !== 6) {
      setMessage('Veuillez entrer les 6 chiffres du code')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Appeler l'API pour vérifier le code (avec mot de passe vide pour juste vérifier)
      const result = await resetPasswordWithCode(email, fullCode, '')

      console.log('Résultat vérification code:', result)

      // ✅ Si success = true, le code est bon
      if (result.success) {
        setVerifiedCode(fullCode)
        setStep('newPassword')
        setMessage('Choisissez votre nouveau mot de passe.')
        setMessageType('success')
        setLoading(false)
        return
      }

      // ❌ Si error, le code est mauvais
      if (result.error) {
        setMessage(result.error)
        setMessageType('error')
        setCode(['', '', '', '', '', '']) // Réinitialiser les cases
        document.getElementById('reset-code-0')?.focus()
        setLoading(false)
        return
      }

      // Fallback
      setMessage('Erreur inconnue')
      setMessageType('error')
    } catch (err) {
      console.error('Erreur vérification:', err)
      setMessage('Erreur lors de la vérification')
      setMessageType('error')
    }
    
    setLoading(false)
  }

  // Étape 3 : Réinitialiser le mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (newPassword.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères.')
      setMessageType('error')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.')
      setMessageType('error')
      return
    }

    setLoading(true)

    let result

    if (token) {
      // Réinitialisation par lien
      result = await resetPassword(token, newPassword)
    } else {
      // Réinitialisation par code (avec le code déjà vérifié)
      result = await resetPasswordWithCode(email, verifiedCode, newPassword)
    }

    if (result.error) {
      setMessage(result.error)
      setMessageType('error')
    } else {
      setMessage('✅ Mot de passe réinitialisé avec succès ! Redirection...')
      setMessageType('success')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    
    setLoading(false)
  }

  // Renvoyer le code
  const handleResendCode = async () => {
    setLoading(true)
    setMessage('')

    const result = await forgotPassword(email)

    if (result.error) {
      setMessage(result.error)
      setMessageType('error')
    } else {
      setMessage('📧 Nouveau code envoyé !')
      setMessageType('success')
      setCode(['', '', '', '', '', ''])
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  px-4 py-12">
      <div className="max-w-md w-full rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/icon.png" className="w-16 h-16 mx-auto mb-4" alt="Logo" />
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'email' && 'Mot de passe oublié'}
            {step === 'verify' && 'Vérification'}
            {step === 'newPassword' && 'Nouveau mot de passe'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'email' && 'Entrez votre email pour réinitialiser votre mot de passe'}
            {step === 'verify' && `Un code a été envoyé à ${email}`}
            {step === 'newPassword' && 'Choisissez un nouveau mot de passe sécurisé'}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg text-sm mb-6 ${
            messageType === 'error' 
              ? 'bg-red-50 text-red-600 border border-red-200' 
              : 'bg-green-50 text-green-600 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Étape 1 : Demander l'email */}
        {step === 'email' && (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-gray-600 hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}

        {/* Étape 2 : Entrer le code ET LE VÉRIFIER */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Code de vérification à 6 chiffres
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`reset-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={loading || code.join('').length !== 6}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Vérification...' : 'Vérifier le code'}
            </button>

            <div className="text-center space-y-2">
              <button
                onClick={handleResendCode}
                disabled={loading}
                className="text-sm text-indigo-600 hover:underline font-medium"
              >
                Renvoyer le code
              </button>
              <br />
              <button
                onClick={() => setStep('email')}
                className="text-sm text-gray-600 hover:underline"
              >
                Changer d'email
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 : Nouveau mot de passe */}
        {step === 'newPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
           

            {token && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                ✅ Lien de réinitialisation validé
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>

            {!token && (
              <button
                type="button"
                onClick={() => {
                  setStep('verify')
                  setCode(['', '', '', '', '', ''])
                  setVerifiedCode('')
                }}
                className="w-full py-2 text-sm text-gray-600 hover:underline text-center"
              >
                ← Retour au code
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}