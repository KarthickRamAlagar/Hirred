# 💼 Hired — Smart Job Portal for Job Seekers & Recruiters

<p align="center">
  <img src="public/HomeScreen.png" alt="Hired Banner" width="100%" />
</p>

<div style="text-align: center; margin-top: 2px;">
  <img src="https://img.shields.io/badge/-Vite_7-black?style=for-the-badge&logo=vite&logoColor=white&color=646CFF" alt="vite" />
  <img src="https://img.shields.io/badge/-React_19-black?style=for-the-badge&logo=react&logoColor=white&color=61DAFB" alt="react.js" />
  <img src="https://img.shields.io/badge/-TailwindCSS_3-black?style=for-the-badge&logo=tailwindcss&logoColor=white&color=38BDF8" alt="tailwindcss" />
  <img src="https://img.shields.io/badge/-Supabase-black?style=for-the-badge&logo=supabase&logoColor=white&color=3FCF8E" alt="supabase" />
  <img src="https://img.shields.io/badge/-Clerk_Auth-black?style=for-the-badge&logo=clerk&logoColor=white&color=5C6BC0" alt="clerk" />
  <img src="https://img.shields.io/badge/-Shadcn_UI-black?style=for-the-badge&logo=ui&logoColor=white&color=7C4DFF" alt="shadcn" />
  <img src="https://img.shields.io/badge/-Markdown_Editor-black?style=for-the-badge&logo=markdown&logoColor=white&color=000000" alt="Markdown Editor" />
  <img src="https://img.shields.io/badge/-Role_Based_Access-black?style=for-the-badge&logo=security&logoColor=white&color=FF6F61" alt="Role Based Access" />
  <img src="https://img.shields.io/badge/-Zustand-black?style=for-the-badge&logo=zustand&logoColor=white&color=6C63FF" alt="zustand" />
</div>

<div align="center">
  <h3>
    Hired is a modern, responsive job board that connects recruiters and job seekers. Built with a scalable architecture and modern UI/UX for real-world usability.
  </h3>
  <p><a href="https://your-deployed-link.com" target="_blank">🚀 <strong>Live Demo</strong></a></p>
</div>

---

## 📋 Table of Contents

1. [Introduction](#-introduction)
2. [Architecture Flow Diagrams](#-architecture-flow-diagrams)
3. [Tech Stack](#-tech-stack)
4. [Features](#-features)
5. [Quick Start](#-quick-start)
6. [Installation](#-installation)
7. [License](#-license)
8. [Acknowledgements](#-acknowledgements)

---

### 🚀 Introduction

**Hired** is a full-stack job board platform enabling seamless job discovery, application management, and recruiter interactions. It includes:

- Secure authentication via Clerk
- Realtime database integration with Supabase
- Tailored user dashboards for job seekers and employers
- Optimized for speed and accessibility using Vite and TailwindCSS

---

### 🏗 Architecture Flow Diagrams

<p align="center">
  <img src="public/F1.png" alt="Hired Banner" width="70%"  height="50%"  />
  <img src="public/F2.png" alt="Hired Banner" width="70%" height="50%" />
</p>

---

### 🔧 Tech Stack

- ⚛ **React 19** — UI library with concurrent rendering
- ⚡ **Vite 7** — Fast, modern build tool
- 🌈 **TailwindCSS 3.3** — Utility-first styling
- 📦 **Shadcn UI** — Accessible component system with Radix primitives
- 🔐 **Clerk** — Full-stack authentication for React
- 🧰 **Supabase** — Realtime database and backend-as-a-service
- 🧪 **Zod & React Hook Form** — Schema-based validation
- 📄 **React Router DOM 7** — Declarative routing
- 🎡 **Embla Carousel** — For scrollable sliders
- 🔍 **Lucide Icons** — Elegant icon set

---

## ⚙ Features

- 🧑‍💼 Role-based dashboards (Recruiter & Job Seeker)
- 💾 Save and apply for jobs with pagination
- 🔐 Secure login/signup with Clerk
- 🧭 Location autocomplete (Country-State-City)
- 💼 Recruiter job management: create, edit, delete
- 📊 Visual feedback via loaders and pagination controls
- 🎨 Responsive, accessible UI with Shadcn + Tailwind

---

## ⚡ Quick Start

### 📦 Prerequisites

- Node.js ≥ 18.x
- npm, pnpm, or yarn
- Supabase project setup
- Clerk project setup

---

## 🛠️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/hired.git
cd hired
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

### Environmental Variables (.env)

```bash
VITE_SUPABASE_URL= Your_URL
VITE_SUPABASE_ANON_KEY= Your_Key
VITE_CLERK_PUBLISHABLE_KEY= You_Key
```

### License

This project is licensed under the MIT License.
Feel free to use, modify, and distribute it for personal or commercial projects.

Acknowledgements

- React
- Vite
- Tailwind CSS
- Supabase
- Clerk
- Shadcn UI
- Zod
- React Hook Form
- Embla Carousel
