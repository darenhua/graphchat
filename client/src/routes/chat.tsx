import { createFileRoute } from "@tanstack/react-router";
import { useEventSourceQuery } from "../hooks/useEventSourceQuery";
import { Strong, Text } from "../components/catalyst/text";
import { Badge } from "../components/catalyst/badge";
import { Button } from "../components/catalyst/button";
import { StopCircleIcon } from "@heroicons/react/16/solid";

interface SearchParams {
    chatQuery: string;
    chatContext: string[];
}
interface LoaderDepsParams {
    search: SearchParams;
}

export interface Extraction {
    answer: string;
    keywords: string[];
}

// This uses the router in the Tanstack router context to hit the api with caching
export const Route = createFileRoute("/chat")({
    loaderDeps: ({ search: { chatQuery, chatContext } }: LoaderDepsParams) => ({
        chatQuery,
        chatContext,
    }),

    component: Chat,
});

function Chat() {
    const { chatQuery, chatContext } = Route.useSearch();
    const params = new URLSearchParams();
    params.append("query", chatQuery || "");
    chatContext.forEach((item) => params.append("context", item));
    const searchParams = params.toString();
    const url = `http://localhost:8080/completion?${searchParams}`;

    const { closed, generateCount, triggerGenerate, stopGenerate, data } =
        useEventSourceQuery(url);

    console.log("TESTING", data);
    return (
        <div className="flex h-full">
            <div className="w-3/4 p-6">
                <Strong className="text-xl">{data?.answer}</Strong>
            </div>
            <div className="w-1/4 p-6 border-l-2 shadow-sm h-full min-h-screen border-gray-200">
                <div>
                    <Strong className="text-lg leading-loose">
                        GraphChat is answering:
                    </Strong>
                    <Text className="break-words">{chatQuery}</Text>
                </div>
                <div className="mt-8">
                    <Strong className="text-lg leading-loose">
                        Answers will reference:
                    </Strong>
                    {chatContext.length === 0 && (
                        <Text>No Documents Selected</Text>
                    )}
                    <div>
                        {chatContext.map((contextItem: string) => (
                            <Badge color="green">{contextItem}</Badge>
                        ))}
                    </div>
                </div>
                <div className="mt-12">
                    {closed ? (
                        <Button
                            color="green"
                            disabled={generateCount >= 5}
                            onClick={triggerGenerate}
                        >
                            Regenerate
                        </Button>
                    ) : (
                        <Button outline onClick={stopGenerate}>
                            <StopCircleIcon />
                            Stop
                        </Button>
                    )}

                    <Text className="mt-3">
                        You have {5 - generateCount} regenerations remaining
                    </Text>
                </div>
            </div>
        </div>
    );
}
