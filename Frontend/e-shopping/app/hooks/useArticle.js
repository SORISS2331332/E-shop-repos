export const addArticle = async (formData, images, user) => {
    const articleRes = await fetch('https://eshop-api-web.up.railway.app/api/Articles', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
    });

    const newArticle = await articleRes.json();

    // Uploader les images associées à cet article
    await Promise.all(
        images.map(img =>
        fetch('https://eshop-api-web.up.railway.app/api/Images', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            articleId: newArticle.id,
            lien: img.url 
            }),
        })
        )
    );

    return newArticle;
};

export async function updateArticle(articleId, updatedData, images, user) {
    // 1. Mettre à jour l'article
    const res = await fetch(`https://eshop-api-web.up.railway.app/api/Articles/${articleId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Échec de la mise à jour de l'article: ${res.status} - ${msg}`);
    }

    // 2. Récupérer les anciennes images
    const oldImagesRes = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${articleId}`);
    const oldImages = await oldImagesRes.json();
    const oldUrls = oldImages.map(img => img.lien);
    const newUrls = images.map(img => img.url);

    // 3. Supprimer uniquement les anciennes images qui ne sont plus présentes
    for (const img of oldImages) {
        if (!newUrls.includes(img.lien)) {
            await fetch(`https://eshop-api-web.up.railway.app/api/Images/${img.id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json'
                },
            });
        }
    }

    // 4. Ajouter uniquement les nouvelles images
    for (const img of images) {
        if (img.url && !oldUrls.includes(img.url)) {
            try {
                const response = await fetch(`https://eshop-api-web.up.railway.app/api/Images`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        articleId: articleId,
                        lien: img.url,
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erreur lors de l’ajout de l’image');
                }
            } catch (error) {
                console.error('Erreur fetch image:', error);
            }

        }
    }

    return true; 
}



