import { WebsiteConfig } from '@/types'

export function generateWebsiteHTML(config: WebsiteConfig): string {
  const getFontFamily = () => {
    switch (config.fontStyle) {
      case 'serif': return "'Georgia', 'Times New Roman', serif"
      case 'modern': return "'Inter', 'SF Pro Display', system-ui, sans-serif"
      default: return "'Inter', 'Helvetica Neue', Arial, sans-serif"
    }
  }

  const getButtonRadius = () => {
    switch (config.designStyle) {
      case 'classic': return '4px'
      case 'minimal':
      case 'bold': return '0'
      case 'friendly': return '9999px'
      default: return '8px'
    }
  }

  const getCardRadius = () => {
    switch (config.designStyle) {
      case 'classic': return '4px'
      case 'minimal':
      case 'bold': return '0'
      case 'friendly': return '16px'
      default: return '8px'
    }
  }

  const filteredServices = config.services.filter(s => s.trim())
  const serviceIcons = ['🎯', '💡', '🚀', '⚡', '🔧', '📊']

  const socialLinksHTML = () => {
    const links = []
    if (config.socialLinks?.facebook) {
      links.push(`<a href="${config.socialLinks.facebook}" target="_blank" rel="noopener" class="social-link">f</a>`)
    }
    if (config.socialLinks?.instagram) {
      links.push(`<a href="${config.socialLinks.instagram}" target="_blank" rel="noopener" class="social-link">📷</a>`)
    }
    if (config.socialLinks?.twitter) {
      links.push(`<a href="${config.socialLinks.twitter}" target="_blank" rel="noopener" class="social-link">𝕏</a>`)
    }
    if (config.socialLinks?.linkedin) {
      links.push(`<a href="${config.socialLinks.linkedin}" target="_blank" rel="noopener" class="social-link">in</a>`)
    }
    return links.length > 0 ? `<div class="social-links">${links.join('')}</div>` : ''
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${config.tagline || config.description?.slice(0, 160) || config.businessName}">
  <title>${config.businessName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${getFontFamily()};
      line-height: 1.6;
      color: #333;
    }
    
    a {
      text-decoration: none;
      color: inherit;
    }
    
    /* Navigation */
    .nav {
      background-color: ${config.primaryColor};
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .nav-logo {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.25rem;
    }
    
    .nav-logo img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .nav-title {
      color: white;
      font-weight: 600;
      font-size: 1.125rem;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-links a {
      color: rgba(255,255,255,0.9);
      font-size: 0.875rem;
      transition: color 0.2s;
    }
    
    .nav-links a:hover {
      color: white;
    }
    
    /* Hero Section */
    .hero {
      background-color: ${config.secondaryColor};
      ${config.heroImage ? `background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${config.heroImage}');` : ''}
      background-size: cover;
      background-position: center;
      padding: 6rem 2rem;
      text-align: center;
    }
    
    .hero-content {
      max-width: 48rem;
      margin: 0 auto;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: ${config.heroImage ? 'white' : config.primaryColor};
    }
    
    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: ${config.heroImage ? 'white' : config.primaryColor};
      opacity: 0.9;
    }
    
    .btn-primary {
      display: inline-block;
      background-color: ${config.accentColor};
      color: white;
      padding: 0.75rem 2rem;
      border-radius: ${getButtonRadius()};
      font-weight: 500;
      transition: opacity 0.2s;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .btn-primary:hover {
      opacity: 0.9;
    }
    
    .btn-outline {
      display: inline-block;
      background-color: transparent;
      color: ${config.primaryColor};
      padding: 0.5rem 1.5rem;
      border: 2px solid ${config.primaryColor};
      border-radius: ${getButtonRadius()};
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 0.875rem;
    }
    
    .btn-outline:hover {
      background-color: ${config.primaryColor};
      color: white;
    }
    
    /* Sections */
    .section {
      padding: 4rem 2rem;
    }
    
    .section-alt {
      background-color: ${config.secondaryColor}40;
    }
    
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
      color: ${config.primaryColor};
    }
    
    .container {
      max-width: 72rem;
      margin: 0 auto;
    }
    
    .text-center {
      text-align: center;
    }
    
    /* About Section */
    .about-text {
      max-width: 48rem;
      margin: 0 auto;
      text-align: center;
      color: #666;
      line-height: 1.8;
    }
    
    /* Services Grid */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .service-card {
      background: white;
      padding: 1.5rem;
      border-radius: ${getCardRadius()};
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .service-icon {
      width: 48px;
      height: 48px;
      background: ${config.accentColor}20;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: ${config.accentColor};
    }
    
    .service-card h3 {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }
    
    .service-card p {
      font-size: 0.875rem;
      color: #666;
    }
    
    /* Pricing */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .pricing-card {
      padding: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: ${getCardRadius()};
      background: white;
    }
    
    .pricing-card.featured {
      border-color: ${config.primaryColor};
    }
    
    .pricing-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .pricing-card .price {
      font-size: 2rem;
      font-weight: 700;
      color: ${config.primaryColor};
      margin-bottom: 1rem;
    }
    
    .pricing-card .price span {
      font-size: 0.875rem;
      font-weight: normal;
      color: #666;
    }
    
    .pricing-card ul {
      list-style: none;
      margin-bottom: 1.5rem;
    }
    
    .pricing-card li {
      font-size: 0.875rem;
      color: #666;
      padding: 0.25rem 0;
    }
    
    .pricing-card li::before {
      content: "✓ ";
      color: ${config.accentColor};
    }
    
    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .testimonial-card {
      background: white;
      padding: 1.5rem;
      border-radius: ${getCardRadius()};
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .stars {
      color: ${config.accentColor};
      margin-bottom: 1rem;
    }
    
    .testimonial-card blockquote {
      font-style: italic;
      color: #666;
      margin-bottom: 1rem;
    }
    
    .testimonial-card cite {
      font-style: normal;
      font-weight: 500;
      color: #1a1a1a;
    }
    
    /* Contact */
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .contact-icon {
      width: 40px;
      height: 40px;
      background: ${config.primaryColor}15;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .contact-text small {
      font-size: 0.75rem;
      color: #666;
    }
    
    .contact-text div {
      color: #1a1a1a;
    }
    
    .social-links {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    
    .social-link {
      width: 40px;
      height: 40px;
      background: ${config.primaryColor};
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }
    
    .social-link:hover {
      opacity: 0.8;
    }
    
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .contact-form input,
    .contact-form textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: ${getCardRadius()};
      font-family: inherit;
      font-size: 1rem;
    }
    
    .contact-form input:focus,
    .contact-form textarea:focus {
      outline: none;
      border-color: ${config.primaryColor};
      box-shadow: 0 0 0 3px ${config.primaryColor}20;
    }
    
    .contact-form textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .contact-form button {
      width: 100%;
      background: ${config.primaryColor};
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: ${getButtonRadius()};
      font-weight: 500;
      cursor: pointer;
      font-size: 1rem;
      transition: opacity 0.2s;
    }
    
    .contact-form button:hover {
      opacity: 0.9;
    }
    
    /* Footer */
    .footer {
      background: ${config.primaryColor};
      padding: 2rem;
      text-align: center;
    }
    
    .footer p {
      color: rgba(255,255,255,0.8);
      font-size: 0.875rem;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .nav {
        flex-direction: column;
        text-align: center;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .hero p {
        font-size: 1rem;
      }
      
      .section {
        padding: 3rem 1rem;
      }
    }
    
    /* Custom Images */
    .custom-image {
      position: absolute;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 100%;
    }
    
    .custom-images-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
    }
    
    .custom-image img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-brand">
      ${config.logoUrl 
        ? `<div class="nav-logo"><img src="${config.logoUrl}" alt="${config.businessName} logo"></div>` 
        : `<div class="nav-logo">${config.businessName.charAt(0)}</div>`}
      <span class="nav-title">${config.businessName}</span>
    </div>
    <div class="nav-links">
      <a href="#home">Home</a>
      ${filteredServices.length > 0 ? '<a href="#services">Services</a>' : ''}
      ${config.description ? '<a href="#about">About</a>' : ''}
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="home" class="hero">
    <div class="hero-content">
      <h1>${config.businessName}</h1>
      ${config.tagline ? `<p>${config.tagline}</p>` : ''}
      <a href="#contact" class="btn-primary">Get Started</a>
    </div>
  </section>

  ${config.description ? `
  <!-- About Section -->
  <section id="about" class="section">
    <div class="container">
      <h2 class="section-title">About Us</h2>
      <p class="about-text">${config.description}</p>
    </div>
  </section>
  ` : ''}

  ${filteredServices.length > 0 ? `
  <!-- Services Section -->
  <section id="services" class="section section-alt">
    <div class="container">
      <h2 class="section-title">Our Services</h2>
      <div class="services-grid">
        ${filteredServices.map((service, index) => `
        <div class="service-card">
          <div class="service-icon">${serviceIcons[index % serviceIcons.length]}</div>
          <h3>${service}</h3>
          <p>Professional ${service.toLowerCase()} services tailored to your needs.</p>
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  ${config.showPricing ? `
  <!-- Pricing Section -->
  <section id="pricing" class="section">
    <div class="container">
      <h2 class="section-title">Pricing</h2>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Basic</h3>
          <div class="price">$99<span>/mo</span></div>
          <ul>
            <li>Feature one</li>
            <li>Feature two</li>
            <li>Feature three</li>
          </ul>
          <button class="btn-outline" style="width:100%">Choose Plan</button>
        </div>
        <div class="pricing-card featured">
          <h3>Professional</h3>
          <div class="price">$199<span>/mo</span></div>
          <ul>
            <li>Feature one</li>
            <li>Feature two</li>
            <li>Feature three</li>
          </ul>
          <button class="btn-primary" style="width:100%">Choose Plan</button>
        </div>
        <div class="pricing-card">
          <h3>Enterprise</h3>
          <div class="price">$399<span>/mo</span></div>
          <ul>
            <li>Feature one</li>
            <li>Feature two</li>
            <li>Feature three</li>
          </ul>
          <button class="btn-outline" style="width:100%">Choose Plan</button>
        </div>
      </div>
    </div>
  </section>
  ` : ''}

  ${config.showTestimonials ? `
  <!-- Testimonials Section -->
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">What Our Clients Say</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <blockquote>"Excellent service! Highly recommended."</blockquote>
          <cite>— Alex Johnson</cite>
        </div>
        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <blockquote>"Professional and reliable. Will use again."</blockquote>
          <cite>— Sarah Miller</cite>
        </div>
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Contact Section -->
  <section id="contact" class="section">
    <div class="container">
      <h2 class="section-title">Contact Us</h2>
      <div class="contact-grid">
        <div class="contact-info">
          ${config.contactEmail ? `
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <div class="contact-text">
              <small>Email</small>
              <div>${config.contactEmail}</div>
            </div>
          </div>
          ` : ''}
          ${config.contactPhone ? `
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div class="contact-text">
              <small>Phone</small>
              <div>${config.contactPhone}</div>
            </div>
          </div>
          ` : ''}
          ${config.address ? `
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-text">
              <small>Address</small>
              <div>${config.address}</div>
            </div>
          </div>
          ` : ''}
          ${socialLinksHTML()}
        </div>
        ${config.showContactForm ? `
        <form class="contact-form" onsubmit="event.preventDefault(); alert('Message sent! (Demo)');">
          <input type="text" placeholder="Your Name" required>
          <input type="email" placeholder="Your Email" required>
          <textarea placeholder="Your Message" rows="4" required></textarea>
          <button type="submit">Send Message</button>
        </form>
        ` : ''}
      </div>
    </div>
  </section>

  <!-- Custom Images -->
  ${config.images && config.images.length > 0 ? `
  <div class="custom-images-container">
    ${config.images.map(img => `
    <div class="custom-image" style="left: ${img.x}%; top: ${img.y}px; width: ${img.width}px; z-index: ${img.zIndex + 50};">
      <img src="${img.url}" alt="Custom image">
    </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Footer -->
  <footer class="footer">
    <p>© ${new Date().getFullYear()} ${config.businessName}. All rights reserved.</p>
  </footer>
</body>
</html>`
}

export function downloadWebsiteHTML(config: WebsiteConfig) {
  const html = generateWebsiteHTML(config)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${config.businessName.toLowerCase().replace(/\s+/g, '-')}-website.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  
  URL.revokeObjectURL(url)
}
