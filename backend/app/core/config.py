from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CGI Complaint Processing API"
    debug: bool = False

    llm_provider: str = "gemini"
    llm_model: str = "gemini-2.5-flash"

    gemini_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()