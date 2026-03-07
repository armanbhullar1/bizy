'use client'

import { useState, useRef, useCallback } from 'react'
import { WebsiteConfig, CustomImage } from '@/types'

interface WebsitePreviewProps {
  config: WebsiteConfig
  scale?: number
  fullHeight?: boolean
  onImageMove?: (imageId: string, x: number, y: number) => void
}

interface DragState {
  isDragging: boolean
  imageId: string | null
  startX: number
  startY: number
  startImageX: number
  startImageY: number
}

export default function WebsitePreview({ config, scale = 0.5, fullHeight = false, onImageMove }: WebsitePreviewProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    imageId: null,
    startX: 0,
    startY: 0,
    startImageX: 0,
    startImageY: 0
  })
  const previewRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent, image: CustomImage) => {
    e.preventDefault()
    setDragState({
      isDragging: true,
      imageId: image.id,
      startX: e.clientX,
      startY: e.clientY,
      startImageX: image.x,
      startImageY: image.y
    })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.imageId || !previewRef.current || !onImageMove) return

    const deltaX = (e.clientX - dragState.startX) / scale
    const deltaY = (e.clientY - dragState.startY) / scale

    const newX = Math.max(0, Math.min(100, dragState.startImageX + (deltaX / previewRef.current.offsetWidth) * 100 * scale))
    const newY = Math.max(0, dragState.startImageY + deltaY)

    onImageMove(dragState.imageId, newX, newY)
  }, [dragState, scale, onImageMove])

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false, imageId: null }))
  }, [])

  const getFontFamily = () => {
    switch (config.fontStyle) {
      case 'serif': return "'Georgia', 'Times New Roman', serif"
      case 'modern': return "'Inter', 'SF Pro Display', system-ui, sans-serif"
      default: return "'Inter', 'Helvetica Neue', Arial, sans-serif"
    }
  }

  const getStylePresets = () => {
    const baseStyles = {
      borderRadius: '8px',
      headerStyle: 'normal' as const,
      heroOverlay: 0.5,
      buttonStyle: 'rounded' as const
    }

    switch (config.designStyle) {
      case 'classic':
        return { ...baseStyles, borderRadius: '4px', headerStyle: 'centered' as const }
      case 'minimal':
        return { ...baseStyles, borderRadius: '0px', heroOverlay: 0.3 }
      case 'bold':
        return { ...baseStyles, borderRadius: '0px', buttonStyle: 'sharp' as const }
      case 'friendly':
        return { ...baseStyles, borderRadius: '16px', buttonStyle: 'pill' as const }
      default:
        return baseStyles
    }
  }

  const stylePresets = getStylePresets()
  const fontFamily = getFontFamily()

  const filteredServices = config.services.filter(s => s.trim())

  // For non-fullHeight mode, use fixed dimensions
  const fixedHeight = 600 * scale
  const innerScaledHeight = 600 / scale

  return (
    <div 
      ref={previewRef}
      className={`bg-gray-100 rounded-xl overflow-hidden flex flex-col`}
      style={{ height: fullHeight ? '100%' : `${fixedHeight + 40}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300 text-center">
            www.{config.businessName.toLowerCase().replace(/\s+/g, '')}.com
          </div>
        </div>
      </div>

      <div 
        className="bg-white overflow-hidden flex-1 relative"
      >
        {/* Draggable Custom Images */}
        {config.images && config.images.map((image) => (
          <div
            key={image.id}
            className={`absolute cursor-move select-none ${dragState.imageId === image.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300'}`}
            style={{
              left: `${image.x}%`,
              top: `${image.y * scale}px`,
              width: `${image.width * scale}px`,
              zIndex: image.zIndex + 100,
              transform: 'translate(0, 0)'
            }}
            onMouseDown={(e) => handleMouseDown(e, image)}
          >
            <img
              src={image.url}
              alt=""
              className="w-full h-auto rounded shadow-lg pointer-events-none"
              draggable={false}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23f3f4f6" width="200" height="150"/%3E%3Ctext fill="%239ca3af" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E'
              }}
            />
            {dragState.imageId === image.id && (
              <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Drag to move
              </div>
            )}
          </div>
        ))}

        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
            overflow: 'auto'
          }}
        >
        {/* Navigation */}
        <nav 
          style={{ 
            backgroundColor: config.primaryColor,
            fontFamily 
          }}
          className="px-8 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <img 
                src={config.logoUrl} 
                alt="Logo" 
                className="h-10 w-auto"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                {config.businessName.charAt(0) || 'B'}
              </div>
            )}
            <span className="text-white font-semibold text-lg">
              {config.businessName || 'Your Business'}
            </span>
          </div>
          <div className="flex gap-6 text-white/90 text-sm">
            <span className="hover:text-white cursor-pointer">Home</span>
            <span className="hover:text-white cursor-pointer">Services</span>
            <span className="hover:text-white cursor-pointer">About</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>
        </nav>

        {/* Hero Section */}
        <section 
          className="relative py-24 px-8"
          style={{ 
            backgroundColor: config.secondaryColor,
            backgroundImage: config.heroImage ? `url(${config.heroImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {config.heroImage && (
            <div 
              className="absolute inset-0" 
              style={{ backgroundColor: `rgba(0,0,0,${stylePresets.heroOverlay})` }} 
            />
          )}
          <div className="relative z-10 max-w-3xl mx-auto text-center" style={{ fontFamily }}>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: config.heroImage ? 'white' : config.primaryColor }}
            >
              {config.businessName || 'Your Business Name'}
            </h1>
            {config.tagline && (
              <p 
                className="text-xl mb-8"
                style={{ color: config.heroImage ? 'white' : config.primaryColor, opacity: 0.9 }}
              >
                {config.tagline}
              </p>
            )}
            <button
              style={{ 
                backgroundColor: config.accentColor,
                borderRadius: stylePresets.buttonStyle === 'pill' ? '9999px' : 
                              stylePresets.buttonStyle === 'sharp' ? '0' : '8px',
                fontFamily
              }}
              className="px-8 py-3 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* About/Description Section */}
        {config.description && (
          <section className="py-16 px-8 bg-white" style={{ fontFamily }}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 
                className="text-2xl font-bold mb-6"
                style={{ color: config.primaryColor }}
              >
                About Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {config.description}
              </p>
            </div>
          </section>
        )}

        {/* Services Section */}
        {filteredServices.length > 0 && (
          <section 
            className="py-16 px-8"
            style={{ backgroundColor: config.secondaryColor + '40', fontFamily }}
          >
            <div className="max-w-5xl mx-auto">
              <h2 
                className="text-2xl font-bold text-center mb-12"
                style={{ color: config.primaryColor }}
              >
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 shadow-sm"
                    style={{ borderRadius: stylePresets.borderRadius }}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-xl"
                      style={{ backgroundColor: config.accentColor + '20', color: config.accentColor }}
                    >
                      {['🎯', '💡', '🚀', '⚡', '🔧', '📊'][index % 6]}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{service}</h3>
                    <p className="text-sm text-gray-500">
                      Professional {service.toLowerCase()} services tailored to your needs.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section */}
        {config.showPricing && (
          <section className="py-16 px-8 bg-white" style={{ fontFamily }}>
            <div className="max-w-5xl mx-auto">
              <h2 
                className="text-2xl font-bold text-center mb-12"
                style={{ color: config.primaryColor }}
              >
                Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Basic', 'Professional', 'Enterprise'].map((plan, index) => (
                  <div 
                    key={plan}
                    className={`p-6 border-2 ${index === 1 ? 'border-current' : 'border-gray-200'}`}
                    style={{ 
                      borderRadius: stylePresets.borderRadius,
                      borderColor: index === 1 ? config.primaryColor : undefined
                    }}
                  >
                    <h3 className="font-semibold text-lg mb-2">{plan}</h3>
                    <div className="text-3xl font-bold mb-4" style={{ color: config.primaryColor }}>
                      ${[99, 199, 399][index]}
                      <span className="text-sm font-normal text-gray-500">/mo</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 mb-6">
                      <li>✓ Feature one</li>
                      <li>✓ Feature two</li>
                      <li>✓ Feature three</li>
                    </ul>
                    <button
                      className="w-full py-2 text-sm font-medium"
                      style={{ 
                        backgroundColor: index === 1 ? config.primaryColor : 'transparent',
                        color: index === 1 ? 'white' : config.primaryColor,
                        border: `2px solid ${config.primaryColor}`,
                        borderRadius: stylePresets.buttonStyle === 'pill' ? '9999px' : 
                                      stylePresets.buttonStyle === 'sharp' ? '0' : '8px'
                      }}
                    >
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {config.showTestimonials && (
          <section 
            className="py-16 px-8"
            style={{ backgroundColor: config.secondaryColor + '40', fontFamily }}
          >
            <div className="max-w-5xl mx-auto">
              <h2 
                className="text-2xl font-bold text-center mb-12"
                style={{ color: config.primaryColor }}
              >
                What Our Clients Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Alex Johnson', text: 'Excellent service! Highly recommended.' },
                  { name: 'Sarah Miller', text: 'Professional and reliable. Will use again.' }
                ].map((testimonial, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 shadow-sm"
                    style={{ borderRadius: stylePresets.borderRadius }}
                  >
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ color: config.accentColor }}>★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">&quot;{testimonial.text}&quot;</p>
                    <div className="font-medium text-gray-900">— {testimonial.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="py-16 px-8 bg-white" style={{ fontFamily }}>
          <div className="max-w-3xl mx-auto">
            <h2 
              className="text-2xl font-bold text-center mb-12"
              style={{ color: config.primaryColor }}
            >
              Contact Us
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-4">
                {config.contactEmail && (
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.primaryColor + '15' }}
                    >
                      📧
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-gray-900">{config.contactEmail}</div>
                    </div>
                  </div>
                )}
                {config.contactPhone && (
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.primaryColor + '15' }}
                    >
                      📞
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-gray-900">{config.contactPhone}</div>
                    </div>
                  </div>
                )}
                {config.address && (
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.primaryColor + '15' }}
                    >
                      📍
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Address</div>
                      <div className="text-gray-900">{config.address}</div>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(config.socialLinks?.facebook || config.socialLinks?.instagram || 
                  config.socialLinks?.twitter || config.socialLinks?.linkedin) && (
                  <div className="flex gap-3 mt-6">
                    {config.socialLinks.facebook && (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: config.primaryColor, color: 'white' }}
                      >f</div>
                    )}
                    {config.socialLinks.instagram && (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: config.primaryColor, color: 'white' }}
                      >📷</div>
                    )}
                    {config.socialLinks.twitter && (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: config.primaryColor, color: 'white' }}
                      >𝕏</div>
                    )}
                    {config.socialLinks.linkedin && (
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: config.primaryColor, color: 'white' }}
                      >in</div>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Form */}
              {config.showContactForm && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none"
                    style={{ borderRadius: stylePresets.borderRadius }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none"
                    style={{ borderRadius: stylePresets.borderRadius }}
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none resize-none"
                    style={{ borderRadius: stylePresets.borderRadius }}
                  />
                  <button
                    className="w-full py-3 text-white font-medium"
                    style={{ 
                      backgroundColor: config.primaryColor,
                      borderRadius: stylePresets.buttonStyle === 'pill' ? '9999px' : 
                                    stylePresets.buttonStyle === 'sharp' ? '0' : '8px'
                    }}
                  >
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="py-8 px-8 text-center"
          style={{ backgroundColor: config.primaryColor, fontFamily }}
        >
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} {config.businessName || 'Your Business'}. All rights reserved.
          </p>
        </footer>
        </div>
      </div>
    </div>
  )
}
