'use client'

import React from 'react'
import Link from "next/link"

export function ResourcesPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Previous Cases</h3>
            </div>
            <p className="text-white/70 mb-3">Access past hackathon and datathon case studies and datasets.</p>
            <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
              View Cases →
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Assets & Logos</h3>
            </div>
            <p className="text-white/70 mb-3">Download BOLT logos, brand assets, and design resources for your projects.</p>
            <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
              Download Assets →
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Workshop Materials</h3>
            </div>
            <p className="text-white/70 mb-3">Slides, code samples, and resources from our technical workshops.</p>
            <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
              Browse Materials →
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Tech Stack Guides</h3>
            </div>
            <p className="text-white/70 mb-3">Quick-start guides and tutorials for popular technologies and frameworks.</p>
            <Link href="/membership/guides" className="text-blue-300 hover:text-blue-200 text-sm font-medium">
              Explore Guides →
            </Link>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Mastercard Interview & Case Study Tips</h3>
            </div>
            <p className="text-white/70 mb-3">Exclusive prep content for Mastercard interviews and case studies.</p>
            <a
              href="https://docs.google.com/presentation/d/1I7CRLXe-kCv5ElLHPYkMA7IAdaovHV2U/edit?usp=sharing&ouid=103896099220639941650&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 text-sm font-medium"
            >
              View Guide →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

