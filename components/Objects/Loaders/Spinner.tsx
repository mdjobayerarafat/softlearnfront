'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'gradient' | 'neon' | 'dots' | 'pulse'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const Spinner = ({ size = 'md', variant = 'default', className }: SpinnerProps) => {
  const baseClasses = cn(sizeClasses[size], className)

  if (variant === 'gradient') {
    return (
      <motion.div
        className={cn(baseClasses, 'rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border')}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)',
          borderRadius: '50%',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))'
        }}
      />
    )
  }

  if (variant === 'neon') {
    return (
      <motion.div
        className={cn(baseClasses, 'rounded-full border-2 border-blue-400 border-t-transparent neon-glow-blue')}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('rounded-full bg-blue-400', size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4')}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(baseClasses, 'rounded-full bg-gradient-to-r from-blue-500 to-purple-500')}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  // Default spinner
  return (
    <motion.div
      className={cn(baseClasses, 'rounded-full border-2 border-slate-300 border-t-blue-500')}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

export default Spinner
