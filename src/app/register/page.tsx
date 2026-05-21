

// // // app/register/page.tsx
// // 'use client'

// // import { useState } from 'react'
// // import { register } from '@/actions/auth'
// // import { useRouter } from 'next/navigation'
// // import Link from 'next/link'

// // export default function RegisterPage() {
// //   const [error, setError] = useState('')
// //   const [loading, setLoading] = useState(false)
// //   const [role, setRole] = useState('parent')
// //   const router = useRouter()

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault()
// //     setLoading(true)
// //     setError('')

// //     const formData = new FormData(e.currentTarget)
// //     const data = {
// //       email: formData.get('email') as string,
// //       password: formData.get('password') as string,
// //       username: formData.get('username') as string,
// //       role: role,
// //       genre: formData.get('genre') as string,
// //     }

// //     const result = await register(data)

// //     if (result.error) {
// //       setError(result.error)
// //       setLoading(false)
// //     } else {
// //       router.push('/login?registered=true')
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center px-4 py-12">
// //       <div className="max-w-sm w-full space-y-8">
// //         <div className="text-center">
// //                     <img src='/icon.png' className='w-auto mx-auto h-24'/>

// //           <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
// //           <p className="mt-2 text-sm text-gray-600">Créez votre compte</p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
// //           {error && (
// //             <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>
// //           )}

// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
// //               <input type="text" name="username" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// //               <input type="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
// //               <input type="password" name="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
// //               <select name="genre" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
// //                 <option value="M">Masculin</option>
// //                 <option value="F">Féminin</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-3">Rôle</label>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => setRole('parent')}
// //                   className={`p-3 rounded-lg border-2 transition-all ${
// //                     role === 'parent'
// //                       ? 'border-black bg-black text-white'
// //                       : 'border-gray-300 hover:border-gray-400'
// //                   }`}
// //                 >
// //                   <div className="text-sm font-medium">Parent</div>
// //                   <div className="text-xs mt-1 opacity-80">Je cherche un précepteur</div>
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setRole('precepteur')}
// //                   className={`p-3 rounded-lg border-2 transition-all ${
// //                     role === 'precepteur'
// //                       ? 'border-green-800 bg-green-800 text-white'
// //                       : 'border-gray-300 hover:border-gray-400'
// //                   }`}
// //                 >
// //                   <div className="text-sm font-medium">Précepteur</div>
// //                   <div className="text-xs mt-1 opacity-80">Je propose mes services</div>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
// //           >
// //             {loading ? 'Inscription...' : "S'inscrire"}
// //           </button>

// //           <p className="text-center text-sm text-gray-600">
// //             Déjà un compte ?{' '}
// //             <Link href="/login" className="text-black font-medium hover:underline">
// //               Se connecter
// //             </Link>
// //           </p>
// //         </form>
// //       </div>
// //     </div>
// //   )
// // }

// // app/register/page.tsx
// 'use client'

// import { useState } from 'react'
// import { register, resendVerificationEmail } from '@/actions/auth'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function RegisterPage() {
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [role, setRole] = useState('parent')
//   const [showVerificationInfo, setShowVerificationInfo] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')

//     const formData = new FormData(e.currentTarget)
//     const data = {
//       email: formData.get('email') as string,
//       password: formData.get('password') as string,
//       username: formData.get('username') as string,
//       role: role,
//       genre: formData.get('genre') as string,
//     }

//     const result = await register(data)

//     if (result.error) {
//       setError(result.error)
//       setLoading(false)
//     } else {
//       // Afficher le message de succès avec les infos de vérification
//       setSuccess(result.message || 'Compte créé avec succès !')
//       setShowVerificationInfo(true)
//       setLoading(false)
//       // Ne plus rediriger automatiquement vers login
//     }
//   }

//   const handleResendEmail = async () => {
//     setLoading(true)
//     setError('')
    
//     const result = await resendVerificationEmail()
    
//     if (result.error) {
//       setError(result.error)
//     } else {
//       setSuccess('Email de vérification renvoyé avec succès !')
//     }
    
//     setLoading(false)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-12">
//       <div className="max-w-sm w-full space-y-8">
//         <div className="text-center">
//           <img src='/icon.png' className='w-auto mx-auto h-24'/>
//           <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
//           <p className="mt-2 text-sm text-gray-600">Créez votre compte</p>
//         </div>

//         {showVerificationInfo ? (
//           // Afficher les infos de vérification après inscription réussie
//           <div className="bg-white rounded-lg shadow p-6 space-y-6">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
//                 <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Vérifiez votre email</h3>
//               <p className="text-sm text-gray-600">
//                 Un email de vérification a été envoyé à votre adresse email. 
//                 Veuillez cliquer sur le lien dans l'email pour activer votre compte.
//               </p>
//             </div>

//             {success && (
//               <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
//                 {success}
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
//                 {error}
//               </div>
//             )}

//             <div className="space-y-3">
//               <button
//                 onClick={handleResendEmail}
//                 disabled={loading}
//                 className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 {loading ? 'Envoi...' : "Renvoyer l'email de vérification"}
//               </button>

//               <button
//                 onClick={() => router.push('/login')}
//                 className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
//               >
//                 Aller à la connexion
//               </button>
//             </div>

//             <p className="text-xs text-center text-gray-500">
//               Si vous ne recevez pas l'email, vérifiez vos spams ou essayez de renvoyer l'email.
//             </p>
//           </div>
//         ) : (
//           // Formulaire d'inscription normal
//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             {error && (
//               <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
//                 <input 
//                   type="text" 
//                   name="username" 
//                   required 
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input 
//                   type="email" 
//                   name="email" 
//                   required 
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
//                 <input 
//                   type="password" 
//                   name="password" 
//                   required 
//                   minLength={6}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
//                 <select 
//                   name="genre" 
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                 >
//                   <option value="M">Masculin</option>
//                   <option value="F">Féminin</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Rôle</label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setRole('parent')}
//                     className={`p-3 rounded-lg border-2 transition-all ${
//                       role === 'parent'
//                         ? 'border-black bg-black text-white'
//                         : 'border-gray-300 hover:border-gray-400'
//                     }`}
//                   >
//                     <div className="text-sm font-medium">Parent</div>
//                     <div className="text-xs mt-1 opacity-80">Je cherche un précepteur</div>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setRole('precepteur')}
//                     className={`p-3 rounded-lg border-2 transition-all ${
//                       role === 'precepteur'
//                         ? 'border-green-800 bg-green-800 text-white'
//                         : 'border-gray-300 hover:border-gray-400'
//                     }`}
//                   >
//                     <div className="text-sm font-medium">Précepteur</div>
//                     <div className="text-xs mt-1 opacity-80">Je propose mes services</div>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
//             >
//               {loading ? 'Inscription...' : "S'inscrire"}
//             </button>

//             <p className="text-center text-sm text-gray-600">
//               Déjà un compte ?{' '}
//               <Link href="/login" className="text-black font-medium hover:underline">
//                 Se connecter
//               </Link>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   )
// }

// app/register/page.tsx
'use client'

import { useState } from 'react'
import { register, resendVerificationEmail } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('parent')
  const [showVerificationInfo, setShowVerificationInfo] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('') // ← Ajouter pour stocker l'email
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const emailValue = formData.get('email') as string
    
    const data = {
      email: emailValue,
      password: formData.get('password') as string,
      username: formData.get('username') as string,
      role: role,
      genre: formData.get('genre') as string,
    }

    const result = await register(data)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setRegisteredEmail(emailValue) // ← Stocker l'email
      setSuccess(result.message || 'Compte créé avec succès !')
      setShowVerificationInfo(true)
      setLoading(false)
    }
  }

  // ← Corriger : passer l'email en argument
  const handleResendEmail = async () => {
    if (!registeredEmail) {
      setError('Email non trouvé. Veuillez vous réinscrire.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    
    const result = await resendVerificationEmail(registeredEmail) // ← Passer l'email
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Email de vérification renvoyé avec succès !')
    }
    
    setLoading(false)
  }

  // ← Ajouter : Rediriger vers la page de vérification avec l'email
  const handleGoToVerification = () => {
    router.push(`/verify-email?email=${encodeURIComponent(registeredEmail)}`)
  }

  return (
    <div className="min-h-screen flex items-center bg-gray-50 justify-center px-4 py-12">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <img src='/icon.png' className='w-auto mx-auto h-24'/>
          <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
          <p className="mt-2 text-sm text-gray-600">Créez votre compte</p>
        </div>

        {showVerificationInfo ? (
          // Afficher les infos de vérification après inscription réussie
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Vérifiez votre email</h3>
              <p className="text-sm text-gray-600">
                Un email de vérification a été envoyé à <strong>{registeredEmail}</strong>.
                Cliquez sur le lien dans l'email ou utilisez le code fourni.
              </p>
            </div>

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* ← Nouveau : Bouton pour aller à la page de vérification par code */}
              <button
                onClick={handleGoToVerification}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Entrer le code de vérification
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <button
                onClick={handleResendEmail}
                disabled={loading}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {loading ? 'Envoi...' : "Renvoyer l'email"}
              </button>

              <button
                onClick={() => router.push('/login')}
                className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Aller à la connexion
              </button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Vérifiez aussi vos spams si vous ne trouvez pas l'email.
            </p>
          </div>
        ) : (
          // Formulaire d'inscription normal
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                <input 
                  type="text" 
                  name="username" 
                  required 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  minLength={6}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select 
                  name="genre" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rôle</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('parent')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      role === 'parent'
                        ? ' bg-indigo-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm font-medium">Parent</div>
                    <div className="text-xs mt-1 opacity-80">Je cherche un précepteur</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('precepteur')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      role === 'precepteur'
                        ? 'border-green-800 bg-green-800 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm font-medium">Précepteur</div>
                    <div className="text-xs mt-1 opacity-80">Je propose mes services</div>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-black font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}