import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { fadeUp, lineExpand } from '../utils/animations'

export default function SectionHeader({ title, subtitle, accentColor = '#7b2fff' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
          {/* Left line */}
          <motion.div variants={lineExpand} style={{ flex: 1, maxWidth: 80, height: 1, background: `linear-gradient(to right, transparent, ${accentColor})`, transformOrigin: 'right' }} />

          <motion.div variants={fadeUp}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Fira Code'", fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                background: `linear-gradient(135deg, #ffffff, ${accentColor})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '0.05em',
              }}
            >
              {title}
            </Typography>
          </motion.div>

          {/* Right line */}
          <motion.div variants={lineExpand} style={{ flex: 1, maxWidth: 80, height: 1, background: `linear-gradient(to left, transparent, ${accentColor})`, transformOrigin: 'left' }} />
        </Box>

        {subtitle && (
          <motion.div variants={fadeUp}>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {subtitle}
            </Typography>
          </motion.div>
        )}
      </Box>
    </motion.div>
  )
}
