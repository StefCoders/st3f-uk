import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.resolve('public/images/photography');
const outDir = path.resolve('public/_generated/photography');
const sizes = [480, 800, 1200, 1600];

// Recursive function to get all files in subdirectories
function getFiles(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
}

async function gen() {
    const files = getFiles(srcDir).filter(f => /\.(svg|jpg|jpeg|png|webp)$/i.test(f));

    for (const src of files) {
        // Calculate relative path to maintain folder structure
        const relativePath = path.relative(srcDir, src);
        const pathParts = path.parse(relativePath);
        
        // Create the specific subdirectory in the output folder
        const targetSubDir = path.join(outDir, pathParts.dir);
        if (!fs.existsSync(targetSubDir)) {
            fs.mkdirSync(targetSubDir, { recursive: true });
        }

        for (const w of sizes) {
            const outName = `${pathParts.name}-w${w}.jpg`;
            const outPath = path.join(targetSubDir, outName);
            
            await sharp(src)
                .resize({ width: w })
                .jpeg({ quality: 80 })
                .toFile(outPath);
            
            console.log('Processed:', path.join(pathParts.dir, outName));
        }
    }
}

gen().catch(err => { console.error(err); process.exit(1); });