// app/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Star, Users, Calendar, CheckCircle, GraduationCap, Shield, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { PiSignOut } from 'react-icons/pi'

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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-2 md:py-3' : 'bg-transparent py-3 md:py-5'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
              <img src='/icon.png' alt="Préc'App logo" className="w-full h-full object-contain"/>
            </div>
            <span className="font-semibold text-gray-900 text-sm md:text-base">Préc'App</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {loading ? (
              // Skeleton de chargement
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-16 md:w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : user ? (
              // Utilisateur connecté
              <>
                <div
                  className="flex items-center gap-1.5 md:gap-2 hover:opacity-80 transition-opacity px-1.5 md:px-2 py-1 md:py-2 rounded-lg hover:bg-gray-50"
                >
                  {user.photo_profil ? (
                    <img 
                      src={user.photo_profil} 
                      alt="Profile" 
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-gray-100" 
                    />
                  ) : (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs md:text-sm font-medium text-white">
                      {user.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs md:text-sm font-medium leading-tight">{user.username}</span>
                    <span className="text-[10px] md:text-xs text-gray-500 capitalize leading-tight">{user.role.replace('_', ' ')}</span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout} 
                  className="hidden sm:flex items-center gap-1 md:gap-1.5 text-xs md:text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors"
                >
                  <PiSignOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden lg:inline">Déconnexion</span>
                </button>

                {/* Déconnexion mobile (icône uniquement) */}
                <button 
                  onClick={handleLogout} 
                  className="sm:hidden flex items-center gap-1 md:gap-1.5 text-xs md:text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 md:p-2 rounded-lg transition-colors"
                >
                  <PiSignOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </>
            ) : (
              // Utilisateur non connecté
              <>
                <Link href="/login" className="text-xs md:text-sm text-gray-600 hover:text-black transition-colors px-2 md:px-3 py-1.5 md:py-2">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="text-xs md:text-sm bg-black text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full hover:bg-gray-800 transition-all"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero - plein écran */}
      <section className="min-h-screen pt-20 md:pt-28 flex items-center justify-center px-4 md:px-6 relative overflow-hidden">
        {/* Background subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-gray-50" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 md:gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 md:px-4 py-1 md:py-1.5 mb-6 md:mb-8 shadow-sm border border-gray-100">
            <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-gray-600" />
            <span className="text-[10px] md:text-xs font-medium text-gray-600">Plateforme éducative</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-4 md:mb-6 leading-[1.1]">
            L'accompagnement
            <br />
            scolaire <img className='inline h-6 md:h-12 w-16 md:w-32 object-cover rounded-full align-middle' src='/two.webp' alt="students"/> qui
            <br />
            <span className="bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">fait la différence</span>
          </h1>
          
          <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed px-2">
            Connectez-vous avec les meilleurs précepteurs pour vos enfants de 7eme et 8eme Dans la ville de Lubumbashi. 
            Une plateforme pensée pour l'excellence.
          </p>
          
          {user ? (
            <Link
              href={getDashboardLink(user.role)}
              className="inline-flex items-center gap-1.5 md:gap-2 px-5 md:px-8 py-3 md:py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all hover:scale-[1.02] text-sm md:text-base font-medium shadow-lg shadow-black/10"
            >
              Accéder au tableau de bord
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 md:gap-2 px-5 md:px-8 py-3 md:py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all hover:scale-[1.02] text-sm md:text-base font-medium shadow-lg shadow-black/10"
            >
              Commencer maintenant
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Stats - épurées */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 gap-6 md:gap-12">
            {[
              { value: '500+', label: 'Précepteurs' },
              { value: '2 000+', label: 'Élèves' },
              { value: '10 000+', label: 'Sessions' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution complète */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/40 via-transparent to-transparent -z-10" />
        
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs md:text-sm font-medium tracking-tight mb-3 md:mb-4">
              Tout-en-un
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">
              Une solution complète
            </h2>
            <p className="text-sm md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed px-2">
              Que vous soyez parent ou précepteur, trouvez tout ce dont vous avez besoin
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {/* Parents */}
            <div className="group relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm ring-1 ring-slate-200/60 hover:ring-indigo-200 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-indigo-200/50">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 md:mb-3">Pour les parents</h3>
                <p className="text-sm md:text-base text-slate-500 mb-4 md:mb-6 leading-relaxed">
                  Trouvez le précepteur idéal pour votre enfant et suivez sa progression en toute transparence.
                </p>
                <ul className="space-y-2.5 md:space-y-3.5">
                  {['Recherche avancée par matière et niveau', 'Gestion des contrats et sessions', 'Suivi des progrès en temps réel'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 md:gap-3.5 text-xs md:text-sm text-slate-600">
                      <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                        <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5 text-indigo-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Précepteurs */}
            <div className="group relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm ring-1 ring-slate-200/60 hover:ring-indigo-200 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-emerald-200/50">
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 md:mb-3">Pour les précepteurs</h3>
                <p className="text-sm md:text-base text-slate-500 mb-4 md:mb-6 leading-relaxed">
                  Développez votre activité et gérez vos élèves depuis une interface unique.
                </p>
                <ul className="space-y-2.5 md:space-y-3.5">
                  {(['Profil professionnel complet', 'Gestion des contrats et planning', 'Suivi des revenus et évaluations'] as const).map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 md:gap-3.5 text-xs md:text-sm text-slate-600">
                      <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-600" />
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

      {/* Features */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white -z-10" />
        
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-8 lg:gap-12">
            <div className="group text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-sm ring-1 ring-amber-200/50 group-hover:shadow-md group-hover:shadow-amber-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2 md:mb-2.5 text-sm md:text-base">Planification simplifiée</h4>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                Gérez vos disponibilités et planifiez les sessions en quelques clics
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-sm ring-1 ring-blue-200/50 group-hover:shadow-md group-hover:shadow-blue-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2 md:mb-2.5 text-sm md:text-base">Profils vérifiés</h4>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                Tous les précepteurs sont vérifiés par notre équipe
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-sm ring-1 ring-purple-200/50 group-hover:shadow-md group-hover:shadow-purple-100/50 group-hover:-translate-y-0.5 transition-all duration-300">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2 md:mb-2.5 text-sm md:text-base">Système d'évaluation</h4>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                Notez et commentez chaque session pour améliorer la qualité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA finale - minimal */}
      <section className="py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Prêt à commencer ?</h2>
          <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 max-w-md mx-auto">
            Rejoignez la plateforme qui connecte parents et précepteurs
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link
                href={getDashboardLink(user.role)}
                className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-xs md:text-sm font-medium text-center"
              >
                Tableau de bord
              </Link>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors text-xs md:text-sm font-medium text-gray-700"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link
                href="/register"
                className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-xs md:text-sm font-medium text-center"
              >
                Créer un compte
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors text-xs md:text-sm font-medium text-gray-700 text-center"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-400">
            <span>© 2026 Préc'App</span>
            <div className="flex gap-4 md:gap-6">
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