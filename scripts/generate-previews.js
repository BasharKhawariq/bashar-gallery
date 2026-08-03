'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ORIGINALS_DIR = path.join(process.cwd(), 'public', 'events', 'originals');
const PREVIEWS_DIR = path.join(process.cwd(), 'public', 'events', 'previews');

const MAX_WIDTH = Number(
  process.env.IMAGEKIT_PREVIEW_MAX_WIDTH ?? process.env.PREVIEW_MAX_WIDTH ?? 1600
);
const QUALITY = Number(
  process.env.IMAGEKIT_PREVIEW_QUALITY ?? process.env.PREVIEW_WEBP_QUALITY ?? 72
);

const WATERMARK_ASSET = path.join(
  process.cwd(),
  'public',
  'assets',
  'img',
  'bashar-logo-trimmed.png'
);

const FORCE = process.argv.includes('--force');

const SUPPORTED_INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function createWatermarkBuffer(targetWidth) {
  if (!fs.existsSync(WATERMARK_ASSET)) {
    return null;
  }

  const width = Math.max(360, Number(targetWidth) || MAX_WIDTH);
  const scaledWidth = Math.round(width * 0.62);

  return sharp(WATERMARK_ASSET)
    .trim()
    .resize({
      width: scaledWidth,
      withoutEnlargement: true,
    })
    .ensureAlpha(0.22)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function isSupportedImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_INPUT_EXTENSIONS.has(ext);
}

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function isOutputUpToDate(inputPath, outputPath) {
  if (!(await fileExists(outputPath))) return false;

  const [inputStat, outputStat] = await Promise.all([
    fs.promises.stat(inputPath),
    fs.promises.stat(outputPath),
  ]);

  return outputStat.mtimeMs >= inputStat.mtimeMs;
}

async function generatePreviews() {
  if (!fs.existsSync(ORIGINALS_DIR)) {
    console.error(`❌ Originals folder not found: ${ORIGINALS_DIR}`);
    console.error('Create it first: public/events/originals/<event-slug>/...');
    process.exitCode = 1;
    return;
  }

  await ensureDir(PREVIEWS_DIR);

  const eventDirs = await fs.promises.readdir(ORIGINALS_DIR, { withFileTypes: true });
  const events = eventDirs
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b));

  let generatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const event of events) {
    const eventOriginalPath = path.join(ORIGINALS_DIR, event);
    const eventPreviewPath = path.join(PREVIEWS_DIR, event);

    await ensureDir(eventPreviewPath);

    const dirents = await fs.promises.readdir(eventOriginalPath, { withFileTypes: true });
    const files = dirents
      .filter((dirent) => dirent.isFile() && isSupportedImageFile(dirent.name))
      .map((dirent) => dirent.name)
      .sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      const inputPath = path.join(eventOriginalPath, file);
      const filename = path.parse(file).name;
      const outputPath = path.join(eventPreviewPath, `${filename}.webp`);

      try {
        if (!FORCE && (await isOutputUpToDate(inputPath, outputPath))) {
          skippedCount += 1;
          continue;
        }

        console.log(`Generating: ${event}/${file}`);

        const image = sharp(inputPath).rotate();
        const metadata = await image.metadata();
        const outputWidth = Math.min(metadata.width ?? MAX_WIDTH, MAX_WIDTH);
        const watermark = await createWatermarkBuffer(outputWidth);

        await image
          .resize({
            width: MAX_WIDTH,
            withoutEnlargement: true,
          })
          .composite(
            watermark
              ? [
                  {
                    input: watermark,
                    gravity: 'south',
                  },
                ]
              : []
          )
          .webp({
            quality: QUALITY,
            effort: 4,
          })
          .toFile(outputPath);

        generatedCount += 1;
      } catch (error) {
        failedCount += 1;
        console.error(`❌ Failed: ${event}/${file}`);
        console.error(error);
      }
    }
  }

  console.log('\n✅ Preview generation complete.');
  console.log(`Generated: ${generatedCount}`);
  console.log(`Skipped:   ${skippedCount}${FORCE ? ' (force enabled)' : ''}`);
  console.log(`Failed:    ${failedCount}`);

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

generatePreviews();
