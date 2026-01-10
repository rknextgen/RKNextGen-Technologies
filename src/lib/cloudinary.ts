import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload a file to Cloudinary
 * @param fileBuffer - File buffer to upload
 * @param folder - Cloudinary folder name (e.g., 'general', 'projects')
 * @param filename - Original filename
 * @returns Cloudinary upload result with secure_url
 */
export async function uploadToCloudinary(
    fileBuffer: Buffer,
    folder: string = 'general',
    filename: string
) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `rknextgen/${folder}`,
                public_id: filename.split('.')[0], // Use filename without extension
                resource_type: 'auto',
                overwrite: true,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
}

/**
 * Delete a file from Cloudinary
 * @param publicId - Cloudinary public_id (extracted from URL)
 */
export async function deleteFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
}

/**
 * Extract public_id from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns public_id
 */
export function extractPublicId(url: string): string {
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/rknextgen/general/image.jpg
    // Extract: rknextgen/general/image
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return '';

    // Get everything after 'upload/vXXXXXXXXXX/' or 'upload/'
    const pathParts = parts.slice(uploadIndex + 1);
    // Remove version if present (starts with 'v' followed by numbers)
    const startIndex = pathParts[0].match(/^v\d+$/) ? 1 : 0;

    // Join remaining parts and remove file extension
    const publicIdWithExt = pathParts.slice(startIndex).join('/');
    return publicIdWithExt.replace(/\.[^/.]+$/, '');
}
