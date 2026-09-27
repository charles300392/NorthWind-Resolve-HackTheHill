import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    app_name: str = os.getenv(
        "APP_NAME",
        "Northwind Resolve API",
    )

    debug: bool = os.getenv(
        "DEBUG",
        "true",
    ).lower() == "true"

    llm_provider: str = os.getenv(
        "LLM_PROVIDER",
        "gemini",
    )

    llm_model: str = os.getenv(
        "LLM_MODEL",
        os.getenv(
            "GEMINI_MODEL",
            "gemini/gemini-3.8-flash",
        ),
    )


settings = Settings()