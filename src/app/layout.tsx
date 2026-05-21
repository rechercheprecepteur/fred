// // app/layout.tsx

// import { AuthProvider } from '@/context/AuthContext'
// import Navbar from '@/components/Navbar'

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fr">
//       <body className="bg-gray-50">
//         <AuthProvider>
//           <Navbar />
//           <main className="min-h-screen">
//             {children}
//           </main>
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }

// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import './globals.css'
// Liste des routes publiques (accessibles sans connexion)
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier si l'utilisateur est connecté
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const isAuthenticated = !!token

  // Récupérer le pathname depuis les headers (façon simple)
  // Note: Dans App Router, on peut utiliser headers() pour avoir le pathname
  // mais c'est plus simple de gérer ça dans le middleware ou un composant client
  
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}