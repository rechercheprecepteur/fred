
// // app/page.tsx
// 'use client'

// import Link from 'next/link'
// import { useEffect, useState } from 'react'
// import { ArrowRight, Star, Users, Calendar, CheckCircle, GraduationCap, Shield, Sparkles } from 'lucide-react'

// export default function Home() {
//   const [scrolled, setScrolled] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50)
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation ultra minimal */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
//         <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <div className="w-12 h-12 flex items-center justify-center">
//              <img src='/icon.png'/>
//             </div>
//             <span className="font-semibold text-gray-900">Préc'App</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors px-3 py-2">
//               Connexion
//             </Link>
//             <Link
//               href="/register"
//               className="text-sm bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all"
//             >
//               Commencer
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero - plein écran */}
//       <section className="min--screen pt-28 flex items-center justify-center px-6 relative overflow-hidden">
//         {/* Background subtle gradient */}
//         <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-gray-white" />
        
//         <div className="max-w-5xl mx-auto text-center relative z-10">
//           <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 shadow-sm border border-gray-100">
//             <Sparkles className="w-3.5 h-3.5 text-gray-600" />
//             <span className="text-xs font-medium text-gray-600">Plateforme éducative</span>
//           </div>
          
//           <h1 className="text-6xl md:text-7xl  font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
//             L'accompagnement
//             <br />
//             scolaire <img className='inline h-12 w-32 object-cover rounded-full' src='/two.webp'/> qui
//             <br />
//             <span className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">fait la différence</span>
//           </h1>
          
//           <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
//             Connectez-vous avec les meilleurs précepteurs pour vos enfants de 7eme et 8eme Dans la ville de Lubumbashi. 
//             Une plateforme pensée pour l'excellence.
//           </p>
          
//           <Link
//             href="/register"
//             className="inline-flex cypher items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all hover:scale-[1.02] text-base font-medium shadow-lg shadow-black/10"
//           >
//             Commencer maintenant
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </section>

//       {/* Stats - épurées */}
//       <section className="py-20 ">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="grid grid-cols-3 cypher gap-12">
//             {[
//               { value: '500+', label: 'Précepteurs' },
//               { value: '2 000+', label: 'Élèves' },
//               { value: '10 000+', label: 'Sessions' },
//             ].map((stat, i) => (
//               <div key={i} className="text-center">
//                 <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
//                 <p className="text-sm text-gray-500">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//    <section className="relative py-12 overflow-hidden">
//   {/* Fond avec dégradé subtil */}
//   <div className="absolute inset-0 bg- -z-10" />
//   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/40 via-transparent to-transparent -z-10" />
  
//   <div className="max-w-6xl mx-auto px-6">
//     <div className="text-center mb-16">
//       <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium tracking-tight mb-4">
//         Tout-en-un
//       </span>
//       <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
//         Une solution complète
//       </h2>
//       <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
//         Que vous soyez parent ou précepteur, trouvez tout ce dont vous avez besoin
//       </p>
//     </div>

//     <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
//       {/* Parents */}
//       <div className="group relative bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200/60  hover:ring-indigo-200 transition-all duration-300">
//         <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-transparent opacity- group-hover:opacity-100 transition-opacity duration-300" />
//         <div className="relative">
//           <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200/50">
//             <Users className="w-6 h-6 text-white" />
//           </div>
//           <h3 className="text-xl font-semibold text-slate-900 mb-3">Pour les parents</h3>
//           <p className="text-slate-500 mb-6 leading-relaxed">
//             Trouvez le précepteur idéal pour votre enfant et suivez sa progression en toute transparence.
//           </p>
//           <ul className="space-y-3.5">
//             {['Recherche avancée par matière et niveau', 'Gestion des contrats et sessions', 'Suivi des progrès en temps réel'].map((item, i) => (
//               <li key={i} className="flex items-center gap-3.5 text-sm text-slate-600">
//                 <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
//                   <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
//                 </div>
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Précepteurs */}
//       <div className="group relative bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200/60  hover:ring-indigo-200 transition-all duration-300">
//         <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/50 to-transparent opacity- group-hover:opacity-100 transition-opacity duration-300" />
//         <div className="relative">
//           <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200/50">
//             <GraduationCap className="w-6 h-6 text-white" />
//           </div>
//           <h3 className="text-xl font-semibold text-slate-900 mb-3">Pour les précepteurs</h3>
//           <p className="text-slate-500 mb-6 leading-relaxed">
//             Développez votre activité et gérez vos élèves depuis une interface unique.
//           </p>
//           <ul className="space-y-3.5">
//             {(['Profil professionnel complet', 'Gestion des contrats et planning', 'Suivi des revenus et évaluations'] as const).map((item, i) => (
//               <li key={i} className="flex items-center gap-3.5 text-sm text-slate-600">
//                 <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
//                   <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
//                 </div>
//                 {item}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
//    <section className="relative py-8 overflow-hidden">
//   <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white -z-10" />
  
//   <div className="max-w-6xl mx-auto px-6">
//     <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
//       <div className="group text-center">
//         <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm ring-1 ring-amber-200/50 group-hover:shadow-md group-hover:shadow-amber-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
//           <Calendar className="w-6 h-6 text-amber-600" />
//         </div>
//         <h4 className="font-semibold text-slate-900 mb-2.5">Planification simplifiée</h4>
//         <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
//           Gérez vos disponibilités et planifiez les sessions en quelques clics
//         </p>
//       </div>
      
//       <div className="group text-center">
//         <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm ring-1 ring-blue-200/50 group-hover:shadow-md group-hover:shadow-blue-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
//           <Shield className="w-6 h-6 text-blue-600" />
//         </div>
//         <h4 className="font-semibold text-slate-900 mb-2.5">Profils vérifiés</h4>
//         <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
//           Tous les précepteurs sont vérifiés par notre équipe
//         </p>
//       </div>
      
//       <div className="group text-center">
//         <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm ring-1 ring-purple-200/50 group-hover:shadow-md group-hover:shadow-purple-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
//           <Star className="w-6 h-6 text-purple-600" />
//         </div>
//         <h4 className="font-semibold text-slate-900 mb-2.5">Système d'évaluation</h4>
//         <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
//           Notez et commentez chaque session pour améliorer la qualité
//         </p>
//       </div>
//     </div>
//   </div>
// </section>

// <section className="relative py-24 overflow-hidden">
//   <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 -z-10" />
  
//   <div className="max-w-5xl mx-auto px-6">
//     <div className="text-center mb-16">
//       <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium tracking-tight mb-4">
//         Créateur
//       </span>
//       <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
//         Développé par un passionné
//       </h2>
//     </div>

//     <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
//       {/* Colonne Photo */}
//       <div className="relative">
//         <div className="relative mx-auto max-w-xs">
//           <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-2xl opacity-20 -z-10" />
//           <div className="relative aspect-square rounded-3xl overflow-hidden ring-2 ring-slate-200 shadow-xl">
//             {/* Remplacer le div placeholder par ta photo */}
//           <img src="/profile.jpg" alt="Freddy" className="w-full h-full object-cover" />
//           </div>
//           {/* Badge décoratif */}
          
//         </div>
//       </div>

//       {/* Colonne Infos */}
//       <div className="text-center md:text-left">
       
        
//         <h3 className="text-3xl font-bold text-slate-900 mb-2">Freddy</h3>
//         <p className="text-indigo-600 font-medium mb-4">Développeur d'applications éducatives</p>
        
//         <p className="text-slate-600 leading-relaxed mb-6">
//           Étudiant finaliste, j'ai conçu cette application dans le cadre de mon travail de fin de cycle. 
//           Passionné par la création d'outils numériques qui transforment l'éducation, 
//           j'ai développé cette solution innovante pour connecter les apprenants avec les meilleurs précepteurs, 
//           en combinant design intuitif et technologies modernes. 
//           Mon objectif : rendre l'apprentissage accessible et efficace pour tous.
//         </p>

//         {/* Statistiques rapides */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div className="text-center p-3 bg-slate-50 rounded-xl">
//             <div className="text-lg font-bold text-slate-900">2+</div>
//             <div className="text-xs text-slate-500">Années d'exp.</div>
//           </div>
//           <div className="text-center p-3 bg-slate-50 rounded-xl">
//             <div className="text-lg font-bold text-slate-900">5+</div>
//             <div className="text-xs text-slate-500">Projets</div>
//           </div>
//           <div className="text-center p-3 bg-slate-50 rounded-xl">
//             <div className="text-lg font-bold text-slate-900">🎓</div>
//             <div className="text-xs text-slate-500">Finaliste</div>
//           </div>
//         </div>

//         {/* Boutons réseaux sociaux */}
//         <div className="flex flex-wrap gap-3 justify-center md:justify-start">
//           <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
//             GitHub
//           </a>
//           <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
//             LinkedIn
//           </a>
//           <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-slate-400 transition-all duration-300">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
//             Twitter
//           </a>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>

//       {/* CTA finale - minimal */}
//       <section className="py-24 border-t border-gray-100">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Prêt à commencer ?</h2>
//           <p className="text-gray-500 mb-8 max-w-md mx-auto">
//             Rejoignez la plateforme qui connecte parents et précepteurs
//           </p>
//           <div className="flex gap-4 justify-center">
//             <Link
//               href="/register"
//               className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
//             >
//               Créer un compte
//             </Link>
//             <Link
//               href="/login"
//               className="px-6 py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors text-sm font-medium text-gray-700"
//             >
//               Se connecter
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 border-t border-gray-100">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="flex justify-between items-center text-sm text-gray-400">
//             <span>© 2026 Préc'App</span>
//             <div className="flex gap-6">
//               <Link href="#" className="hover:text-gray-600 transition-colors">Mentions</Link>
//               <Link href="#" className="hover:text-gray-600 transition-colors">Confidentialité</Link>
//               <Link href="#" className="hover:text-gray-600 transition-colors">Contact</Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
// app/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Star, Users, Calendar, CheckCircle, GraduationCap, Shield, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { PiUser, PiSignOut } from 'react-icons/pi'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const { user, logoutUser, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
  }

  // Fonction helper pour obtenir le lien du dashboard selon le rôle
const getDashboardLink = (role: string) => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'precepteur':
      return '/dashboard/precepteur'
    case 'responsable_pedagogique':
      return '/dashboard/responsable'
    case 'parent':
    default:
      return '/dashboard/parent'
  }
}

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation ultra minimal */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center">
             <img src='/icon.png' alt="Préc'App logo"/>
            </div>
            <span className="font-semibold text-gray-900">Préc'App</span>
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              // Skeleton de chargement
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : user ? (
              // Utilisateur connecté
              <>
                <Link 
                  href={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/parent'}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity px-2 py-1 rounded-lg hover:bg-gray-50"
                >
                  {user.photo_profil ? (
                    <img 
                      src={user.photo_profil} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-medium text-white">
                      {user.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium leading-tight">{user.username}</span>
                    <span className="text-xs text-gray-500 capitalize leading-tight">{user.role.replace('_', ' ')}</span>
                  </div>
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <PiSignOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Déconnexion</span>
                </button>

                {/* Déconnexion mobile (icône uniquement) */}
                <button 
                  onClick={handleLogout} 
                  className="sm:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <PiSignOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              // Utilisateur non connecté
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors px-3 py-2">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero - plein écran */}
      <section className="min--screen pt-28 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-gray-white" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 shadow-sm border border-gray-100">
            <Sparkles className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-medium text-gray-600">Plateforme éducative</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl  font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            L'accompagnement
            <br />
            scolaire <img className='inline h-12 w-32 object-cover rounded-full' src='/two.webp'/> qui
            <br />
            <span className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">fait la différence</span>
          </h1>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connectez-vous avec les meilleurs précepteurs pour vos enfants de 7eme et 8eme Dans la ville de Lubumbashi. 
            Une plateforme pensée pour l'excellence.
          </p>
          
          {user ? (
          

               <Link
      href={getDashboardLink(user.role)}
              className="inline-flex cypher items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all hover:scale-[1.02] text-base font-medium shadow-lg shadow-black/10"
    >
   Accéder au tableau de bord
              <ArrowRight className="w-4 h-4" />
    </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex cypher items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all hover:scale-[1.02] text-base font-medium shadow-lg shadow-black/10"
            >
              Commencer maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Stats - épurées */}
      <section className="py-20 ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 cypher gap-12">
            {[
              { value: '500+', label: 'Précepteurs' },
              { value: '2 000+', label: 'Élèves' },
              { value: '10 000+', label: 'Sessions' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   <section className="relative py-12 overflow-hidden">
  {/* Fond avec dégradé subtil */}
  <div className="absolute inset-0 bg- -z-10" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/40 via-transparent to-transparent -z-10" />
  
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium tracking-tight mb-4">
        Tout-en-un
      </span>
      <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
        Une solution complète
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
        Que vous soyez parent ou précepteur, trouvez tout ce dont vous avez besoin
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
      {/* Parents */}
      <div className="group relative bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200/60  hover:ring-indigo-200 transition-all duration-300">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-transparent opacity- group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200/50">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Pour les parents</h3>
          <p className="text-slate-500 mb-6 leading-relaxed">
            Trouvez le précepteur idéal pour votre enfant et suivez sa progression en toute transparence.
          </p>
          <ul className="space-y-3.5">
            {['Recherche avancée par matière et niveau', 'Gestion des contrats et sessions', 'Suivi des progrès en temps réel'].map((item, i) => (
              <li key={i} className="flex items-center gap-3.5 text-sm text-slate-600">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Précepteurs */}
      <div className="group relative bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200/60  hover:ring-indigo-200 transition-all duration-300">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/50 to-transparent opacity- group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200/50">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Pour les précepteurs</h3>
          <p className="text-slate-500 mb-6 leading-relaxed">
            Développez votre activité et gérez vos élèves depuis une interface unique.
          </p>
          <ul className="space-y-3.5">
            {(['Profil professionnel complet', 'Gestion des contrats et planning', 'Suivi des revenus et évaluations'] as const).map((item, i) => (
              <li key={i} className="flex items-center gap-3.5 text-sm text-slate-600">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
   <section className="relative py-8 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white -z-10" />
  
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      <div className="group text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm ring-1 ring-amber-200/50 group-hover:shadow-md group-hover:shadow-amber-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
          <Calendar className="w-6 h-6 text-amber-600" />
        </div>
        <h4 className="font-semibold text-slate-900 mb-2.5">Planification simplifiée</h4>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          Gérez vos disponibilités et planifiez les sessions en quelques clics
        </p>
      </div>
      
      <div className="group text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm ring-1 ring-blue-200/50 group-hover:shadow-md group-hover:shadow-blue-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h4 className="font-semibold text-slate-900 mb-2.5">Profils vérifiés</h4>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          Tous les précepteurs sont vérifiés par notre équipe
        </p>
      </div>
      
      <div className="group text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm ring-1 ring-purple-200/50 group-hover:shadow-md group-hover:shadow-purple-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
          <Star className="w-6 h-6 text-purple-600" />
        </div>
        <h4 className="font-semibold text-slate-900 mb-2.5">Système d'évaluation</h4>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          Notez et commentez chaque session pour améliorer la qualité
        </p>
      </div>
    </div>
  </div>
</section>

<section className="relative py-24 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 -z-10" />
  
  <div className="max-w-5xl mx-auto px-6">
    <div className="text-center mb-16">
      <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium tracking-tight mb-4">
        Créateur
      </span>
      <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
        Développé par un passionné
      </h2>
    </div>

    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Colonne Photo */}
      <div className="relative">
        <div className="relative mx-auto max-w-xs">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-2xl opacity-20 -z-10" />
          <div className="relative aspect-square rounded-3xl overflow-hidden ring-2 ring-slate-200 shadow-xl">
            {/* Remplacer le div placeholder par ta photo */}
          <img src="/profile.jpg" alt="Freddy" className="w-full h-full object-cover" />
          </div>
          {/* Badge décoratif */}
          
        </div>
      </div>

      {/* Colonne Infos */}
      <div className="text-center md:text-left">
       
        
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Freddy</h3>
        <p className="text-indigo-600 font-medium mb-4">Développeur d'applications éducatives</p>
        
        <p className="text-slate-600 leading-relaxed mb-6">
          Étudiant finaliste, j'ai conçu cette application dans le cadre de mon travail de fin de cycle. 
          Passionné par la création d'outils numériques qui transforment l'éducation, 
          j'ai développé cette solution innovante pour connecter les apprenants avec les meilleurs précepteurs, 
          en combinant design intuitif et technologies modernes. 
          Mon objectif : rendre l'apprentissage accessible et efficace pour tous.
        </p>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <div className="text-lg font-bold text-slate-900">2+</div>
            <div className="text-xs text-slate-500">Années d'exp.</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <div className="text-lg font-bold text-slate-900">5+</div>
            <div className="text-xs text-slate-500">Projets</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <div className="text-lg font-bold text-slate-900">🎓</div>
            <div className="text-xs text-slate-500">Finaliste</div>
          </div>
        </div>

        {/* Boutons réseaux sociaux */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
          <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-slate-400 transition-all duration-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            Twitter
          </a>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* CTA finale - minimal */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prêt à commencer ?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Rejoignez la plateforme qui connecte parents et précepteurs
          </p>
          {user ? (
            <div className="flex gap-4 justify-center">
          <Link
      href={getDashboardLink(user.role)}
      className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
    >
      Tableau de bord
    </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors text-sm font-medium text-gray-700"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Créer un compte
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors text-sm font-medium text-gray-700"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>© 2026 Préc'App</span>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-600 transition-colors">Mentions</Link>
              <Link href="#" className="hover:text-gray-600 transition-colors">Confidentialité</Link>
              <Link href="#" className="hover:text-gray-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}