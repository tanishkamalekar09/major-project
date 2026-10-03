# ReguCheck AI - AI-Assisted Packaged Product Label Compliance Screening System

Welcome to **ReguCheck AI**! This application is designed to screen packaged product labels for regulatory compliance (e.g., FSSAI, FDA) by extracting label information and evaluating rules automatically.

---

## 📁 Project Structure

```text
ReguCheck-AI/
│
├── backend/                              # Python + FastAPI backend
│   ├── app/
│   │   ├── api/                          # HTTP route handlers (API endpoints)
│   │   ├── core/                         # Configuration and environment settings
│   │   ├── database/                     # SQLite database setup and session manager
│   │   ├── models/                       # SQLAlchemy database models (tables)
│   │   ├── schemas/                      # Pydantic schemas (request & response shapes)
│   │   ├── services/                     # Business logic services
│   │   │   ├── ocr/                      # Pluggable OCR abstraction layer
│   │   │   │   ├── base.py               # Abstract base class / interface for OCR
│   │   │   │   ├── mock_ocr.py           # Realistic mock OCR for development
│   │   │   │   └── __init__.py           # Service factory (switch mock <-> real OCR)
│   │   │   ├── extraction/               # Information extraction (brand, dates, licenses)
│   │   │   ├── classification/           # Regulatory classification (food, cosmetic, etc.)
│   │   │   ├── compliance/               # Rule engine (checks violations & warnings)
│   │   │   └── report/                   # Compliance report & score generator
│   │   └── main.py                       # FastAPI application entry point
│   ├── requirements.txt                  # Python dependencies
│   └── README.md                         # Backend setup instructions
│
└── frontend/                             # React + Vite + TypeScript frontend
    ├── public/                           # Static public files (icons, images)
    ├── src/
    │   ├── assets/                       # Images, logos, and local SVGs
    │   ├── components/                   # Reusable UI components (Buttons, Cards, Badges)
    │   ├── pages/                        # Screen views (Landing, Dashboard, Inspect, Report)
    │   ├── services/                     # API client functions to talk to FastAPI
    │   ├── types/                        # TypeScript data models and interfaces
    │   ├── App.tsx                       # Main React root component
    │   ├── main.tsx                      # Vite React entry point
    │   └── index.css                     # Tailwind CSS and global styling
    ├── package.json                      # Frontend dependencies & npm scripts
    ├── tsconfig.json                     # TypeScript compiler configuration
    ├── vite.config.ts                    # Vite build tool and development proxy configuration
    ├── tailwind.config.js                # Tailwind CSS styling configuration
    └── README.md                         # Frontend setup instructions
```

---

## 🧩 The OCR Service Abstraction (For Your Teammate)

You mentioned a teammate is building the OCR model separately. To prevent waiting for the model:
1. `backend/app/services/ocr/base.py` defines the **contract**:
   ```python
   class BaseOCRService(ABC):
       @abstractmethod
       def process_image(self, image_bytes: bytes) -> OCRResult:
           pass
   ```
2. `backend/app/services/ocr/mock_ocr.py` returns **realistic packaged product label data**.
3. **When your teammate is ready:**
   - They create `backend/app/services/ocr/team_ocr.py` that inherits from `BaseOCRService`.
   - In `backend/app/services/ocr/__init__.py`, change `return MockOCRService()` to `return TeamOCRService()`.
   - **Nothing else in your backend or frontend will need to change!**

---

## 🚀 Beginner Quickstart

### 1. Backend (Python + FastAPI)
From the `backend/` folder:
```bash
# 1. Create a virtual environment (recommended)
python -m venv venv

# 2. Activate virtual environment:
# On Windows:
venv\Scripts\activate

# 3. Install dependencies:
pip install -r requirements.txt

# 4. Start the development server:
uvicorn app.main:app --reload
```
API Documentation will be available at: `http://127.0.0.1:8000/docs`

### 2. Frontend (React + Vite)
From the `frontend/` folder:
```bash
# 1. Install Node.js (if not already installed) from https://nodejs.org
# 2. Install dependencies:
npm install

# 3. Run development server:
npm run dev
```
The app will be running at: `http://localhost:5173`
