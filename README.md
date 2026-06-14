# 💸 Expensify — Personal Finance Tracker

A sleek, modern personal finance tracker built with React + Vite. Track your expenses, monitor refunds, visualise spending breakdowns, and manage your paydays — all from a beautiful dark-themed dashboard.

![Expensify Dashboard](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite) ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase) ![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Google Auth** | Sign in with Google via Firebase Authentication, or use Guest mode |
| 📊 **Dashboard** | Live balance, spending summary, category breakdown charts (Recharts) |
| 💳 **Spending Tracker** | Add, categorise, search, and delete expenses |
| 🔄 **Refunds Manager** | Track pending and fulfilled refunds with status toggles |
| 📅 **Calendar View** | Monthly calendar with expense and payday events |
| 🎨 **Theming** | Dark / Light mode with customisable accent colour |
| 💾 **Persistent Storage** | Data saved to `localStorage` (per-user key, Guest is session-only) |
| 📤 **Excel Export** | Export Expenses, Refunds, and Paydays to `.xlsx` with one click |
| ⚙️ **Settings** | Display name, avatar colour, currency, date format, compact mode, animations, and more |
| 🌊 **Liquid Background** | Animated WebGL-style background (toggleable) |

---

## 🛠 Tech Stack

- **React 19** + **Vite 8** — blazing-fast dev server and build
- **React Router v7** — client-side routing
- **Firebase 12** — Google Authentication
- **Recharts 3** — interactive charts for spending analytics
- **date-fns 4** — date formatting and manipulation
- **lucide-react** — icon library
- **xlsx** — Excel file export
- **Tailwind CSS 4** — utility-first styling (dev tooling)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/AbhimanyuDhanwadia/expensify.git
cd expensify
npm install
```

### Environment Variables

Create a `.env.local` file in the project root. These values come from your [Firebase Console](https://console.firebase.google.com/):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Without Firebase credentials**, the app runs in demo mode — the "Sign in with Google" button falls back gracefully to a demo user, so all features are still accessible.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LiquidBackground.jsx   # Animated canvas background
│   ├── ProfileMenu.jsx        # User avatar dropdown
│   ├── SettingsModal.jsx      # Full settings panel
│   └── Sidebar.jsx            # Navigation + balance display
├── hooks/
│   ├── useLocalStorage.js     # Auth-aware persistent state hook
│   └── useTheme.js            # Dark/light theme toggle hook
├── views/
│   ├── Landing.jsx            # Sign-in / landing page
│   ├── Dashboard.jsx          # Overview with charts & summary cards
│   ├── Spending.jsx           # Expense list + add form
│   ├── Refunds.jsx            # Refunds tracker
│   └── Calendar.jsx           # Monthly calendar with events
├── firebase.js                # Firebase app initialisation
├── App.jsx                    # Root component + global state
├── App.css                    # Component-scoped styles
├── index.css                  # Global design tokens & utilities
└── main.jsx                   # React entry point
```

---

## 🔧 Configuration

All user preferences are saved automatically via `localStorage`:

| Setting | Options |
|---|---|
| Theme | Dark / Light |
| Accent Colour | Any hex colour |
| Currency | USD, EUR, GBP, INR, JPY, CAD, AUD |
| Date Format | `yyyy-MM-dd`, `MM/dd/yyyy`, `dd/MM/yyyy`, `dd MMM yyyy` |
| Monthly Budget | Custom amount |
| Compact Mode | Reduces padding and font sizes |
| Animations | Enable / disable all transitions |
| Liquid Background | Toggle the animated background |
| Blur Amounts | Privacy mode — blurs all monetary values |

---

## 📸 Screenshots

> The app ships with seed data so you can explore all features without adding anything manually.

- **Dashboard** — balance card, spending breakdown donut, category list, recent transactions
- **Spending** — filterable/searchable expense table with category badges
- **Refunds** — pending vs fulfilled refund tracker
- **Calendar** — payday and expense events on a monthly grid

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using React + Vite</p>
