import { motion } from 'framer-motion'
import { fadeUp } from '../utils/animations'

/**
 * Scroll-triggered fade-up wrapper.
 * Usage: <FadeIn delay={0.1}><YourComponent /></FadeIn>
 */
export default function FadeIn({ children, variant = fadeUp, delay = 0, style, className }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variant}
      custom={delay}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
