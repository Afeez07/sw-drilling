# SW Drilling 💧
[![Deployed with Vercel](https://vercelbadge.vercel.app/api/Afeez07/sw-drilling)](https://sw-drilling.vercel.app)

A modern, high-performance landing page and web application for **SW Drilling**, Nigeria's premier water solutions provider. The platform specializes in showcasing professional borehole drilling, geophysical surveys, and water treatment services.

## ✨ Features
- **Modern Glassmorphism UI**: Beautiful, premium aesthetic with smooth micro-animations.
- **Fully Responsive**: Optimized flawlessly for Desktop, Tablet, and Mobile displays.
- **Quote Request Engine**: Integrated email delivery system powered by **Resend** and **Vercel Serverless Functions**.
- **Performance Optimized**: Vanilla JavaScript and CSS for lightning-fast load times.
- **Accessibility (a11y) First**: Screen-reader friendly, semantic HTML, and fully keyboard navigable.

## 🚀 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend / API**: Node.js (Vercel Serverless Functions)
- **Email Delivery**: Resend API
- **Deployment**: Vercel

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Afeez07/sw-drilling.git
   cd sw-drilling
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Resend API key:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```

3. **Run the Vercel Development Server:**
   ```bash
   npx vercel dev
   ```
   *The server will start at `http://localhost:3000`.*

## 🛡️ Security & Architecture
- **Sanitized Inputs**: All user inputs from the quote form are sanitized on the backend before being processed.
- **Serverless Edge**: API routes are decoupled from the static frontend, ensuring security of API keys and credentials.

---
*Designed & Developed for SW Drilling.*
