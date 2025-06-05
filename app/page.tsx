import React from 'react'
import HomeClient from './home/home'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'SoftLearn - Modern Learning Management System',
  description: 'Transform learning with our comprehensive LMS. Create courses, manage assignments, track progress, and deliver exceptional educational experiences.',
  keywords: 'LMS, Learning Management System, Online Education, Course Creation, E-Learning Platform',
}

export default function RootPage() {
  return (
    <div className="min-h-screen w-screen">
      <HomeClient/>
    </div>
  )
}
