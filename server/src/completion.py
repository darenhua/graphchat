from models import Extraction


class CompletionService:
    def __init__(self, client):
        self.client = client

    def getCompletion(self, prompt: str, context: str) -> Extraction:
        content = f"CONTEXT: {context} PROMPT: {prompt}"

        # Using OpenAI Function Calling to make sure output is in the form Extraction.
        return self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_model=Extraction,
            max_retries=3,
            messages=[
                {
                    "role": "system",
                    "content": "Your role is to answer the prompt using the context given to in a clear and concise manner.",
                },
                {"role": "user", "content": content},
            ],
        )

    def getEmbeddings(self, query: str):
        res = self.client.embeddings.create(input=query, model="text-embedding-3-small")
        return res.data[0].embedding
