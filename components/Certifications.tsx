"use client"

import React from 'react'
import SectionHeading from './ui/SectionHeading'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

//Add metadata for the page
const certifications = [
  {
    title: 'Responsive Web Design',
    institution: 'freeCodeCamp',
    year: '2024',
    link: 'https://www.freecodecamp.org/certification/ghanatherohit/responsive-web-design',
    img: '/certifications/responsive-web-design.png',
  },
  {
    title: 'SQL and Relational Databases 101',
    institution: 'Cognitive Class',
    year: '2024',
    link: 'https://courses.cognitiveclass.ai/certificates/dd5616c02ade456da8ee2505c1119748',
    img: '/certifications/sql-and-relational-databases-101.png',
  },
  {
    title: 'Smart Coder',
    institution: 'Smart Interviews',
    year: '2024',
    link: 'https://smartinterviews.in/certificate/f2f938cb',
    img: '/certifications/smart-coder.png',
  },
  
]

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 md:py-32">
      <div className="container px-4 mx-auto">
        <SectionHeading
          title="Certifications"
          subtitle="My achievements in the tech field"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
        >
          {certifications.map((cert, index) => (
            <div
              key={index}
              className={cn(
                'p-6 bg-white dark:bg-primary/5 rounded-lg shadow-md hover:shadow-lg transition-shadow',
                'flex flex-col items-start space-y-4'
              )}
            >
              <h3 className="text-lg font-semibold">{cert.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {cert.institution} - {cert.year}
              </p>
              {/* Certificate Image and Link */}
              <img
                src={ cert.img }
                alt="Certificate Icon"
                className="w-80 h-70 object-cover rounded-md mb-2"
              />
              <Link href={cert.link} target="_blank" className="flex items-center text-sm font-medium text-primary hover:underline transition-colors gap-2">
                <FileText className="h-6 w-6 text-primary" />
                View Certificate
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
export default Certifications
