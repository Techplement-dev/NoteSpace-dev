import { NextResponse } from 'next/server';

export function middleware(request) {
    const response = NextResponse.next();

    // Check for the user ID cookie
    const userId = request.cookies.get('notespace_user_id');

    // If it doesn't exist, create one
    if (!userId) {
        const newUserId = crypto.randomUUID();
        response.cookies.set('notespace_user_id', newUserId, {
            httpOnly: true, // Not accessible via JavaScript (more secure)
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
