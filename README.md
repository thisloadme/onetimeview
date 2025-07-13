# 🔐 OneTimeView - Secure Document Sharing Platform

> **Share sensitive documents with confidence. Control who sees your content and when it expires.**

OneTimeView is a modern, secure document sharing platform built for professionals who need to share confidential information with controlled access. Perfect for consultants, HR professionals, researchers, and developers who value security and privacy.

## ✨ Key Features

### 🔒 **Secure by Design**
- **One-time access links** - Documents automatically expire after set number of views
- **Time-based expiration** - Set custom expiration times (1 hour to 1 week)
- **No permanent exposure** - Links become invalid after access limit is reached
- **Access tracking** - Monitor who accessed your documents and when

### 📝 **Rich Markdown Editor**
- **Live preview** - See your formatted content in real-time
- **Professional formatting** - Support for headers, lists, links, code blocks
- **Clean interface** - Distraction-free writing experience
- **Responsive design** - Works perfectly on desktop and mobile

### 🎯 **Perfect for Professionals**

#### 👔 **Consultants**
Share confidential proposals and strategic documents with clients. Control access to sensitive business information and ensure proposals remain private until decisions are made.

#### 👥 **HR Professionals**
Send employment contracts and sensitive HR documents securely. Ensure candidates can only view their contracts once and maintain confidentiality throughout the hiring process.

#### 🔬 **Researchers**
Share draft papers and research findings with collaborators. Control who sees your work and when, ensuring your research remains confidential until publication.

#### 💻 **Developers**
Share internal documentation and technical specifications securely. Control access to sensitive code documentation and ensure only authorized team members can view internal resources.

## 🚀 How It Works

### 1. **Create Your Document**
Write your content using our intuitive markdown editor. Format text, add links, and create beautiful documents.

### 2. **Set Access Limits**
Choose how many times your document can be viewed and when the link should expire.

### 3. **Share Securely**
Get a unique link and share it. The document will be automatically removed after the access limit is reached.

## 🛠️ Technology Stack

- **Frontend:** Nuxt 3, Vue 3, Tailwind CSS
- **Backend:** Nuxt Server API, MongoDB, Mongoose
- **Authentication:** JWT with secure cookies
- **Markdown:** Marked.js for rendering
- **Styling:** Tailwind CSS with custom dark theme

## 📊 Features Overview

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Links** | One-time access with automatic expiration |
| 📝 **Markdown Support** | Rich text formatting with live preview |
| 👥 **User Management** | Secure registration and authentication |
| 📈 **Access Analytics** | Track who accessed your documents |
| 🎨 **Dark Theme** | Modern, eye-friendly interface |
| 📱 **Responsive** | Works on all devices |
| ⚡ **Fast** | Optimized for performance |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thisloadme/onetimeview.git
   cd onetimeview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

```env
# Database
MONGO_URI=mongodb://localhost:27017/onetimeview

# Security
JWT_SECRET=your-super-secret-jwt-key

# Environment
NODE_ENV=development
```

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
onetimeview/
├── components/          # Reusable Vue components
│   ├── MarkdownEditor.vue
│   ├── ShareModal.vue
│   ├── AccessHistoryModal.vue
│   └── DocumentCard.vue
├── pages/              # Nuxt pages
│   ├── dashboard.vue   # Main dashboard
│   ├── create.vue      # Create document
│   ├── edit/[id].vue   # Edit document
│   └── view/[token].vue # Public view
├── server/             # API endpoints
│   ├── api/           # REST API routes
│   ├── models/        # MongoDB models
│   └── utils/         # Server utilities
└── middleware/        # Authentication middleware
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nuxt 3](https://nuxt.com/) - The Vue framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Marked.js](https://marked.js.org/) - Markdown parser

---

<div align="center">

**Made with ❤️ for secure document sharing**

[![Nuxt](https://img.shields.io/badge/Nuxt-3.0.0-00DC82?style=for-the-badge&logo=nuxt.js)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.0.0-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>
