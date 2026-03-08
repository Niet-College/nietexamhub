# NIET Exam & PPT Hub

A modern, fast, and comprehensive web-based platform for searching, viewing, downloading, and uploading NIET (Noida Institute of Engineering and Technology) exam papers and study materials (PPTs).

## 🌐 Live Website

**Production App:** [nietexamhub.bugmein.me](https://nietexamhub.bugmein.me/)

## 📋 Overview

NIET Exam Hub was built to centralize study materials for students. Following the latest updates, it handles both PDFs (Exam/COP Papers) and PPTs (Presentations), all searchable via a blazing fast local index.

### Key Capabilities
- **Exam Mode / PPT Mode** - Toggle seamlessly between raw previous year papers and teacher presentations.
- **Appwrite Backend** - Users can actively upload new resources via a protected drag-and-drop UI, which saves metadata dynamically.
- **Fuzzy Search** - Find materials instantly using `Fuse.js` (e.g. search by subject name, code, or even faculty name).
- **Dark Mode Support** - Fully styled with TailwindCSS and `shadcn/ui` for beautiful light/dark UI themes.
- **Single & Bulk Uploads** - Includes visual progress tracking.

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI Framework:** Tailwind CSS, shadcn/ui components
- **Icons & Animation:** Lucide React, Framer Motion
- **Backend & Storage:** Appwrite Cloud (Database & Buckets)
- **Search Engine:** Fuse.js
- **Routing:** React Router v6
- **Deployment:** GitHub Actions -> GitHub Pages

## 🚀 Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamawanishmaurya/niet-exam-hub-ui.git
   cd niet-exam-hub-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   *(Ensure you have your Appwrite endpoint and Project ID configured in `src/lib/appwrite.ts`)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` (or the port Vite provides) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```
   The output will be generated in the `dist/` directory.

## 🚢 Deployment

This project uses an automated CI/CD pipeline. Pushing to the `main` branch automatically triggers a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) that builds the Vite app and force-pushes the `dist/` folder to the `gh-pages` branch. The site goes live on the mapped custom domain shortly after.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Wiki

Check out our [GitHub Wiki](https://github.com/Niet-College/niet-exam-hub-ui/wiki) for more detailed documentation on architecture, API design, and contribution guidelines.

---

**Last Updated:** March 2026  
**Project Status:** Active Development
