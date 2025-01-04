from openai import OpenAI

from backend.config import OPENAI_API_KEY


client = OpenAI(api_key=OPENAI_API_KEY)


def get_embedding(text: str, model: str = "text-embedding-ada-002") -> list:
    response = client.embeddings.create(
        model="text-embedding-3-small", input=[text]
    )
    return response.data[0].embedding


def generate_llm_response(prompt: str, model: str = "gpt-3.5-turbo") -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()
