'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SplashLoadingProps {
  onComplete?: () => void
  duration?: number
}

const SplashLoading = ({ onComplete, duration = 3000 }: SplashLoadingProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => onComplete?.(), 500)
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    return () => clearInterval(timer)
  }, [duration, onComplete])

  const logoVariants = {
    hidden: { 
      scale: 0.5, 
      opacity: 0, 
      rotateY: 180 
    },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotateY: 0,
      transition: {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2
      }
    }
  }

  const textVariants = {
    hidden: { 
      y: 50, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.8
      }
    }
  }

  const particleVariants = {
    animate: (i: number) => ({
      y: [0, -20, 0],
      x: [0, Math.sin(i) * 10, 0],
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay: i * 0.1,
        ease: "easeInOut"
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        transition: { duration: 0.5 }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 modern-dots-bg opacity-20" />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={particleVariants}
            animate="animate"
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center flex flex-col items-center justify-center">
        {/* Logo/Brand */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 scale-150" />
            
            {/* Main logo */}
            <div className="relative w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center transform-gpu">
              <span className="text-3xl font-bold text-white">SL</span>
            </div>
          </div>
          
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            SoftLearn
          </motion.h1>
          
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-slate-400 mt-2 text-lg font-medium"
          >
            Learning Management System
          </motion.p>
        </motion.div>

        {/* Modern progress bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: 300, 
            opacity: 1,
            transition: { duration: 0.8, delay: 1.2 }
          }}
          className="mx-auto mb-4"
        >
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 1.5 }
            }}
            className="mt-3 text-sm text-slate-500 font-medium"
          >
            {progress < 100 ? `Loading... ${Math.round(progress)}%` : 'Ready!'}
          </motion.div>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 2 }
          }}
          className="flex justify-center space-x-2 mt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SplashLoading
