# NeoCortex AI - Landing Page

Transform Claude Code into Your AI Command Center with persistent memory, thinking mechanisms, and web GUI.

## 🚀 Live Website

**Website**: [neocortexai.dev](https://neocortexai.dev)
**Repository**: Standalone website for NeoCortex AI early access waitlist

## 📝 Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Netlify Forms**: Serverless form handling with spam protection
- **Email Integration**: Connected to Resend for automated email marketing
- **US Compliance**: CCPA/CAN-SPAM compliant consent mechanisms
- **Performance Optimized**: Single HTML file with embedded CSS and minimal JavaScript

## 🔧 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with Tailwind-inspired utilities
- **Forms**: Netlify Forms with honeypot spam protection
- **Fonts**: Google Fonts (Inter + JetBrains Mono)
- **Icons**: Inline SVG icons (Lucide React style)
- **Hosting**: Netlify with automatic deployments

## 📋 Form Fields

The waitlist form collects:

1. **Full Name** (required)
2. **Email Address** (required, validated)
3. **Claude Code Usage** (required radio: Yes/No)
4. **Email Consent** (required checkbox with legal compliance text)

## ⚖️ Legal Compliance

- **US Email Marketing Laws**: CAN-SPAM Act compliant
- **Consent Language**: Clear opt-in with unsubscribe rights
- **Privacy Policy**: Links to privacy policy (create separately)
- **Terms of Service**: Links to terms (create separately)

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**: Link this repo to Netlify
2. **Build Settings**:
   - Build command: (none needed)
   - Publish directory: `/` (root)
3. **Domain**: Connect `neocortexai.dev` custom domain
4. **Form Handling**: Automatically enabled via `netlify` attribute

### Environment Variables

No environment variables needed for the static site. Form submissions are handled by Netlify's built-in form processing.

## 📧 Email Integration

### Netlify Forms + Resend Webhook

1. **Netlify Form Submissions**: Collected automatically
2. **Webhook Setup**: Configure Netlify webhook to send to Resend
3. **Email Templates**: Welcome emails sent via Resend API
4. **Admin Notifications**: Admins notified of new signups

### Webhook Endpoint

```bash
# Webhook URL for Netlify -> Resend integration
POST https://your-webhook-service.com/netlify-form-submit

# Payload includes:
{
  "name": "User's full name",
  "email": "user@example.com",
  "uses_claude_code": "yes" | "no",
  "consent_emails": "true"
}
```

## 📊 Analytics Setup

Recommended analytics tools:

- **Google Analytics 4**: Track page views and form submissions
- **Netlify Analytics**: Built-in traffic analytics
- **Hotjar/Clarity**: User behavior tracking (optional)

## 🔗 Links to Update

Before going live, update these placeholder links:

- [ ] Privacy Policy URL: `/privacy`
- [ ] Terms of Service URL: `/terms`
- [ ] GitHub Repository: Update GitHub link to actual repo
- [ ] Social Media: Add social media links if needed

## 📁 File Structure

```
website-standalone/
├── index.html          # Main landing page
├── README.md           # This file
└── netlify.toml        # Netlify configuration (optional)
```

## 🚀 Going Live Checklist

- [ ] Update domain in Netlify
- [ ] Configure custom domain `neocortexai.dev`
- [ ] Set up SSL certificate (automatic with Netlify)
- [ ] Test form submissions
- [ ] Configure Resend webhook
- [ ] Create Privacy Policy and Terms pages
- [ ] Set up Google Analytics
- [ ] Test email delivery
- [ ] Update GitHub repository links

## 📞 Support

For technical issues with the website:
- **Repository Issues**: Create GitHub issues for bugs/improvements
- **Email**: Technical support via form submissions

---

**NeoCortex AI** - Supercharging Claude Code for everyone.