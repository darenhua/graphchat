import { ThreeDots } from "react-loader-spinner";
import { useIsFetching } from "@tanstack/react-query";
import { DocumentWrapper, IContext } from "../routes/index.tsx";
import { Strong } from "./catalyst/text";
import DocumentSelect from "./DocumentSelect.tsx";

interface ContextProps {
    data: DocumentWrapper[];
    context: IContext[];
    handleAddContext: (newContext: IContext, oldContext: IContext[]) => void;
}

export default function Context({
    data,
    context,
    handleAddContext,
}: ContextProps) {
    const isLoading = useIsFetching() !== 0;

    if (isLoading) {
        return <ThreeDots height="15" color="#16a34a" />;
    }

    if (data.length === 0) {
        return <Strong>No results</Strong>;
    }
    return (
        <div className="flex gap-2 items-stretch overflow-x-auto w-full h-full">
            {data.map((doc, index) => (
                <DocumentSelect
                    handleAddContext={handleAddContext}
                    context={context}
                    document={doc.document}
                    key={index}
                    index={index}
                />
            ))}
        </div>
    );
}
