import { v2 as cloudinary } from 'cloudinary';

export const config = {
    api: {
        bodyParser: {
        sizeLimit: '2mb',
        },
    },
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

        const base64Data = `data:image/${matches[1]};base64,${matches[2]}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Data, {
        folder: 'Eshop_images', 
        });

        console.log('Upload response:', uploadResponse);

        return new Response(
        JSON.stringify({
            path: uploadResponse.secure_url, 
        }),
        { status: 200 }
        );
    } catch (err) {
        console.error('Erreur Cloudinary:', err);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
        status: 500,
        });
    }
}
