import sharp from 'sharp';
import fetch from 'node-fetch';

/**
 * Converts single / multiple images to AVIF and minifies their size
 * @param {string[]} imageUrls - An array of image URLs.
 * @returns {Promise<string[]>} - A promise resolving to an array of converted AVIF images.
 */
export async function convertImageToAvif(imageUrls) {
    // Ensure we handle both single URL and array of URLs
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

    try {
        const imagePromises = urls.map(async (imageURL) => {
            try {
                const response = await fetch(imageURL);
                if (!response.ok) throw new Error(`Failed to fetch image: ${imageURL}`);

                const contentType = response.headers.get('content-type');
                const contentLength = parseInt(response.headers.get('content-length') || '0', 10);

                if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType || '')) {
                    throw new Error(`Unsupported content type: ${contentType}`);
                }

                if (contentLength > 5 * 1024 * 1024) {
                    throw new Error(`Image exceeds the 5MB size limit: ${imageURL}`);
                }

                // Convert the image to AVIF format
                const avifBuffer = await sharp(await response.arrayBuffer())
                    .toFormat('avif', { quality: 40 })
                    .toBuffer();
                
                return `data:image/avif;base64,${avifBuffer.toString('base64')}`;
            } catch (error) {
                console.error(`Error processing image ${imageURL}:`, error);
                return null;
            }
        });

        const results = await Promise.all(imagePromises);
        return Array.isArray(imageUrls) ? results : results[0]; // Return single result if input was a single URL
    } catch (error) {
        console.error('Error converting images in parallel:', error);
        throw new Error('Internal Server Error while converting images');
    }
}