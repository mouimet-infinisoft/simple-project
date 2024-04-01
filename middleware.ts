import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from './utils/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (
    (error || !data?.user) &&
    request.nextUrl.pathname.startsWith('/protected')
  ) {
    return Response.redirect(new URL('/signin/password_signin', request.url));
  }

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user?.id ?? '')
    .single();

  if (
    userDetails &&
    userDetails?.is_onboarding_complete !== true &&
    !request.nextUrl.pathname.startsWith('/protected/onboarding')
  ) {
    return Response.redirect(new URL('/protected/onboarding', request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
