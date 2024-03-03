import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

async function fetchSSECompletion(chatQuery: string) {
    return chatQuery;
}

interface LoaderDepsParams {
    search: {
        chatQuery: string;
    };
}

// This sets up a request on page load, calls the completion endpoint
function chatQueryOptions(chatQuery: string) {
    return queryOptions({
        queryKey: ["chat", { chatQuery }],
        queryFn: () => fetchSSECompletion(chatQuery),
    });
}

// This uses the router in the Tanstack router context to hit the api with caching
export const Route = createFileRoute("/chat")({
    loader: ({ context: { queryClient }, deps: { chatQuery } }) =>
        queryClient.ensureQueryData(chatQueryOptions(chatQuery)),
    loaderDeps: ({ search: { chatQuery } }: LoaderDepsParams) => ({
        chatQuery,
    }),

    component: Chat,
});

function Chat() {
    const chat = Route.useLoaderData();
    return <div className="p-2">{chat}</div>;
}
