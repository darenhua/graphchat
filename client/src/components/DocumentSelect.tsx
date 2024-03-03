import { Strong, Text } from "./catalyst/text";
import { Badge } from "./catalyst/badge.tsx";
import { Document, IContext } from "../routes/index.tsx";
import { Checkbox } from "./catalyst/checkbox.tsx";

interface DocumentProps {
    document: Document;
    index: number;
    context: IContext[];
    handleAddContext: (newContext: IContext, oldContext: IContext[]) => void;
}

export default function DocumentSelect({
    document,
    context,
    handleAddContext,
    index,
}: DocumentProps) {
    const newContext = { title: document.title, index };
    const isChecked = context.some((c) => c.index === index);
    return (
        <div className="min-w-96 w-96 h-full py-3 px-4 ">
            <div
                onClick={() => handleAddContext(newContext, context)}
                className={`${isChecked ? "bg-green-200 dark:bg-green-900" : "bg-zinc-200 dark:bg-zinc-800"} cursor-pointer  p-3 max-h-full rounded-md flex flex-col`}
            >
                <div className="flex">
                    <Strong className="flex-grow">{document.title}</Strong>
                    <Checkbox disabled checked={isChecked} color="green" />
                </div>
                <div className="mt-2 mb-3">
                    {document.related.map((related, index) => (
                        <Badge className="mr-2" key={index} color="green">
                            {related}
                        </Badge>
                    ))}
                </div>
                <Text className="text-sm flex-grow overflow-hidden text-ellipsis ">
                    {document.content}
                </Text>
            </div>
        </div>
    );
}
