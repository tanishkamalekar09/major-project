# ReguCheck AI - Frontend (Phase 1)

**ReguCheck AI** — *AI-Powered Packaged Product Compliance Verification*

This is the complete **Phase 1: Frontend Only** implementation built with:
- **React 18**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **React Router 6**
- **Lucide React** (Icons)
- **Recharts** (Interactive charts)

---

## 🎨 Visual Design Standard
- **Professional B2B SaaS Layout**
- **Dark Navy Sidebar** (`#070c1e` / `#0b132b`)
- **Clean White Cards** (`bg-white border border-slate-200/80 shadow-subtle`)
- **Light Gray Page Background** (`bg-slate-50`)
- **Blue Primary Buttons** (`bg-blue-600 hover:bg-blue-700 text-white`)
- **Green Success Status** (`bg-emerald-50 text-emerald-700 border-emerald-200`)
- **Orange Warning Status** (`bg-amber-50 text-amber-700 border-amber-200`)
- **Red Issue Status** (`bg-rose-50 text-rose-700 border-rose-200`)
- **Plus Jakarta Sans Typography**

---

## 📄 Implemented Pages & URL Routes

### Public Pages
1. **Landing Page** (`/` or `/landing`) — Hero, 8-stage pipeline overview, interactive live audit preview, and regulatory coverage badges.
2. **Login Page** (`/login`) — B2B authentication with an "Instant Demo Login" button.

### Authenticated B2B SaaS Pages (Wrapped in Reusable Layout)
3. **Dashboard** (`/dashboard`) — Executive KPI cards, Recharts audit trend area chart, category pie chart, and recent inspections table.
4. **Step 1: New Product Inspection** (`/inspect/new`) — Label upload dropzone, metadata form, and quick pre-loaded label presets.
5. **Step 2: Product Image Analysis** (`/inspect/analysis`) — Computer vision scanning simulation with laser effect and live progress stages.
6. **Step 3: OCR Results** (`/inspect/ocr`) — Interactive label bounding box inspector synchronized with raw text stream.
7. **Step 4: Detected Information** (`/inspect/detected-info`) — Extracted regulatory entities (Net Wt, FSSAI Lic, MRP, Dates, Ingredients) with category filters and inline editing.
8. **Step 5: Regulatory Classification** (`/inspect/classification`) — Statutory classification engine and mandatory checklist matrix.
9. **Step 6: Compliance Analysis** (`/inspect/compliance`) — Rule engine results, score ring (74%), violation counts, and status filtering.
10. **Step 7: Issue Details** (`/inspect/issues`) — Deep-dive violation breakdown with actionable instructions for packaging designers.
11. **Step 8: Compliance Report** (`/inspect/report`) — Official statutory audit certificate with Recharts distribution, printable format, and download simulation.
12. **Inspection History** (`/history`) — Searchable, filterable repository of past product screenings.
13. **Regulations** (`/regulations`) — Knowledge base browser covering FSSAI 2020, Legal Metrology 2011, US FDA 21 CFR, and EU FIC 1169.
14. **Reports** (`/reports`) — Management compliance analytics by product segment and downloadable audit dossiers.
15. **Settings** (`/settings`) — Inspector profile, enabled regulatory frameworks, and Pluggable OCR Engine configuration.

---

## 🚀 How to Run the Frontend

### Step 1: Install Node.js (If not already installed)
1. Download and install **Node.js LTS** from [https://nodejs.org](https://nodejs.org).
2. Verify installation in PowerShell:
   ```powershell
   node -v
   npm -v
   ```

### Step 2: Open Terminal in the `frontend` Directory
```powershell
cd "e:\Tanishka Project\ReguCheck-AI\frontend"
```

### Step 3: Install Dependencies
```powershell
npm install
```

### Step 4: Start Vite Local Development Server
```powershell
npm run dev
```

### Step 5: Open in Your Browser
Open your browser and navigate to:
```text
http://localhost:5173
```
You can click any navigation link in the sidebar or use the top inspection stepper to navigate through all 15 screens.
