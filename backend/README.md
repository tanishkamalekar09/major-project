# ReguCheck AI - Backend

Built with Python, FastAPI, Pydantic, SQLAlchemy, and SQLite.

## Folder Highlights
- `app/api/`: Endpoint controllers for product inspection, upload, and reporting.
- `app/services/ocr/`: OCR abstraction layer. Contains `mock_ocr.py` for development and ready for your teammate's model.
- `app/services/extraction/`: Parses raw text into structured attributes (ingredients, net weight, FSSAI number).
- `app/services/compliance/`: Evaluates mandatory labeling rules and flags compliance issues.
- `app/models/`: SQLAlchemy database tables.
- `app/schemas/`: Pydantic input/output validation models.

## How to Run
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open interactive Swagger API docs at: `http://127.0.0.1:8000/docs`
