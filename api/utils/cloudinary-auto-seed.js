// /api/utils/cloudinary-auto-seed.js
// One-off seeding job: uploads every catalogue image to Cloudinary on a padded white 600x600 canvas.
// Protected: call with header  x-seed-secret: <SEED_SECRET env var>.
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { groceryCatalogManifest } from '../../utils/products-manifest.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (!process.env.SEED_SECRET || req.headers['x-seed-secret'] !== process.env.SEED_SECRET) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const syncLogs = [];
  for (const product of groceryCatalogManifest) {
    try {
      const result = await cloudinary.uploader.upload(
        path.join(process.cwd(), product.localAssetPath),
        {
          public_id: `ladydee_catalog/${product.id}`,
          overwrite: true,
          tags: ['white-background-grocery', product.category],
          transformation: [{ background: 'white', crop: 'pad', width: 600, height: 600 }]
        }
      );
      syncLogs.push({ id: product.id, status: 'SUCCESS', url: result.secure_url });
    } catch (err) {
      syncLogs.push({ id: product.id, status: 'FAILED', error: err.message });
    }
  }
  return res.status(200).json({ msg: 'Asset seeding completed.', logs: syncLogs });
}
