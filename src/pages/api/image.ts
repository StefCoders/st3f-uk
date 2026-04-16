import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function get(context) {
    const url = new URL(context.request.url);
    const p = url.searchParams.get('path'); // e.g., /images/photography/jador/1.jpg
    const w = parseInt(url.searchParams.get('w') || '0', 10);
    const q = parseInt(url.searchParams.get('q') || '80', 10);

    if (!p) {
        return new Response('Missing path', { status: 400 });
    }

    const publicDir = path.resolve('./public');
    // Normalize path to prevent directory traversal and handle leading slashes
    const requested = path.join(publicDir, path.normalize(p).replace(/^(\.\.(\/|\\|$))+/, ''));

    // Security check: ensure the path is still inside the public directory
    if (!requested.startsWith(publicDir)) {
        return new Response('Forbidden', { status: 403 });
    }

    if (!fs.existsSync(requested)) {
        return new Response('Not found', { status: 404 });
    }

    try {
        const transformer = sharp(requested).rotate();
        
        if (w && w > 0) {
            transformer.resize({ width: w, fit: 'cover' });
        }
        
        const buffer = await transformer.jpeg({ quality: q }).toBuffer();

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (err) {
        return new Response('Error processing image', { status: 500 });
    }
}