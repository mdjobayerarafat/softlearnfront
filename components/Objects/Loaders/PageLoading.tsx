'use client'
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, scale: 0.9 },
  enter: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
}

// Modern animated orbs
const orbVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: [0, 1.2, 1],
    opacity: [0, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      delay: i * 0.3,
      ease: "easeInOut"
    }
  })
}

// Pulse animation for the center
const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Shimmer effect for text
const shimmerVariants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

function PageLoading() {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl" />
        
        <div className="relative flex flex-col items-center justify-center p-8">
          {/* Modern loading animation with orbiting elements */}
          <div className="relative w-32 h-32 mb-8">
            {/* Center pulse */}
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 neon-glow-blue"
            />
            
            {/* Orbiting elements */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={orbVariants}
                initial="initial"
                animate="animate"
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: i === 0 ? 'linear-gradient(45deg, #3b82f6, #6366f1)' :
                             i === 1 ? 'linear-gradient(45deg, #8b5cf6, #a855f7)' :
                             'linear-gradient(45deg, #06b6d4, #0891b2)',
                  top: i === 0 ? '10%' : i === 1 ? '50%' : '80%',
                  left: i === 0 ? '80%' : i === 1 ? '10%' : '70%',
                  boxShadow: i === 0 ? '0 0 20px rgba(59, 130, 246, 0.6)' :
                            i === 1 ? '0 0 20px rgba(139, 92, 246, 0.6)' :
                            '0 0 20px rgba(6, 182, 212, 0.6)'
                }}
              />
            ))}
            
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
            />
          </div>

          {/* Modern shimmer text */}
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 100%',
              backgroundImage: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #67e8f9 100%)'
            }}
          >
            Loading...
          </motion.div>
          
          {/* Subtitle with fade */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0, 1, 0.7],
              y: 0,
              transition: { duration: 2, repeat: Infinity }
            }}
            className="mt-4 text-sm text-slate-400 font-medium"
          >
            Preparing your experience
          </motion.p>

          {/* Progress bar */}
          <div className="mt-8 w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              animate={{
                x: ['-100%', '100%'],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.main>
  )
}

export default PageLoading
