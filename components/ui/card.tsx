'use client'
import * as React from "react"
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from "@/lib/utils"

export interface CardProps extends Omit<HTMLMotionProps<"div">, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: 'default' | 'glass' | 'gradient' | 'neon' | 'outline' | 'solid' | 'elevated'
  hover?: boolean
  animate?: boolean
  delay?: number
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, animate = false, delay = 0, children, ...props }, ref) => {
    const baseClasses = "rounded-lg border transition-all duration-300"
    
    const variantClasses = {
      default: "bg-slate-900/70 backdrop-blur-sm text-white shadow-sm border-white/10",
      glass: "modern-glass bg-slate-800/30 text-white border-slate-700/50 backdrop-blur-xl shadow-lg",
      gradient: "bg-gradient-to-br from-slate-800 to-slate-900 text-white border-slate-700/50 shadow-lg",
      neon: "bg-slate-900/50 text-white border-blue-500/50 neon-glow-blue backdrop-blur-xl shadow-xl",
      outline: "bg-transparent border-slate-300 text-slate-900 hover:bg-slate-50",
      solid: "bg-white text-slate-900 border-slate-200 shadow-sm",
      elevated: "bg-white text-slate-900 border-slate-200 shadow-xl hover:shadow-2xl"
    }

    const hoverClasses = hover ? "hover:scale-[1.02] hover:shadow-lg hover:border-opacity-60" : ""

    const animationProps = animate ? {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { 
        duration: 0.5, 
        delay: delay,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    } : {}

    const hoverAnimationProps = hover ? {
      whileHover: { 
        y: -4, 
        scale: 1.02,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 }
      },
      whileTap: { scale: 0.98 }
    } : {}

    if (hover || animate) {
      return (
        <motion.div
          ref={ref}
          className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}
          {...animationProps}
          {...hoverAnimationProps}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    // For regular div, only pass basic HTML props
    const {
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      id,
      role,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      
      ...otherProps
    } = props

    const basicDivProps = {
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      id,
      role,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...basicDivProps}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { spacing?: 'sm' | 'md' | 'lg' }
>(({ className, spacing = 'md', ...props }, ref) => {
  const spacingClasses = {
    sm: "space-y-1 p-4",
    md: "space-y-1.5 p-6",
    lg: "space-y-2 p-8"
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-col", spacingClasses[spacing], className)}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' | 'xl' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-xl font-semibold",
    lg: "text-2xl font-semibold",
    xl: "text-3xl font-bold"
  }

  return (
    <div
      ref={ref}
      className={cn(sizeClasses[size], "leading-none tracking-tight", className)}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { muted?: boolean }
>(({ className, muted = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm leading-relaxed",
      muted ? "text-slate-500 dark:text-slate-400" : "text-current",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { spacing?: 'sm' | 'md' | 'lg' }
>(({ className, spacing = 'md', ...props }, ref) => {
  const spacingClasses = {
    sm: "p-4 pt-0",
    md: "p-6 pt-0", 
    lg: "p-8 pt-0"
  }

  return (
    <div 
      ref={ref} 
      className={cn(spacingClasses[spacing], className)} 
      {...props} 
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    spacing?: 'sm' | 'md' | 'lg'
    justify?: 'start' | 'center' | 'end' | 'between'
  }
>(({ className, spacing = 'md', justify = 'start', ...props }, ref) => {
  const spacingClasses = {
    sm: "p-4 pt-0",
    md: "p-6 pt-0",
    lg: "p-8 pt-0"
  }

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
    between: "justify-between"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        spacingClasses[spacing],
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
