from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ReguCheck AI Backend"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./regucheck.db"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # Default Vite Dev Server
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

settings = Settings()
