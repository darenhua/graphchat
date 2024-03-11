import React from "react";

interface ContextContainerProps {
    children: React.ReactNode;
}

export default function ContextContainer({ children }: ContextContainerProps) {
    return (
        <div className="flex items-center justify-center min-w-96 -xs:min-w-72 h-52 min-h-52 -md:min-h-96 border border-dashed rounded-xl border-gray-700 bg-black/5 dark:bg-white/10">
            {children}
        </div>
    );
}
