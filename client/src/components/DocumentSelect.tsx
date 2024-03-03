import { Strong, Text } from "./catalyst/text";
import { Badge } from "./catalyst/badge.tsx";
import { Document } from "../routes/index.tsx";
import { Checkbox } from "./catalyst/checkbox.tsx";

interface DocumentProps {
    document: Document;
}

export default function DocumentSelect({ document }: DocumentProps) {
    return (
        <div className="min-w-96 w-96 h-full py-3 px-4 ">
            <div className="bg-zinc-200 cursor-pointer dark:bg-zinc-800 p-3 max-h-full rounded-md flex flex-col">
                <div className="flex">
                    <Strong className="flex-grow">{document.title}</Strong>
                    <Checkbox disabled checked color="green" />
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
