import os

from dotenv import load_dotenv
from litellm import completion


load_dotenv()


MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini/gemini-3.8-flash",
)

API_KEY = os.getenv(
    "GEMINI_API_KEY"
)


def call_llm(messages):
    response = completion(
        model=MODEL,
        messages=messages,
        api_key=API_KEY,
        temperature=0.1,
    )

    return response.choices[0].message.content