// // app/login/page.tsx
// 'use client'

// import { useState } from 'react'
// import { login } from '@/actions/auth'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/context/AuthContext'
// import Link from 'next/link'

// export default function LoginPage() {
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()
//   const { loginUser } = useAuth()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     try {
//       const formData = new FormData(e.currentTarget)
//       const email = formData.get('email') as string
//       const password = formData.get('password') as string

//       const result = await login(email, password)

//       if (result.error) {
//         setError(result.error)
//       } else if (result.success && result.user) {
//         // Mettre à jour le contexte avec l'utilisateur
//         loginUser(result.user)
        
//         // Rediriger selon le rôle
//         router.push(`/dashboard/${result.user.role}`)
//       }
//     } catch (err) {
//       setError('Une erreur est survenue')
//       console.error('Erreur login:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="max-w-sm w-full space-y-8">
//         <div className="text-center ">
//           <img src='/icon.png' className='w-auto mx-auto h-24' alt="Logo"/>
//           <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
//           <p className="mt-2 text-sm text-gray-600">Connectez-vous à votre compte</p>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           {error && (
//             <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 required
//                 autoComplete="email"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Mot de passe
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 name="password"
//                 required
//                 autoComplete="current-password"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                 </svg>
//                 Connexion...
//               </span>
//             ) : (
//               'Se connecter'
//             )}
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             Pas encore de compte ?{' '}
//             <Link href="/register" className="text-black font-medium hover:underline">
//               S'inscrire
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   )
// }

// app/login/page.tsx
'use client'

import { useState } from 'react'
import { login, resendVerificationEmail } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResendButton, setShowResendButton] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const { loginUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setShowResendButton(false)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const result = await login(email, password)

      if (result.error) {
        setError(result.error)
        
        // Si l'email n'est pas vérifié, afficher les options
        if (result.code === 'EMAIL_NOT_VERIFIED') {
          setShowResendButton(true)
          setUserEmail(email)
        }
      } else if (result.success && result.user) {
        // Mettre à jour le contexte avec l'utilisateur
        loginUser(result.user)
        
        // Rediriger selon le rôle
        router.push(`/dashboard/${result.user.role}`)
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error('Erreur login:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    const result = await resendVerificationEmail(userEmail)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('📧 Email de vérification renvoyé ! Vérifiez votre boîte mail.')
      setShowResendButton(false)
    }
    
    setLoading(false)
  }

  const handleGoToVerify = () => {
    router.push(`/verify?email=${encodeURIComponent(userEmail)}`)
  }

  return (
    <div className="min-h-screen flex items-center bg-gray-50 justify-center px-4 py-12">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <img src='/icon.png' className='w-auto mx-auto h-24' alt="Logo"/>
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-sm text-gray-600">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{success}</div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Boutons de vérification si email non vérifié */}
          {showResendButton && (
            <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium text-center">
                ⚠️ Votre email n'est pas encore vérifié
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoToVerify}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Entrer le code de vérification
                </button>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full py-2 px-4 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : "Renvoyer l'email de vérification"}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-black font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}