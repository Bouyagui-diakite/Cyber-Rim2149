/**
 * Downloads all hardware product images into public/images/hardware/
 * and prints the updated image field mapping.
 *
 * Run: node scripts/download-images.mjs
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'hardware')

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

// ── image map: id → [url, ext] ────────────────────────────────────────────────
const IMAGES = [
  [1,  'https://media.direct.playstation.com/is/image/sierialto/2025-PS5-Disc-Hero1', 'jpg'],
  [2,  'https://media.direct.playstation.com/is/image/sierialto/2025-PS5-Digital-Hero1', 'jpg'],
  [3,  'https://cms-assets.xboxservices.com/assets/bc/40/bc40fdf3-85a6-4c36-af92-dca2d36fc7e5.png?n=642227_Hero-Gallery-0_A1_857x676.png', 'png'],
  [4,  'https://cms-assets.xboxservices.com/assets/bf/b0/bfb06f23-4c87-4c58-b4d9-ed25d3a739b9.png?n=389964_Hero-Gallery-0_A1_857x676.png', 'png'],
  [5,  'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.5/ncom/en_US/products/hardware/nintendo-switch-oled-model-white-set/115461-switch-oled-white-console-front-1200x675', 'jpg'],
  [6,  'https://cdn.fastly.steamstatic.com/steamdeck/images/press/renderings/press_oled_front_english.png', 'png'],
  [7,  'https://blog.playstation.com/tachyon/2023/01/2bc04c3f8d548a11ef6b82562ffd8cebfdd32219-scaled.jpg', 'jpg'],
  [8,  'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-controller-product-thumbnail-01-en-14sep21', 'jpg'],
  [9,  'https://cms-assets.xboxservices.com/assets/8e/8d/8e8d68b4-4724-415e-98fc-3c8a854b142a.jpg?n=XEWC-Series-2_Page-Hero-1084_XDL_1920x720.jpg', 'jpg'],
  [10, 'https://cms-assets.xboxservices.com/assets/62/96/62965c6a-429c-47b1-b901-ff69a6081d43.jpg?n=Xbox-Wireless-Controller_Image-Hero-768_Black_1920x831_03.jpg', 'jpg'],
  [11, 'https://assets2.razerzone.com/images/pnx.assets/38ff076da8677948e7a187dfdb82cb58/razer-wolverine-v2-pro-hyperspeed-wireless-desktop.webp', 'webp'],
  [13, 'https://images.ctfassets.net/hmm5mo4qf4mf/5P9QINCX7gLbOndO6rFnqM/d9bc201a35f067c1a442d7d7397e5c48/arctis_nova_pro_wl_black_xbox_img_buy_1.png__1920x1080_crop-fit_optimize_subsampling-2-233.png?fm=webp&q=90&fit=scale&w=1920', 'webp'],
  [14, 'https://gmedia.playstation.com/is/image/SIEPDC/pulse-3d-wireless-headset-video-hero-ps5-03-en-17jul20', 'jpg'],
  [15, 'https://row.hyperx.com/cdn/shop/files/hyperx_cloud_alpha_s_blackblue_1_main.jpg?v=1773251678', 'jpg'],
  [16, 'https://assets2.razerzone.com/images/pnx.assets/16eac26cd230ce343f56af70ec49626a/razer-blackshark-v2-pro-black-2023-500x500.webp', 'webp'],
  [19, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4090/geforce-rtx-4090-product-gallery-thumbnail-267-1.jpg', 'jpg'],
  [23, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4090/geforce-rtx-4090-product-gallery-thumbnail-267-1.jpg', 'jpg'],
  [28, 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-2UP-16GB-BLACK_01.webp', 'webp'],
  [29, 'https://images.samsung.com/is/image/samsung/p6pim/us/mz-v9p1t0b-am/gallery/us-nvme-ssd-mz-v9p1t0b-am-----pro---tb-ssd-nvme--m---black-551141121?$product-details-jpg$', 'jpg'],
  [30, 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/v1680126573/products/Power-Supply-Units/base-rme-series-2023-psu-config/Gallery/1000W/RM1000e_01.webp', 'webp'],
  [31, 'https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/57e0f054-6064-4e24-b3b2-c0e80ccb2896/TV-OLED42C3PUA-gallery-01_5000x5000', 'jpg'],
  [32, 'https://images.samsung.com/is/image/samsung/p6pim/us/ls49cg954enxza/gallery/us-gaming-ls49cg954enxza----inch-odyssey-g--g--c-black-552032404?$product-details-jpg$', 'jpg'],
  [33, 'https://dlcdnwebimgs.asus.com/gain/72C16A36-4EE3-4AC4-A58A-35F6B8A2FB6F/w717/h525/fwebp', 'webp'],
  [35, 'https://image.benq.com/is/image/benqco/ex2710u-right45-2?$ResponsivePreset$&fmt=png-alpha', 'png'],
  [36, 'https://assets2.razerzone.com/images/pnx.assets/cd96979aa903a39c20bfa1833fe89eb3/razer-blackwidow-v4-pro-hero-1920x700.webp', 'webp'],
  [37, 'https://images.ctfassets.net/hmm5mo4qf4mf/5T6OTTzl1B5zaX1nILPFw4/186d8f786745424cdd8770cda23623af/apex_pro_tkl_wl_img_buy_01.png?fm=webp&q=90&fit=scale&w=1920', 'webp'],
  [40, 'https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/new-gallery-assets-2025/pro-x-superlight-2-mice-top-angle-white-gallery-1.png', 'png'],
  [41, 'https://assets2.razerzone.com/images/pnx.assets/ef0800b3d46c633e4fac8bedf33fc991/dav3hyperspeed-desktop-hero.webp', 'webp'],
  [42, 'https://images.ctfassets.net/hmm5mo4qf4mf/5F4pbgGB9CMGwWx67wLePT/da8f9f12428b4c694bc45593ef1b365f/buyimg_prime__001.jpg__1920x1080_q100_crop-fit_optimize_subsampling-2-1357.jpg?fm=webp&q=90&fit=scale&w=1920', 'webp'],
  [43, 'https://www.pulsar.gg/cdn/shop/files/X2_v1_Gaming_Mouse_Mini_black_large.png?v=1758619300', 'png'],
  [45, 'https://nex-img.dxracer.cc/20001/a050ffcf-6cbf-44ae-a8d0-d688acfad132-2.png', 'png'],
  [47, 'https://respawnproducts.com/cdn/shop/products/t8srvs59jnxxqejudr6w_1920x.jpg?v=1761346930', 'jpg'],
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
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        return download(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    })
    req.on('error', err => { fs.unlink(dest, () => {}); reject(err) })
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

const results = []

for (const [id, url, ext] of IMAGES) {
  const filename = `${id}.${ext}`
  const dest = path.join(OUT_DIR, filename)
  const localPath = `/images/hardware/${filename}`
  process.stdout.write(`[${String(id).padStart(2)}] Downloading... `)
  try {
    await download(url, dest)
    const size = Math.round(fs.statSync(dest).size / 1024)
    console.log(`✓ ${filename} (${size} KB)`)
    results.push({ id, localPath, ok: true })
  } catch (err) {
    console.log(`✗ FAILED — ${err.message}`)
    results.push({ id, localPath: null, ok: false })
  }
}

console.log('\n── Summary ──────────────────────────────')
const ok = results.filter(r => r.ok)
const fail = results.filter(r => !r.ok)
console.log(`Downloaded: ${ok.length}  Failed: ${fail.length}`)
if (fail.length) console.log('Failed IDs:', fail.map(r => r.id).join(', '))
console.log('\nPaste into hardware.js image fields:')
ok.forEach(r => console.log(`  id ${r.id}: '${r.localPath}'`))
