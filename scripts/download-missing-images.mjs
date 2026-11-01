/**
 * Downloads missing hardware product images into public/images/hardware/
 * Run: node scripts/download-missing-images.mjs
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'hardware')

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

// Each entry: [id, primaryUrl, fallbackUrl?, ext]
// We try primary first; if it fails try fallback
const IMAGES = [
  // 2 → PlayStation 5 Digital Edition
  [2, 'https://media.direct.playstation.com/is/image/sierialto/2025-PS5-Digital-Hero-2-forward-facing', null, 'jpg'],

  // 7 → Sony DualSense Edge controller
  [7, 'https://media.direct.playstation.com/is/image/sierialto/dualsense-edge-ps5-controller-front', null, 'jpg'],

  // 12 → GameSir T4 Kaleid controller
  [12, 'https://gamesir.com/cdn/shop/articles/f47c2bf4fed2c3bc2d4085ac53afad7a.jpg?v=1685703482&width=1500',
       'https://m.media-amazon.com/images/I/61G5JqvFcLL._AC_SL1500_.jpg', 'jpg'],

  // 17 → Logitech G Pro X 2 Lightspeed headset
  [17, 'https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-2-lightspeed/gallery/gallery-1-pro-x-2-lightspeed-gaming-headset-black.png',
       null, 'png'],

  // 18 → Custom Build (RTX 4070 Ti GPU card image)
  // NVIDIA RTX 4070 Ti — trying known aem-dam pattern
  [18, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4070-ti/geforce-rtx-4070-ti-product-gallery-thumbnail-267-1.jpg',
       'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-geforce-rtx-4070-ti-product-gallery-1.jpg', 'jpg'],

  // 20 → Custom Build (RTX 4060 Ti GPU card image)
  [20, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4060-ti/geforce-rtx-4060-ti-product-gallery-thumbnail-267-1.jpg',
       'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-geforce-rtx-4060-ti-product-gallery-1.jpg', 'jpg'],

  // 21 → Custom Build (AMD RX 7700 XT GPU card image) - use PowerColor Fighter or ASRock Challenger card photo
  [21, 'https://www.powercolor.com/upload/1693380386.png',
       'https://m.media-amazon.com/images/I/71ItDfK3z2L._AC_SL1500_.jpg', 'jpg'],

  // 22 → Custom Build PC - RTX 4080 Super (same as 24)
  [22, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4080-super/geforce-rtx-4080-super-product-gallery-thumbnail-267-1.jpg',
       'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-geforce-rtx-4080-super-product-gallery-1.jpg', 'jpg'],

  // 24 → NVIDIA RTX 4080 Super GPU (same URL as 22)
  [24, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4080-super/geforce-rtx-4080-super-product-gallery-thumbnail-267-1.jpg',
       'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-geforce-rtx-4080-super-product-gallery-1.jpg', 'jpg'],

  // 25 → AMD Radeon RX 7900 XTX GPU
  [25, 'https://www.sapphiretech.com/productspec/images/21302-04-20G_R_1.jpg',
       'https://m.media-amazon.com/images/I/81sDGqpTd1L._AC_SL1500_.jpg', 'jpg'],

  // 26 → Intel Core i9-14900K processor
  [26, 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2022-11/processors-core-i9-14900k-badge.png',
       'https://m.media-amazon.com/images/I/519GGXH9fJL._AC_SL1500_.jpg', 'jpg'],

  // 27 → AMD Ryzen 9 7950X processor
  [27, 'https://www.amd.com/system/files/2022-08/673756-ryzen-9-7950x-PIB-350x350.png',
       'https://m.media-amazon.com/images/I/51k7J1RpOuL._AC_SL1500_.jpg', 'jpg'],

  // 34 → MSI MAG 274QRF-QD E2 monitor
  [34, 'https://storage-asset.msi.com/global/picture/image/feature/monitor/MAG-274QRF-QD-E2/kv.jpg',
       'https://m.media-amazon.com/images/I/71ikevVBNpL._AC_SL1500_.jpg', 'jpg'],

  // 38 → Logitech G Pro X TKL keyboard
  [38, 'https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-tkl/gallery-2-pro-x-tkl-black-lightspeed-gaming-keyboard.png.png',
       null, 'png'],

  // 39 → Keychron Q3 Max keyboard
  [39, 'https://www.keychron.com/cdn/shop/files/Keychron-Q3-Max-QMK-Wireless-Mechanical-Keyboard-carbon-black.jpg',
       'https://m.media-amazon.com/images/I/71XoZLRChkL._AC_SL1500_.jpg', 'jpg'],

  // 44 → Secretlab Titan Evo 2024 chair
  [44, 'https://images.secretlab.co/category/titan-evo/TITAN-Evo-Stealth_xl.jpg',
       'https://m.media-amazon.com/images/I/71ZuN-bLU0L._AC_SL1500_.jpg', 'jpg'],

  // 46 → noblechairs EPIC Black Edition chair
  [46, 'https://img.noblechairs.com/images/GAGC-165/c02e5c1e450280b71c364e38e225eb5c.jpg',
       null, 'jpg'],
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const proto = url.startsWith('https') ? https : http
    const req = proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*',
        'Referer': 'https://google.com/',
      },
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        file.close()
        try { fs.unlinkSync(dest) } catch {}
        const loc = res.headers.location
        if (!loc) return reject(new Error('redirect with no location'))
        const absLoc = loc.startsWith('http') ? loc : new URL(loc, url).href
        return download(absLoc, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        try { fs.unlinkSync(dest) } catch {}
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => {
        file.close(() => {
          // Verify file is not empty and is actual image (not HTML error page)
          const size = fs.statSync(dest).size
          if (size < 1000) {
            fs.unlinkSync(dest)
            reject(new Error(`file too small (${size} bytes) - likely not an image`))
          } else {
            resolve()
          }
        })
      })
    })
    req.on('error', err => { try { fs.unlink(dest, () => {}) } catch {}; reject(err) })
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

const results = []

for (const [id, url, fallback, ext] of IMAGES) {
  const filename = `${id}.${ext}`
  const dest = path.join(OUT_DIR, filename)
  const localPath = `/images/hardware/${filename}`
  process.stdout.write(`[${String(id).padStart(2)}] Trying primary... `)

  let ok = false

  try {
    await download(url, dest)
    const size = Math.round(fs.statSync(dest).size / 1024)
    console.log(`✓ ${filename} (${size} KB)`)
    ok = true
  } catch (err) {
    console.log(`✗ primary FAILED — ${err.message}`)

    if (fallback) {
      process.stdout.write(`     Trying fallback... `)
      try {
        await download(fallback, dest)
        const size = Math.round(fs.statSync(dest).size / 1024)
        console.log(`✓ ${filename} (${size} KB) [fallback]`)
        ok = true
      } catch (err2) {
        console.log(`✗ fallback FAILED — ${err2.message}`)
      }
    }
  }

  results.push({ id, localPath: ok ? localPath : null, ok })
}

console.log('\n── Summary ──────────────────────────────')
const succeeded = results.filter(r => r.ok)
const failed = results.filter(r => !r.ok)
console.log(`Downloaded: ${succeeded.length}  Failed: ${failed.length}`)
if (failed.length) console.log('Failed IDs:', failed.map(r => r.id).join(', '))
console.log('\nPaste into hardware.js image fields:')
succeeded.forEach(r => console.log(`  id ${r.id}: '${r.localPath}'`))
