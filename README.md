# Portfolio CMS (Node.js version)

This version features a separate Public site and a private Admin dashboard.

## Folder Structure
- **`public/`**: Accessible at `/`. Contains the portfolio view for visitors.
- **`admin/`**: Accessible at `/admin`. The dashboard for managing portfolio data.
- **`data.json`**: The persistent database file.
- **`server.js`**: Express server handling API and routing.

## Features
- **Separated Access**: Visitors saw the portfolio at the root, while you manage it at `/admin`.
- **Persistent Data**: All changes made in the admin panel are saved to `data.json`.
- **Node.js Backend**: Lightweight Express server for data persistence.

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. **Public Site**: [http://localhost:4000](http://localhost:4000)
4. **Admin Panel**: [http://localhost:4000/admin](http://localhost:4000/admin)
# My-Portfolio
