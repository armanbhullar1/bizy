'use client'

import { useState, useEffect, useRef } from 'react'
import { DesignStyle, WebsiteConfig, CustomImage } from '@/types'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'

interface WebsiteBuilderProps {
  onConfigChange: (config: WebsiteConfig) => void
  initialConfig?: Partial<WebsiteConfig>
}

const DESIGN_STYLES: { value: DesignStyle; label: string; description: string }[] = [
  { value: 'modern', label: 'Modern', description: 'Clean lines, bold typography, contemporary feel' },
  { value: 'classic', label: 'Classic', description: 'Timeless elegance, traditional layouts' },
  { value: 'minimal', label: 'Minimal', description: 'Simple, spacious, content-focused' },
  { value: 'bold', label: 'Bold', description: 'Strong colors, impactful design, attention-grabbing' },
  { value: 'friendly', label: 'Friendly', description: 'Warm, approachable, inviting atmosphere' }
]

const FONT_STYLES = [
  { value: 'sans', label: 'Sans-Serif', example: 'Clean & Modern' },
  { value: 'serif', label: 'Serif', example: 'Classic & Elegant' },
  { value: 'modern', label: 'Modern Mix', example: 'Bold & Dynamic' }
]

const COLOR_PRESETS = [
  { name: 'Ocean', primary: '#0077B6', secondary: '#90E0EF', accent: '#00B4D8' },
  { name: 'Forest', primary: '#2D6A4F', secondary: '#95D5B2', accent: '#40916C' },
  { name: 'Sunset', primary: '#E63946', secondary: '#F4A261', accent: '#E76F51' },
  { name: 'Royal', primary: '#5A189A', secondary: '#C77DFF', accent: '#9D4EDD' },
  { name: 'Slate', primary: '#1E293B', secondary: '#94A3B8', accent: '#3B82F6' },
  { name: 'Warm', primary: '#B45309', secondary: '#FCD34D', accent: '#F59E0B' }
]

export default function WebsiteBuilder({ onConfigChange, initialConfig }: WebsiteBuilderProps) {
  const { businessProfile } = useBusinessProfile()
  
  const [config, setConfig] = useState<WebsiteConfig>(() => ({
    businessName: initialConfig?.businessName || businessProfile?.businessName || '',
    tagline: initialConfig?.tagline || '',
    description: initialConfig?.description || '',
    designStyle: initialConfig?.designStyle || 'modern',
    primaryColor: initialConfig?.primaryColor || '#3B82F6',
    secondaryColor: initialConfig?.secondaryColor || '#E0F2FE',
    accentColor: initialConfig?.accentColor || '#0EA5E9',
    fontStyle: initialConfig?.fontStyle || 'sans',
    services: initialConfig?.services || [''],
    contactEmail: initialConfig?.contactEmail || businessProfile?.email || '',
    contactPhone: initialConfig?.contactPhone || '',
    address: initialConfig?.address || '',
    showPricing: initialConfig?.showPricing ?? false,
    showTestimonials: initialConfig?.showTestimonials ?? false,
    showContactForm: initialConfig?.showContactForm ?? true,
    images: initialConfig?.images || [],
    createdAt: initialConfig?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))

  const [activeTab, setActiveTab] = useState<'basics' | 'design' | 'content' | 'features' | 'images'>('basics')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update parent when config changes
  useEffect(() => {
    onConfigChange(config)
  }, [config, onConfigChange])

  // Sync with profile updates
  useEffect(() => {
    if (businessProfile && !config.businessName) {
      setConfig(prev => ({
        ...prev,
        businessName: businessProfile.businessName || prev.businessName,
        contactEmail: businessProfile.email || prev.contactEmail
      }))
    }
  }, [businessProfile, config.businessName])

  const updateConfig = <K extends keyof WebsiteConfig>(key: K, value: WebsiteConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }))
  }

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      updatedAt: new Date().toISOString()
    }))
  }

  const addService = () => {
    setConfig(prev => ({ ...prev, services: [...prev.services, ''] }))
  }

  const updateService = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.map((s, i) => i === index ? value : s)
    }))
  }

  const removeService = (index: number) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const addImage = () => {
    if (!newImageUrl.trim()) return
    const newImage: CustomImage = {
      id: `img_${Date.now()}`,
      url: newImageUrl.trim(),
      x: 10,
      y: 200,
      width: 200,
      zIndex: (config.images?.length || 0) + 1
    }
    setConfig(prev => ({
      ...prev,
      images: [...(prev.images || []), newImage],
      updatedAt: new Date().toISOString()
    }))
    setNewImageUrl('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files')
        return
      }

      // Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        if (dataUrl) {
          const newImage: CustomImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: dataUrl,
            x: 10,
            y: 200,
            width: 200,
            zIndex: (config.images?.length || 0) + 1
          }
          setConfig(prev => ({
            ...prev,
            images: [...(prev.images || []), newImage],
            updatedAt: new Date().toISOString()
          }))
        }
        setUploadingImage(false)
      }
      reader.onerror = () => {
        alert('Failed to read image file')
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (id: string) => {
    setConfig(prev => ({
      ...prev,
      images: (prev.images || []).filter(img => img.id !== id),
      updatedAt: new Date().toISOString()
    }))
  }

  const updateImagePosition = (id: string, x: number, y: number) => {
    setConfig(prev => ({
      ...prev,
      images: (prev.images || []).map(img =>
        img.id === id ? { ...img, x, y } : img
      ),
      updatedAt: new Date().toISOString()
    }))
  }

  const updateImageSize = (id: string, width: number) => {
    setConfig(prev => ({
      ...prev,
      images: (prev.images || []).map(img =>
        img.id === id ? { ...img, width } : img
      ),
      updatedAt: new Date().toISOString()
    }))
  }

  const tabs = [
    { id: 'basics', label: '1. Basics', icon: '📋' },
    { id: 'design', label: '2. Design', icon: '🎨' },
    { id: 'content', label: '3. Content', icon: '📝' },
    { id: 'features', label: '4. Features', icon: '⚙️' },
    { id: 'images', label: '5. Images', icon: '🖼️' }
  ] as const

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        {/* BASICS TAB */}
        {activeTab === 'basics' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => updateConfig('businessName', e.target.value)}
                placeholder="Your Business Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => updateConfig('tagline', e.target.value)}
                placeholder="A catchy phrase that describes your business"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Example: &quot;Your trusted partner in home renovation&quot;</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                value={config.description}
                onChange={(e) => updateConfig('description', e.target.value)}
                placeholder="Tell visitors what your business does and why they should choose you..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => updateConfig('contactEmail', e.target.value)}
                  placeholder="contact@yourbusiness.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={config.contactPhone || ''}
                  onChange={(e) => updateConfig('contactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                value={config.address || ''}
                onChange={(e) => updateConfig('address', e.target.value)}
                placeholder="123 Main Street, Toronto, ON"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* DESIGN TAB */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Design Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DESIGN_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateConfig('designStyle', style.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      config.designStyle === style.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Palette
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyColorPreset(preset)}
                    className={`p-2 rounded-lg border-2 text-center transition-all ${
                      config.primaryColor === preset.primary
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-1 justify-center mb-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <div className="text-xs font-medium">{preset.name}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Primary</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Secondary</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => updateConfig('accentColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.accentColor}
                      onChange={(e) => updateConfig('accentColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Font Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FONT_STYLES.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => updateConfig('fontStyle', font.value as 'sans' | 'serif' | 'modern')}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      config.fontStyle === font.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className={`text-lg mb-1 ${
                        font.value === 'serif' ? 'font-serif' : 
                        font.value === 'modern' ? 'font-bold' : 'font-sans'
                      }`}
                    >
                      {font.example}
                    </div>
                    <div className="text-xs text-gray-500">{font.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL (optional)
              </label>
              <input
                type="url"
                value={config.logoUrl || ''}
                onChange={(e) => updateConfig('logoUrl', e.target.value)}
                placeholder="https://example.com/your-logo.png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image URL (optional)
              </label>
              <input
                type="url"
                value={config.heroImage || ''}
                onChange={(e) => updateConfig('heroImage', e.target.value)}
                placeholder="https://example.com/hero-image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Recommended size: 1920x800 pixels</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Services / Products
                </label>
                <button
                  onClick={addService}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Service
                </button>
              </div>
              <div className="space-y-2">
                {config.services.map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      placeholder={`Service ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {config.services.length > 1 && (
                      <button
                        onClick={() => removeService(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Social Links (optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={config.socialLinks?.facebook || ''}
                    onChange={(e) => updateConfig('socialLinks', { ...config.socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourbusiness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={config.socialLinks?.instagram || ''}
                    onChange={(e) => updateConfig('socialLinks', { ...config.socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourbusiness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Twitter / X</label>
                  <input
                    type="url"
                    value={config.socialLinks?.twitter || ''}
                    onChange={(e) => updateConfig('socialLinks', { ...config.socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourbusiness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={config.socialLinks?.linkedin || ''}
                    onChange={(e) => updateConfig('socialLinks', { ...config.socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/yourbusiness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Choose which sections to include in your website:
            </p>

            <div className="space-y-4">
              <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={config.showContactForm ?? true}
                  onChange={(e) => updateConfig('showContactForm', e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Contact Form</div>
                  <div className="text-sm text-gray-500">
                    Let visitors send you messages directly from your website
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={config.showPricing ?? false}
                  onChange={(e) => updateConfig('showPricing', e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Pricing Section</div>
                  <div className="text-sm text-gray-500">
                    Display your pricing or service packages
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={config.showTestimonials ?? false}
                  onChange={(e) => updateConfig('showTestimonials', e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Testimonials</div>
                  <div className="text-sm text-gray-500">
                    Showcase reviews and testimonials from your customers
                  </div>
                </div>
              </label>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">✨ Tip</h4>
              <p className="text-sm text-blue-800">
                Start with essential sections and add more later. A simple, focused website 
                often converts better than one overloaded with features.
              </p>
            </div>
          </div>
        )}

        {/* IMAGES TAB */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Custom Images
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload images from your computer or add via URL. Drag them in the preview to position.
              </p>
              
              {/* File Upload */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-colors ${
                    uploadingImage ? 'bg-gray-100' : 'hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl">📤</div>
                      <div>
                        <span className="font-medium text-blue-600">Click to upload</span>
                        <span className="text-gray-500"> or drag and drop</span>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* URL Input */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 uppercase">or add via URL</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                />
                <button
                  onClick={addImage}
                  disabled={!newImageUrl.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Image List */}
            {config.images && config.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Images ({config.images.length})
                </label>
                <div className="space-y-3">
                  {config.images.map((image, index) => (
                    <div 
                      key={image.id}
                      className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={image.url} 
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext fill="%23999" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-600">
                          {image.url.startsWith('data:') ? (
                            <span className="flex items-center gap-2">
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                              Uploaded image #{index + 1}
                            </span>
                          ) : (
                            <span className="truncate block">{image.url}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <label className="flex items-center gap-2 text-xs text-gray-500">
                            Width:
                            <input
                              type="number"
                              value={image.width}
                              onChange={(e) => updateImageSize(image.id, Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              min="50"
                              max="800"
                            />
                            px
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🖼️ Tip</h4>
              <p className="text-sm text-blue-800">
                After adding images, switch to the preview and drag them to position them on your website.
                Images will appear as floating overlays that you can move anywhere.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab)
              if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id)
            }}
            disabled={activeTab === 'basics'}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab)
              if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id)
            }}
            disabled={activeTab === 'images'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
