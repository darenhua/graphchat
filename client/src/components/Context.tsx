import { ThreeDots } from "react-loader-spinner";
import { useQueryClient } from "@tanstack/react-query";
import { Document, IContext } from "../routes/index.tsx";
import { Strong } from "./catalyst/text";
import DocumentSelect from "./DocumentSelect.tsx";

interface ContextProps {
    query: string;
    context: IContext[];
    handleAddContext: (newContext: IContext, oldContext: IContext[]) => void;
}

export default function Context({
    query,
    context,
    handleAddContext,
}: ContextProps) {
    const queryClient = useQueryClient();
    const data: Document[] | undefined = queryClient.getQueryData([
        "embeddings",
        { query: query },
    ]);
    const isLoading = queryClient.isFetching() === 1;

    if (isLoading) {
        return <ThreeDots height="15" color="#16a34a" />;
    }

    if (!data) {
        return (
            <Strong className="text-center w-2/3">
                Start typing in the chatbox to see related documents here!
            </Strong>
        );
    }

    if (data.length === 0) {
        return (
            <Strong className="w-2/3 text-wrap  text-center break-words">
                No results related to "{query}"
            </Strong>
        );
    }
    return (
        <div className="flex gap-2 items-stretch overflow-x-auto w-full h-full -md:flex-col -md:overflow-y-auto -md:items-center">
            {data.map((doc, index) => (
                <DocumentSelect
                    handleAddContext={handleAddContext}
                    context={context}
                    document={doc}
                    key={index}
                    index={index}
                />
            ))}
        </div>
    );
}
