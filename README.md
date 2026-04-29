# 📦 Inventory Management System (IMS)

A modern, full-stack Inventory Management System designed for efficiency and ease of use. This system features real-time stock tracking, professional invoice generation, and automated customer notifications.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql)

## ✨ Key Features

- **🚀 Real-time Inventory**: Track products, categories, and batches with automatic FIFO (First-In-First-Out) stock reduction.
- **📄 Professional Invoices**: Generate professional PDF receipts automatically for every transaction.
- **🤖 Telegram Integration**: Instant customer notifications via Telegram, including text summaries and PDF attachments.
- **👥 Role-Based Access**: Secure authentication with JWT tokens and separate roles for `Admin` and `Staff`.
- **📊 Financial Tracking**: Manage customer ledgers, pending balances (Udhari), and transaction history.
- **📈 Business Reports**: Gain insights with automated reporting on sales and inventory levels.

## 🛠️ Technology Stack

- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL, Pydantic.
- **Frontend**: React (Vite), TailwindCSS, Lucide Icons, Recharts.
- **Infrastructure**: Render (Deployment), Neon.tech (Database), Telegram Bot API.

## 🚀 Quick Start (Local Development)

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn app.main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🌐 Deployment

The project is optimized for one-click deployment on **Render**.

### Environment Variables
| Key | Description |
|-----|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key |
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather |
| `VITE_API_URL` | Backend URL for the frontend |

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
