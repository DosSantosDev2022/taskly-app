
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'


export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const { pathname } = request.nextUrl

  // Se o usuário está tentando acessar uma rota protegida e não está autenticado:
  if (
    !token &&
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/projects') ||
      pathname.startsWith('/clients') ||
      pathname.startsWith('/config'))
  ) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }
  
   // Se o usuário já está logado e tenta acessar login ou register
   if (
    token &&
    (pathname.startsWith('/signIn') || pathname.startsWith('/register'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Configura o matcher para rotas protegidas (todas as que estão dentro de /authenticated)
export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/clients/:path*', '/config/:path*'],
}
