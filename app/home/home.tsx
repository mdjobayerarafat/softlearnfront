'use client'
import Image from 'next/image';
import Link from 'next/link';
import learnhouseIcon from 'public/learnhouse_bigicon_1.png'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  BarChart3, 
  Zap, 
  Shield, 
  Smartphone,
  Star,
  CheckCircle,
  Play,
  Award,
  Globe,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import SplashLoading from '../../components/Objects/Loaders/SplashLoading';

function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
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
      }}>
        <SplashLoading onComplete={() => setIsLoading(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 modern-dots-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="fixed w-full bg-slate-900/80 backdrop-blur-xl z-50 border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75" />
                <Image
                  quality={100}
                  width={40}
                  height={40}
                  src={learnhouseIcon}
                  alt="SoftLearn Logo"
                  className="relative rounded-lg"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SoftLearn
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'About'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-slate-300 hover:text-white transition-colors relative group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center space-x-4"
              >
                <Link 
                  href="/login?orgslug=default" 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup?orgslug=default" 
                  className="modern-glass px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 neon-glow-blue"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50"
            >
              <div className="px-4 py-6 space-y-4">
                {['Features', 'Pricing', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-slate-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <Link 
                    href="/login?orgslug=default" 
                    className="block text-blue-400 hover:text-blue-300 font-medium py-2"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup?orgslug=default" 
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 min-h-screen flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium modern-glass bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 mb-6 border border-blue-500/30"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Next-Generation Learning Platform
            </motion.span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="text-white">Transform Learning</span>
            <motion.span 
              className="block text-transparent bg-clip-text animated-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Accelerate Growth
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Create, manage, and deliver exceptional educational experiences with our comprehensive Learning Management System. 
            Built for modern educators and learners.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup?orgslug=default" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 neon-glow-blue modern-glass flex items-center group"
              >
                Start Free Trial
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.button 
              className="flex items-center text-slate-300 hover:text-white font-medium px-8 py-4 rounded-full border border-slate-600 hover:border-slate-400 transition-all duration-300 modern-glass group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              'No credit card required',
              '14-day free trial',
              'Cancel anytime'
            ].map((text, index) => (
              <motion.div 
                key={text}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                {text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive tools for creating, managing, and delivering exceptional learning experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Course Management',
                description: 'Create and organize courses with chapters, activities, and rich content. Support for videos, documents, and interactive elements.',
                features: ['Multiple activity types', 'Rich content editor', 'Progress tracking'],
                color: 'blue',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: Video,
                title: 'Video Learning',
                description: 'Advanced video player with playback controls, start/end times, and interactive features for engaging video content.',
                features: ['Custom video player', 'Playback controls', 'Video analytics'],
                color: 'purple',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                icon: FileText,
                title: 'Smart Assignments',
                description: 'Comprehensive assignment system with file submissions, automated grading, and detailed feedback mechanisms.',
                features: ['File submissions', 'Auto grading', 'Detailed feedback'],
                color: 'green',
                gradient: 'from-green-500 to-green-600'
              },
              {
                icon: Users,
                title: 'Multi-Organization',
                description: 'Support multiple educational organizations with role-based access control and customizable branding.',
                features: ['Multiple orgs', 'Role management', 'Custom branding'],
                color: 'orange',
                gradient: 'from-orange-500 to-orange-600'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Comprehensive dashboard with course completion tracking, student progress analytics, and performance insights.',
                features: ['Progress tracking', 'Performance insights', 'Custom reports'],
                color: 'red',
                gradient: 'from-red-500 to-red-600'
              },
              {
                icon: Smartphone,
                title: 'Mobile First',
                description: 'Fully responsive design optimized for all devices with touch-friendly navigation and mobile course viewer.',
                features: ['Responsive design', 'Touch navigation', 'Mobile optimized'],
                color: 'cyan',
                gradient: 'from-cyan-500 to-cyan-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="modern-glass bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.features.map((feat) => (
                    <li key={feat} className="flex items-center text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-cyan-900/30" />
        <div className="absolute inset-0 modern-glass" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-xl text-slate-300">
              Join thousands of organizations transforming education
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Learners', delay: 0 },
              { value: '500+', label: 'Organizations', delay: 0.1 },
              { value: '50K+', label: 'Courses Created', delay: 0.2 },
              { value: '99.9%', label: 'Uptime', delay: 0.3 }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="modern-glass bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                transition={{ duration: 0.8, delay: stat.delay }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.2, type: "spring" }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-slate-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Learning Platform?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-slate-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of educators and organizations who trust SoftLearn to deliver exceptional learning experiences.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup?orgslug=default" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 neon-glow-blue modern-glass flex items-center group"
              >
                Start Your Free Trial
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/login?orgslug=default" 
                className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 modern-glass"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75" />
                  <Image
                    quality={100}
                    width={32}
                    height={32}
                    src={learnhouseIcon}
                    alt="SoftLearn Logo"
                    className="relative rounded-lg"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SoftLearn
                </span>
              </div>
              <p className="text-slate-400 mb-4 leading-relaxed">
                Modern Learning Management System built for the future of education.
              </p>
            </motion.div>
            
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Security', 'Integrations']
              },
              {
                title: 'Company', 
                links: ['About', 'Blog', 'Careers', 'Contact']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Documentation', 'API Reference', 'Status']
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-slate-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-slate-800 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400">
              &copy; 2025 SoftLearn. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default HomeClient