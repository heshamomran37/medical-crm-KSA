# Medical CRM Dashboard

A modern, fast, and secure Medical CRM built with Next.js 15, Prisma, and PostgreSQL. Designed for clinics to manage patients, employees, and communications efficiently.

## 🚀 Features

- **Patient Management**: Complete CRM for tracking patient records and history.
- **Employee Portal**: Role-based access for staff and administrators.
- **WhatsApp Integration**: Dashboard for managing communications.
- **Bi-lingual Support**: Full Arabic (RTL) and English (LTR) support.
- **Activity Logging**: Track every critical action in the system.
- **Data Export/Import**: Secure backup and restore for employee data.
- **Mobile Responsive**: Stunning UI that works on all devices.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS & Lucide Icons
- **Deployment**: Dockerized & Vercel-ready

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- Docker (optional, but recommended)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/medical-app.git
   cd medical-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your `DATABASE_URL` and `AUTH_SECRET`.

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## 🐳 Docker Setup

Run the entire stack with a single command:
```bash
docker-compose up -d
```
The app will be available at `http://localhost:3000`.

## 📄 License

MIT License.
