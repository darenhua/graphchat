import { useState, useEffect } from "react";
import { Extraction } from "./../routes/chat";

// This function does not use react-query functions
// There's nothing to optimize using react-query's cache
export const useEventSourceQuery = (url: string) => {
    const [closed, setClosed] = useState<boolean>(true);
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [data, setData] = useState<Extraction>();
    const [generateCount, setGenerateCount] = useState(0);

    useEffect(() => {
        const newEventSource = new EventSource(url);
        setClosed(false);
        setEventSource(newEventSource);

        const onEvent = (e: Event) => {
            const messageEvent = e as MessageEvent;
            if (!messageEvent || !messageEvent.data) {
                return;
            }
            setData(JSON.parse(messageEvent.data));
        };

        newEventSource.addEventListener("message", onEvent);
        newEventSource.addEventListener("error", () => {
            console.error("EventSource failed.");
            newEventSource.close();
            setClosed(true);
        });

        newEventSource.addEventListener("end", () => {
            newEventSource.close();
            setClosed(true);
        });

        return () => {
            newEventSource.close();
            setClosed(true);
        };
    }, [url, generateCount]);

    const triggerGenerate = () => {
        setGenerateCount((prev) => prev + 1);
        if (eventSource) {
            eventSource.close();
        }
        setClosed(false);
    };

    const stopGenerate = () => {
        if (eventSource) {
            eventSource.close();
        }
        setClosed(true);
    };

    return { closed, stopGenerate, generateCount, data, triggerGenerate };
};
