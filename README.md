# NYC Menus Scraper

A NestJS project that scrapes NYC school menus and displays them in JSON API or a modern UI.

## 🚀 Features
- Scrape NYC menus (breakfast & lunch)
- Store in SQLite/Postgres
- View as JSON API
- Modern UI (Handlebars table)

## 🔧 Installation
```bash
git clone https://github.com/YOUR_USERNAME/nyc-menus.git
cd nyc-menus
npm install
```
▶️ Running locally
npm run start:dev
- API: http://localhost:3000/menus 
- Scrape: http://localhost:3000/menus/scrape?mealType=lunch 
- UI: http://localhost:3000/menus/ui

🌍 Live Test Endpoint
- Base: https://nyc-menus.up.railway.app
- API: /menus
- UI: /menus/ui
- Scrape: /menus/scrape
