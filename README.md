<p align="center">
    <h1 align="center">GraphChat</h1>
</p>
<p align="center">
    <em>Basic RAG website that uses retrieval on AI-generated documents about Graph Theory (Math). The highlight of this website is to encourage transparency in RAG apps on what documents that a RAG system is doing behind the scenes.</em>
</p>

## Live Demo

[https://graphchat.vercel.app/](https://graphchat.vercel.app/)

## Getting Started

**_Requirements_**

Ensure you have the following ready:

-   **Python**: `version 3.0.0+, prefer v3.11.1`
-   **Node.js**: `prefer v18.12.1`
-   **openai**: `api key obtained`
-   **mongodb**: `obtain a connection string`

### Setup

For both frontend and backend, simply install dependencies, create `.env`, and then run `npm run dev` or `flask run`.

## Codebase Tips

### Frontend

-   Frontend is React, Typescript, with Tanstack Router and Tanstack Query. Build tool is vite.
-   I have two frontend pages, index, and chat. (file-based routing)
-   React query is used to maintain the cache for the embeddings page.
    -   Note: React query is not used for `useEventSource()` because we don't want to cache the openai responses for the purpose of regenerating responses.
-   I am using tailwind's catalyst component library. It works like shadcn, see `src/assets/catalyst` for the components

### Backend

-   Backend is Flask using Pydantic, PyMongo and Instructor (a lightweight openai wrapper to work with Pydantic)
-   `src/SyntheticData` is the folder that uses openai to generate unique documents and write them to the Mongo database.
-   The backend is structured based on the Factory pattern to have some form of dependency injection. The entry point into the project is `src/app.py`.
-   There are two endpoints (excluding the index health route).
    -   They both abuse search query params
    -   One endpoint is `/embeddings` which retrieves documents and send them back to the client
    -   The other endpoint is `/completion` which uses server side events to stream openai's completion back to the client.
-   Pydantic is used for type safety and also to ensure that chatgpt gives data in the required response format. (via instructor)

## Future improvements

-   Compose the big components in index.tsx and chat.tsx into their own component files and custom hooks.
-   More type safety
-   Graph visualization generation on the chat page
-   LM-Powered "query improvement" on the frontend
-   More creative synthetic data using webscraping and a better vector store than MongoDB.
