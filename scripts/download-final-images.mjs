import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'hardware')

const IMAGES = [
  // custom PC builds — use matching GPU card photos
  [18, 'https://dlcdnwebimgs.asus.com/gain/b6947e57-1cfd-430e-8e78-1fb0516638dd/w692', 'webp'],  // ASUS TUF RTX 4070 Ti Super
  [20, 'https://dlcdnwebimgs.asus.com/gain/9d66b53a-9e84-4760-a233-55aa21cb24ca/w692', 'webp'],  // ASUS TUF RTX 4060 Ti
  [21, 'https://media.cdn.sapphiretech.com.cn/-/media/sites/sapphire/pim/product-images/11335_04_7700xt_pulse_16gddr6_dual-fan/11335_04_rx7700xt_pulse_2fan_full_box_card_amd_374x265.ashx', 'jpg'], // Sapphire RX 7700 XT
  [22, 'https://dlcdnwebimgs.asus.com/gain/c0ba3131-118a-4ab8-8898-f744c4bdfd56/w692', 'webp'],  // ASUS TUF RTX 4080 Super (streaming build)
  [24, 'https://dlcdnwebimgs.asus.com/gain/c0ba3131-118a-4ab8-8898-f744c4bdfd56/w692', 'webp'],  // ASUS TUF RTX 4080 Super component
  [25, 'https://media.cdn.sapphiretech.com.cn/-/media/sites/sapphire/pim/product-images/11322_02_rx7900xtx_pulse_24ggddr6/11322_02_rx7900xtx_pulse_24ggddr6_c01_800x500.ashx', 'jpg'],  // Sapphire PULSE RX 7900 XTX
  [26, 'https://newsroom.intel.com/wp-content/uploads/sites/11/2023/10/14gen-i9-box.jpg', 'jpg', 'https://www.intel.com/content/dam/products/badge-ltr-i9.png'],  // Intel i9-14900K
  [34, 'https://storage-asset.msi.com/global/pictures/image/2024/monitor/MAG-274QRF-QD-E2/main.png', 'png', 'https://dlcdnwebimgs.asus.com/gain/9d66b53a-9e84-4760-a233-55aa21cb24ca/w692'], // MSI monitor — fallback ASUS
  [39, 'https://www.keychronsg.com/cdn/shop/files/Keychron-Q3-Max-QMK-VIA-Wireless-Custom-Mechanical-Keyboard-80-percent-Layout-Aluminum-Black-Fully-Assembled-Knob-for-Mac-Windows-Linux-Gateron-Jupiter-Red.jpg?v=1723449295', 'jpg'],
  [44, 'https://images.secretlab.co/products/chairs/TITAN-Evo-2022/TITAN-Evo-Stealth-2022-main.jpg', 'jpg', 'https://images.secretlab.co/theme/landing/titan-evo/titan-evo-main.jpg'],
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error('no URL'))
    const file = fs.createWriteStream(dest)
    const proto = url.startsWith('https') ? https : http
    const req = proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/*,*/*',
        'Referer': 'https://google.com/',
      },
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest)
        return download(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlinkSync(dest)
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

for (const [id, primary, ext, fallback] of IMAGES) {
  const filename = `${id}.${ext}`
  const dest = path.join(OUT_DIR, filename)
  process.stdout.write(`[${String(id).padStart(2)}] Trying primary... `)
  try {
    await download(primary, dest)
    const size = Math.round(fs.statSync(dest).size / 1024)
    console.log(`✓ ${filename} (${size} KB)`)
    results.push({ id, localPath: `/images/hardware/${filename}`, ok: true })
  } catch (err) {
    console.log(`✗ ${err.message}`)
    if (fallback) {
      process.stdout.write(`     Trying fallback... `)
      try {
        await download(fallback, dest)
        const size = Math.round(fs.statSync(dest).size / 1024)
        console.log(`✓ ${filename} (${size} KB)`)
        results.push({ id, localPath: `/images/hardware/${filename}`, ok: true })
      } catch (e) {
        console.log(`✗ ${e.message}`)
        results.push({ id, localPath: null, ok: false })
      }
    } else {
      results.push({ id, localPath: null, ok: false })
    }
  }
}

console.log('\n── Summary ──────────────────────────')
console.log(`Downloaded: ${results.filter(r=>r.ok).length}  Failed: ${results.filter(r=>!r.ok).length}`)
results.filter(r=>!r.ok).forEach(r => console.log(`  FAILED id ${r.id}`))
console.log('\nSuccessful paths:')
results.filter(r=>r.ok).forEach(r => console.log(`  id ${r.id}: '${r.localPath}'`))
