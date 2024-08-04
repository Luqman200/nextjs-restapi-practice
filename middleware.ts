import { NextResponse } from 'next/server';
import { authMiddleware } from './middlewares/api/authMiddleware';
import { logMiddleware } from './middlewares/api/logmiddleware';

export const config = {
    matcher: "/api/:path*"
};

// && request.url.includes("/api/blogs")

export default function middleware(request: Request) {
    if (request.url.includes("/api/blogs")) {
        const logResult = logMiddleware(request);
        console.log(logResult)
    }
    const authResult = authMiddleware(request)
    if (!authResult?.isValid) {
        return new NextResponse(JSON.stringify({ message: "Unauthorize" }),
            {
                status: 404
            })
    }
    return NextResponse.next()
}