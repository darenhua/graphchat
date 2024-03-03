import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Field } from "../components/catalyst/fieldset";
import { Textarea } from "../components/catalyst/textarea";
import { AcademicCapIcon } from "@heroicons/react/16/solid";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/catalyst/button";
import { Text } from "../components/catalyst/text";
import { ThreeDots } from "react-loader-spinner";
import ContextContainer from "../components/ContextContainer";
import Context from "../components/Context";

export const Route = createFileRoute("/")({
    component: IndexComponent,
});

export interface Document {
    title: string;
    content: string;
    difficulty: string;
    related: string[];
}
export interface DocumentWrapper {
    document: Document;
}

function IndexComponent() {
    const queryClient = useQueryClient();
    const [data, setData] = useState<DocumentWrapper[]>([]);
    // const [context, setContext] = useState();

    // Hits our api for vector search similar documents
    const fetchSimilarDocuments = async ({ queryKey }) => {
        const [_, query] = queryKey;
        const searchParams = new URLSearchParams(query).toString();
        const response = await fetch(
            `http://localhost:8080/embeddings?${searchParams}`
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const query = e.target.value;
        const data = await queryClient.ensureQueryData({
            queryKey: ["embeddings", { query }],
            queryFn: fetchSimilarDocuments,
        });
        setData(data); // TODO: I believe this is a react query antipattern.
    };
    return (
        <div className="flex flex-col items-center gap-12">
            <form>
                <Field className="w-96 h-auto">
                    <div className="flex gap-2 items-center justify-center mt-12 mb-10">
                        <h2 className="font-extrabold text-3xl dark:text-white">
                            Ask GraphChat.
                        </h2>

                        <div className="w-10 dark:invert">
                            <AcademicCapIcon />
                        </div>
                    </div>
                    <Textarea
                        onChange={handleChange}
                        placeholder="Hi"
                        rows={6}
                        name="description"
                    />
                </Field>
                <Field className="mt-5 mr-1 flex justify-end">
                    <Button color="green">
                        <PaperAirplaneIcon /> Ask
                    </Button>
                </Field>
            </form>
            <div className="w-2/3">
                <ContextContainer>
                    <Context data={data} />
                </ContextContainer>
                <Text className="text-wrap mx-auto text-center mt-3">
                    Ask GraphChat in the input box to see related documents
                    above. The documents you select will be used to support your
                    answer.
                </Text>
            </div>
        </div>
    );
}
