'use client'

import { useState, useCallback } from 'react'
import { WebsiteConfig, CustomImage } from '@/types'
import WebsiteBuilder from '@/components/storefront/WebsiteBuilder'
import WebsitePreview from '@/components/storefront/WebsitePreview'
import { downloadWebsiteHTML, generateWebsiteHTML } from '@/lib/utils/website-generator'

export default function StorefrontPage() {
  const [config, setConfig] = useState<WebsiteConfig | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split')
  const [copied, setCopied] = useState(false)

  const handleConfigChange = useCallback((newConfig: WebsiteConfig) => {
    setConfig(newConfig)
  }, [])

  const handleImageMove = useCallback((imageId: string, x: number, y: number) => {
    setConfig(prev => {
      if (!prev) return prev
      return {
        ...prev,
        images: (prev.images || []).map(img =>
          img.id === imageId ? { ...img, x, y } : img
        ),
        updatedAt: new Date().toISOString()
      }
    })
  }, [])

  const handleDownload = () => {
    if (config) {
      downloadWebsiteHTML(config)
    }
  }

  const handleCopyCode = async () => {
    if (config) {
      const html = generateWebsiteHTML(config)
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isValid = config?.businessName && config?.contactEmail

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3rem)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-gray-600">Create a professional website for your business</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'split' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'code' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Code
            </button>
          </div>

          {/* Export Actions */}
          <button
            onClick={handleCopyCode}
            disabled={!isValid}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!isValid}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download HTML
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 grid gap-6 min-h-0 ${
        viewMode === 'split' 
          ? 'lg:grid-cols-2' 
          : 'grid-cols-1'
      }`}>
        {/* Builder Panel */}
        {viewMode === 'split' && (
          <div className="overflow-auto">
            <WebsiteBuilder onConfigChange={handleConfigChange} />
          </div>
        )}

        {/* Preview Panel */}
        {(viewMode === 'split' || viewMode === 'preview') && config && (
          <div className={`flex flex-col min-h-0 h-full ${viewMode === 'preview' ? 'max-w-5xl mx-auto w-full' : ''}`}>
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h2 className="text-sm font-medium text-gray-700">Live Preview</h2>
              {viewMode === 'split' && (
                <span className="text-xs text-gray-500">Scale: 50%</span>
              )}
            </div>
            <div className="flex-1 min-h-0 h-full">
              <WebsitePreview 
                config={config} 
                scale={viewMode === 'preview' ? 0.75 : 0.5}
                fullHeight={viewMode === 'split'}
                onImageMove={handleImageMove}
              />
            </div>
          </div>
        )}

        {/* Code Panel */}
        {viewMode === 'code' && config && (
          <div className="col-span-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Generated HTML</h2>
              <button
                onClick={handleCopyCode}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <pre className="p-6 text-sm text-gray-300 overflow-auto max-h-[600px]">
                <code>{generateWebsiteHTML(config)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {(!config || !isValid) && viewMode !== 'split' && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start Building Your Website
          </h3>
          <p className="text-gray-600 mb-4">
            Fill in your business details to see a live preview
          </p>
          <button
            onClick={() => setViewMode('split')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open Builder
          </button>
        </div>
      )}

      {/* Tips Section - hidden in split view */}
      {viewMode !== 'split' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shrink-0 mt-4">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Choose Your Style:</strong> Pick a design style that matches your brand personality. Modern for tech, Classic for professional services.
            </div>
            <div>
              <strong>Brand Colors:</strong> Use your existing brand colors or pick from our presets. Consistent colors build recognition.
            </div>
            <div>
              <strong>Keep It Simple:</strong> Start with essential sections. You can always add more content after downloading.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
