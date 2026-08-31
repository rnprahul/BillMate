# 🧾 BillMate — Digital Receipt Generator

**BillMate** is a modern, privacy-focused digital receipt generator designed for small businesses, freelancers, local shops, and independent professionals.

Create professional receipts, automatically calculate taxes and GST, manage customers and receipts, customize templates, and print or download receipts — all directly from your browser.

## 🌐 Live Demo

[BillMate Live Demo](https://billmate-beta.vercel.app/?utm_source=chatgpt.com)

## 📦 Repository

[BillMate on GitHub](https://github.com/rnprahul/BillMate?utm_source=chatgpt.com)

---

## ✨ Features

### 🧾 Receipt Creation

* Create professional digital receipts
* Automatically generate receipt numbers
* Add multiple products or services
* Quantity × unit price calculations
* Add descriptions and pricing details
* Select currency and payment method

### 💰 Automatic Calculations

* Subtotal calculation
* Percentage or fixed discounts
* Tax calculation
* GST support
* CGST + SGST
* IGST
* GST inclusive/exclusive modes
* Partial payment calculation
* Balance due calculation
* Accurate monetary formatting

### 👤 Customer Management

* Save customer information
* Reuse saved customers
* Edit customer details
* Delete customers
* Search customers
* Track customer receipt history

### 🏢 Business Management

* Business profile
* Business address
* Contact information
* GSTIN / Tax ID
* Business logo
* Default receipt settings
* Receipt numbering configuration

### 🎨 Receipt Templates

Choose from multiple professional templates:

* **Classic**
* **Modern**
* **Minimal**

Templates automatically adapt to the receipt data.

### 🖨️ Print & PDF

* Print professional receipts
* Save receipts as PDF through browser printing
* A4 receipt layout
* Thermal receipt layout
* Print-specific styling
* Application controls are hidden during printing

### 📊 Dashboard

The dashboard provides an overview of:

* Total receipts
* Monthly sales
* Total sales
* Saved customers
* Recent receipts
* Quick actions

### 📁 Receipt Management

* View saved receipts
* Edit receipts
* Duplicate receipts
* Delete receipts
* Search receipts
* Filter receipts
* Sort receipts

### 💾 Local Data Storage

BillMate uses browser-based storage for application data.

Saved locally:

* Receipts
* Customers
* Business information
* Preferences
* Settings

No backend database is required.

### 🔐 Privacy Focused

BillMate is designed with a client-side, privacy-first approach.

> Your receipt and business data stays in your browser.

The application does not require an account or send receipt information to an external backend.

### 📤 Data Backup

Users can:

* Export their BillMate data as JSON
* Import previously exported data
* Restore their receipts and settings

This makes it possible to back up and move locally stored data.

### 🌙 Theme Support

* Light mode
* Dark mode
* Responsive interface

The receipt itself remains optimized for professional printing regardless of the application theme.

---

## 🛠️ Tech Stack

| Technology            | Purpose                                    |
| --------------------- | ------------------------------------------ |
| **Next.js**           | React framework & application architecture |
| **React**             | UI components and application state        |
| **TypeScript**        | Type safety and maintainability            |
| **Tailwind CSS**      | Responsive styling                         |
| **Lucide React**      | Interface icons                            |
| **LocalStorage**      | Client-side data persistence               |
| **Browser Print API** | Receipt printing / PDF saving              |

---

## 🏗️ Application Architecture

```text
BillMate
│
├── app/
│   ├── page.tsx
│   ├── receipts/
│   ├── create/
│   ├── customers/
│   └── settings/
│
├── components/
│   ├── layout/
│   ├── receipt/
│   ├── forms/
│   └── ui/
│
├── lib/
│   ├── calculations/
│   ├── storage/
│   ├── validation/
│   └── utilities/
│
├── types/
│
├── public/
│
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### Clone the repository

```bash
git clone https://github.com/rnprahul/BillMate.git
```

### Navigate to the project

```bash
cd BillMate
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏭 Production Build

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

---

## ☁️ Deployment

BillMate is optimized for deployment on **Vercel** using the Next.js framework.

Production deployment:

[billmate-beta.vercel.app](https://billmate-beta.vercel.app/?utm_source=chatgpt.com)

No environment variables are currently required.

---

## 📱 Responsive Design

BillMate is designed for:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The receipt creator adapts its layout to smaller screens while keeping the receipt preview usable.

---

## 🔒 Privacy

BillMate does not require:

* User accounts
* Passwords
* A database
* External receipt storage

Receipt information is handled on the client side and stored locally in the browser.

**Important:** Clearing browser storage can remove locally saved application data, so use the built-in **Export Data** feature for backups.

---

## 🎯 Use Cases

BillMate can be useful for:

* Small businesses
* Freelancers
* Local shops
* Independent service providers
* Consultants
* Home businesses
* Small agencies
* Developers building client-side business tools

---

## 🧮 Example Calculation

For an item:

```text
Website Development
Quantity: 1
Unit Price: ₹15,000
GST: 18%
```

BillMate calculates:

```text
Subtotal:     ₹15,000
CGST:          ₹1,350
SGST:          ₹1,350
----------------------
Total:        ₹17,700
```

The calculation engine also supports discounts, IGST, GST-inclusive pricing, and partial payments.

---

## 🔮 Future Improvements

Potential future enhancements include:

* Cloud synchronization
* User accounts
* Multiple business profiles
* Advanced analytics
* Recurring receipts
* Additional receipt templates
* Custom branding
* QR-code payment integration
* Multi-language receipts

---

## 👨‍💻 Author

**Rahul**

GitHub: [rnprahul](https://github.com/rnprahul?utm_source=chatgpt.com)

---

## 📄 License

This project is available for educational and portfolio purposes.

---

### ⭐ If you find BillMate useful

Feel free to explore the project, experiment with the receipt generator, and check out the source code on GitHub.
