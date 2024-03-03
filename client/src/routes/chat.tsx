import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

interface SearchParams {
    chatQuery: string;
    chatContext: string[];
}
interface LoaderDepsParams {
    search: SearchParams;
}

async function fetchSSECompletion(chatQuery: string, chatContext: string[]) {
    return new Promise((resolve) => {
        resolve({ chatQuery, chatContext });
    });
}

// This sets up a request on page load, calls the completion endpoint
function chatQueryOptions(chatQuery: string, chatContext: string[]) {
    return queryOptions({
        queryKey: ["chat", { chatQuery }],
        queryFn: () => fetchSSECompletion(chatQuery, chatContext),
    });
}

// This uses the router in the Tanstack router context to hit the api with caching
export const Route = createFileRoute("/chat")({
    loader: ({ context: { queryClient }, deps: { chatQuery, chatContext } }) =>
        queryClient.ensureQueryData(chatQueryOptions(chatQuery, chatContext)),
    loaderDeps: ({ search: { chatQuery, chatContext } }: LoaderDepsParams) => ({
        chatQuery,
        chatContext,
    }),

    component: Chat,
});

function Chat() {
    const { chatQuery, chatContext }: SearchParams = Route.useLoaderData();
    return (
        <div className="p-2">
            <p>Query: {chatQuery}</p>
            <p>
                Context:{" "}
                {chatContext.map((x) => (
                    <p>{x}</p>
                ))}
            </p>
        </div>
    );
}
