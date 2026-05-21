
// 'use client'

// import { useEffect, useState } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { verifyEmail, verifyEmailWithCode, resendVerificationEmail } from '@/actions/auth'

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const token = searchParams.get('token')
//   const emailParam = searchParams.get('email')
  
//   const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'code_input'>('loading')
//   const [message, setMessage] = useState('')
//   const [code, setCode] = useState('')
//   const [email, setEmail] = useState(emailParam || '')
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     // Si on a un token, vérifier automatiquement
//     if (token) {
//       verifyWithToken()
//     } else if (emailParam) {
//       // Si on a juste l'email, montrer l'input du code
//       setStatus('code_input')
//     } else {
//       setStatus('code_input')
//     }
//   }, [token, emailParam])

//   const verifyWithToken = async () => {
//     if (!token) return
    
//     const result = await verifyEmail(token)
//     if (result.success) {
//       setStatus('success')
//       setMessage(result.message || 'Email vérifié avec succès !')
//       setTimeout(() => router.push('/login'), 3000)
//     } else {
//       setStatus('error')
//       setMessage(result.error || 'Erreur lors de la vérification')
//     }
//   }

//   const handleCodeVerification = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!email || !code) {
//       setMessage('Veuillez remplir tous les champs')
//       return
//     }

//     if (code.length !== 6) {
//       setMessage('Le code doit contenir 6 chiffres')
//       return
//     }

//     setLoading(true)
//     const result = await verifyEmailWithCode(email, code)
    
//     if (result.success) {
//       setStatus('success')
//       setMessage(result.message || 'Email vérifié avec succès !')
//       setTimeout(() => router.push('/login'), 3000)
//     } else {
//       setStatus('error')
//       setMessage(result.error || 'Code incorrect')
//     }
//     setLoading(false)
//   }

//   const handleResendCode = async () => {
//     if (!email) {
//       setMessage('Veuillez entrer votre email')
//       return
//     }

//     setLoading(true)
//     const result = await resendVerificationEmail(email)
    
//     if (result.success) {
//       setMessage('Nouveau code envoyé ! Vérifiez votre email.')
//     } else {
//       setMessage(result.error || 'Erreur lors de l\'envoi')
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
//         {status === 'loading' && (
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//             <h2 className="text-xl font-semibold text-gray-900">Vérification en cours...</h2>
//             <p className="text-gray-600 mt-2">Nous vérifions votre adresse email.</p>
//           </div>
//         )}

//         {status === 'success' && (
//           <div className="text-center">
//             <div className="text-green-500 mb-4">
//               <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900">Email vérifié !</h2>
//             <p className="text-gray-600 mt-2">{message}</p>
//             <p className="text-sm text-gray-500 mt-4">Redirection vers la page de connexion...</p>
//           </div>
//         )}

//         {status === 'code_input' && (
//           <div>
//             <div className="text-center mb-6">
//               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
//                 <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900">Vérification par code</h2>
//               <p className="text-gray-600 mt-2">
//                 Entrez le code à 6 chiffres envoyé par email
//               </p>
//             </div>

//             <form onSubmit={handleCodeVerification} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="votre@email.com"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Code de vérification
//                 </label>
//                 <input
//                   type="text"
//                   value={code}
//                   onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                   placeholder="123456"
//                   maxLength={6}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest"
//                 />
//               </div>

// {message && (
//   <div className={`p-3 rounded-lg text-sm text-center ${
//     message.includes('incorrect') || message.includes('expiré') || message.includes('Erreur') 
//       ? 'bg-red-50 text-red-500' 
//       : 'bg-green-50 text-green-600'
//   }`}>
//     {message}
//   </div>
// )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
//               >
//                 {loading ? 'Vérification...' : 'Vérifier'}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleResendCode}
//                 disabled={loading}
//                 className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Renvoyer le code
//               </button>
//             </form>

//             <div className="mt-6 text-center text-sm text-gray-500">
//               <p>Vous avez reçu un lien ? {' '}
//                 <button 
//                   onClick={() => router.push('/login')}
//                   className="text-indigo-600 hover:underline"
//                 >
//                   Aller à la connexion
//                 </button>
//               </p>
//             </div>
//           </div>
//         )}

//         {status === 'error' && (
//           <div className="text-center">
//             <div className="text-red-500 mb-4">
//               <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900">Erreur</h2>
//             <p className="text-gray-600 mt-2">{message}</p>
//             <button
//               onClick={() => setStatus('code_input')}
//               className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
//             >
//               Réessayer avec un code
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// app/verify-email/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmail, verifyEmailWithCode, resendVerificationEmail } from '@/actions/auth'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'code_input'>('loading')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState(emailParam || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Si on a un token, vérifier automatiquement
    if (token) {
      verifyWithToken()
    } else if (emailParam) {
      // Si on a juste l'email, montrer l'input du code
      setStatus('code_input')
    } else {
      setStatus('code_input')
    }
  }, [token, emailParam])

  const verifyWithToken = async () => {
    if (!token) return
    
    const result = await verifyEmail(token)
    if (result.success) {
      setStatus('success')
      setMessage(result.message || 'Email vérifié avec succès !')
      setTimeout(() => router.push('/login'), 3000)
    } else {
      setStatus('error')
      setMessage(result.error || 'Erreur lors de la vérification')
    }
  }

  // Gestion du code à 6 chiffres
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus suivant
    if (value && index < 5) {
      const nextInput = document.getElementById(`verify-code-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit si tous les chiffres remplis
    if (index === 5 && value) {
      const fullCode = newCode.join('')
      if (fullCode.length === 6) {
        // Auto-vérification quand les 6 chiffres sont saisis
        setTimeout(() => {
          handleCodeVerification(fullCode)
        }, 300)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`verify-code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      setTimeout(() => {
        handleCodeVerification(pastedData)
      }, 300)
    }
  }

  const handleCodeVerification = async (codeString?: string) => {
    const verificationCode = codeString || code.join('')
    
    if (!email) {
      setMessage('Veuillez entrer votre email')
      setMessageType('error')
      return
    }

    if (verificationCode.length !== 6) {
      setMessage('Le code doit contenir 6 chiffres')
      setMessageType('error')
      return
    }

    setLoading(true)
    const result = await verifyEmailWithCode(email, verificationCode)
    
    if (result.success) {
      setStatus('success')
      setMessage(result.message || 'Email vérifié avec succès !')
      setMessageType('success')
      setTimeout(() => router.push('/login'), 3000)
    } else {
      setStatus('code_input')
      setMessage(result.error || 'Code incorrect')
      setMessageType('error')
      setCode(['', '', '', '', '', ''])
    }
    setLoading(false)
  }

  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleCodeVerification()
  }

  const handleResendCode = async () => {
    if (!email) {
      setMessage('Veuillez entrer votre email')
      setMessageType('error')
      return
    }

    setLoading(true)
    const result = await resendVerificationEmail(email)
    
    if (result.success) {
      setMessage('📧 Nouveau code envoyé ! Vérifiez votre email.')
      setMessageType('success')
      setCode(['', '', '', '', '', ''])
    } else {
      setMessage(result.error || "Erreur lors de l'envoi")
      setMessageType('error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Vérification en cours...</h2>
            <p className="text-gray-600 mt-2">Nous vérifions votre adresse email.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-500 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Email vérifié !</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <p className="text-sm text-gray-500 mt-4">Redirection vers la page de connexion...</p>
          </div>
        )}

        {status === 'code_input' && (
          <div>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Vérification par code</h1>
              <p className="text-gray-600 mt-2">
                Entrez le code à 6 chiffres envoyé par email
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

            <form onSubmit={handleManualVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Code de vérification
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`verify-code-${index}`}
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
                type="submit"
                disabled={loading || code.join('').length !== 6}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Vérification...' : 'Vérifier'}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-indigo-600 hover:underline font-medium"
                >
                  Renvoyer le code
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Vous avez reçu un lien ? {' '}
                <button 
                  onClick={() => router.push('/login')}
                  className="text-indigo-600 hover:underline"
                >
                  Aller à la connexion
                </button>
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Erreur</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              onClick={() => setStatus('code_input')}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Réessayer avec un code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}