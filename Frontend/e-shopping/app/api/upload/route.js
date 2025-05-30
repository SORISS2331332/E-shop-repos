import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: {
        sizeLimit: '2mb',
        },
    },
};

export async function POST(req) {
    try {
        const body = await req.json();
        const { image } = body;

        if (!image || !image.startsWith('data:image')) {
            return new Response(JSON.stringify({ error: 'Image invalide' }), {
                status: 400,
            });
        }

        const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return new Response(JSON.stringify({ error: 'Format d’image invalide' }), {
                status: 400,
            });
        }

        const ext = matches[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');

        const filename = `${uuidv4()}.${ext}`;
        const filePath = path.join(process.cwd(), 'public', 'images', filename);

        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);

        return new Response(JSON.stringify({ path: `/images/${filename}` }), {
            status: 200,
        });
    } catch (err) {
        console.error('Erreur serveur:', err);
            return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500,
        });
    }
}
