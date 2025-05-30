import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const data = await req.json();

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        const { width, height } = page.getSize();

        const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.jpg');
        const logoBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedJpg(logoBytes);
        const logoDims = logoImage.scale(0.15); 

        // Position du logo
        let y = height - logoDims.height - 40;
        const margin = 50;

        const helveticaFont = pdfDoc.embedStandardFont('Helvetica');

        page.drawImage(logoImage, {
            x: (width - logoDims.width) / 2, 
            y: y,
            width: logoDims.width,
            height: logoDims.height,
        });

        //Titre centré
        const title = 'REÇU DE PAIEMENT';
            page.drawText(title, {
            x: (width - helveticaFont.widthOfTextAtSize(title, 24)) / 2, 
            y: y - 40,
            size: 24,
            font: helveticaFont,
            color: rgb(0, 0, 1),
        });

        y -= 80;

        // Fonction pour dessiner du texte avec des options de style
        const drawText = (text, x, options = {}) => {
            page.drawText(text, {
                x,
                y,
                size: options.size || 12,
                font: options.font || helveticaFont,
                color: options.color || rgb(0, 0, 0),
            });
            y -= (options.size || 12) + 12; // Augmenter l'espacement après chaque ligne
        };

        // Fonction pour dessiner une ligne de séparation
        const drawLine = () => {
            y -= 5;
            page.drawLine({
                start: { x: margin, y },
                end: { x: width - margin, y },
                thickness: 1,
                color: rgb(0.8, 0.8, 0.8),
            });
            y -= 10; 
        };

        //Informations de la commande
        drawText(`Client : ${data.user?.nom + ' ' + data.user?.prenom }`, margin, { size: 14, color: rgb(0.1, 0.1, 0.1) });
        drawText(`Date : ${new Date(data.commande?.date || Date.now()).toLocaleDateString('fr-FR')}`, margin, { size: 14 });
        drawText(`Adresse : ${data.commande?.adresseLivraison || 'Non fournie'}`, margin, { size: 14 });
        drawText(`N° de Commande: ${Date.now()}`, margin, { size: 14 });
        drawText(`Montant total : ${data.commande?.montant?.toFixed(2) || '0.00'} $CAD`, margin, { size: 14 });
        
        y -= 20;
        

        //Tableau des articles
        drawText('Informations sur les articles achetés:', margin, { size: 13, color: rgb(0.2, 0.5, 0.2) }); 

        y -= 5; 
        drawLine();
        y -= 15; 
        const colWidth = width - 2 * margin; 
        const halfColWidth = colWidth / 2;
        const thirdColWidth = colWidth / 3;

        page.drawText('Article', {
            x: margin + 10,
            y,
            size: 14,
            font: helveticaFont,
            color: rgb(0, 0, 1), 
        });
        page.drawText('Qté', {
            x: margin + halfColWidth - 20,
            y,
            size: 14,
            font: helveticaFont,
            color: rgb(0, 0, 1),
        });
        page.drawText('Total', {
            x: margin + colWidth - thirdColWidth,
            y,
            size: 14,
            font: helveticaFont,
            color: rgb(0, 0, 1),
        });

        y -= 15; 
        drawLine();

        y -= 20;

        data.articles.forEach((item) => {
            page.drawText(`${item.nom}`, {
                x: margin + 10,
                y,
                size: 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });

            page.drawText(`x${item.quantite}`, {
                x: margin + halfColWidth - 20,
                y,
                size: 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });

            page.drawText(`${item.total.toFixed(2)} $CAD`, {
                x: margin + colWidth - thirdColWidth,
                y,
                size: 12,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });

            y -= 15; 
            drawLine();
            y -= 15;
        });

        

        y -= 60;


        const merci = 'Merci pour votre commande !';
        page.drawText(merci, {
        x: (width - helveticaFont.widthOfTextAtSize(merci, 14)) / 2,
        y,
        size: 14,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3), 
        });

        // Générer le PDF
        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="recu-paiement.pdf"',
        },
        });
    } catch (err) {
        console.error('Erreur génération PDF :', err);
            return new NextResponse(
            JSON.stringify({ error: 'Erreur serveur PDF' }),
            { status: 500 }
            );
    }
}
