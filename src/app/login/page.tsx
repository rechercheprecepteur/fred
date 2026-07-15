

// // app/login/page.tsx
// 'use client'

// import { useState } from 'react'
// import { resendVerificationEmail } from '@/actions/auth'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/context/AuthContext'
// import Link from 'next/link'

// export default function LoginPage() {
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [showResendButton, setShowResendButton] = useState(false)
//   const [userEmail, setUserEmail] = useState('')
//   const router = useRouter()
//   const { login } = useAuth() // ✅ Utiliser login au lieu de loginUser

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')
//     setShowResendButton(false)

//     try {
//       const formData = new FormData(e.currentTarget)
//       const email = formData.get('email') as string
//       const password = formData.get('password') as string

//       console.log('Tentative de connexion avec:', email)
      
//       // ✅ Utiliser la nouvelle fonction login du contexte
//       const result = await login(email, password)
//       console.log('Résultat login:', result)

//       if (!result.success) {
//         setError(result.error || 'Erreur de connexion')
        
//         // Si l'email n'est pas vérifié, afficher les options
//         if (result.code === 'EMAIL_NOT_VERIFIED') {
//           console.log('Email non vérifié, affichage des options')
//           setShowResendButton(true)
//           setUserEmail(email)
//         }
//       } else {
//         console.log('Connexion réussie, utilisateur:', result.user)
        
//         // ✅ La redirection est gérée automatiquement grâce au contexte
//         // Attendre un peu pour que le cookie soit bien défini
//         await new Promise(resolve => setTimeout(resolve, 300))
        
//         // Rediriger vers le dashboard selon le rôle
//         const dashboardUrl = `/dashboard/${result.user.role}`
//         console.log('🔄 Redirection vers:', dashboardUrl)
        
//         window.location.href = dashboardUrl
//       }
//     } catch (err) {
//       console.error('Erreur login:', err)
//       setError('Une erreur est survenue')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleResendVerification = async () => {
//     setLoading(true)
//     setError('')
//     setSuccess('')
    
//     try {
//       const result = await resendVerificationEmail(userEmail)
      
//       if (result.error) {
//         setError(result.error)
//       } else {
//         setSuccess('📧 Email de vérification renvoyé ! Vérifiez votre boîte mail.')
//         setShowResendButton(false)
//       }
//     } catch (err) {
//       setError('Erreur lors de l\'envoi')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGoToVerify = () => {
//     router.push(`/verify?email=${encodeURIComponent(userEmail)}`)
//   }

//   return (
//     <div className="min-h-screen flex items-center bg-gray-50 justify-center px-4 py-12">
//       <div className="max-w-sm w-full space-y-8">
//         <div className="text-center">
//           <img src='/icon.png' className='w-auto mx-auto h-24' alt="Logo"/>
//           <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
//           <p className="mt-2 text-sm text-gray-600">Connectez-vous à votre compte</p>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           {error && (
//             <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>
//           )}

//           {success && (
//             <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{success}</div>
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
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//               />
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Mot de passe
//                 </label>
//                 <Link 
//                   href="/forgot-password" 
//                   className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
//                 >
//                   Mot de passe oublié ?
//                 </Link>
//               </div>
//               <input
//                 id="password"
//                 type="password"
//                 name="password"
//                 required
//                 autoComplete="current-password"
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Boutons de vérification si email non vérifié */}
//           {showResendButton && (
//             <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
//               <p className="text-sm text-amber-800 font-medium text-center">
//                 ⚠️ Votre email n'est pas encore vérifié
//               </p>
//               <div className="space-y-2">
//                 <button
//                   type="button"
//                   onClick={handleGoToVerify}
//                   className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
//                 >
//                   Entrer le code de vérification
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleResendVerification}
//                   disabled={loading}
//                   className="w-full py-2 px-4 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium disabled:opacity-50"
//                 >
//                   {loading ? 'Envoi...' : "Renvoyer l'email de vérification"}
//                 </button>
//               </div>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">ou</span>
//             </div>
//           </div>

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
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      console.log('🔐 Tentative de connexion avec:', email)
      
      const result = await login(email, password)
      console.log('📥 Résultat login:', result)

      if (!result.success) {
        setError(result.error || 'Email ou mot de passe incorrect')
      } else {
        console.log('✅ Connexion réussie')
        
        // Rediriger vers le dashboard selon le rôle
        const dashboardUrl = `/dashboard/${result.user.role}`
        console.log('🔄 Redirection vers:', dashboardUrl)
        
        setTimeout(() => {
          window.location.href = dashboardUrl
        }, 300)
      }
    } catch (err) {
      console.error('❌ Erreur login:', err)
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setLoading(false)
    }
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
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
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
                placeholder="votre@email.com"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                placeholder="Votre mot de passe"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
            <Link href="/register" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">
              S'inscrire ds
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}