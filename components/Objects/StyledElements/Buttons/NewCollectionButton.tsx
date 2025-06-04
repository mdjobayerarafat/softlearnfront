'use client'
import { motion } from 'framer-motion'

function NewCollectionButton() {
  return (
    <motion.button 
      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 p-3 px-6 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 ease-out backdrop-blur-xl border border-white/10 flex items-center space-x-3"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px -12px rgba(168, 85, 247, 0.4)"
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
      
      <div className="relative z-10 flex items-center space-x-3">
        <span className="text-sm font-medium">New Collection</span>
        <motion.div 
          className="flex items-center justify-center w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.span 
            className="text-lg font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          >
            +
          </motion.span>
        </motion.div>
      </div>
    </motion.button>
  )
}

export default NewCollectionButton
