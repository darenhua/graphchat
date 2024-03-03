import ReactDOM from "react-dom/client";
import {
    RouterProvider,
    createRouter,
    NotFoundRoute,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Route as rootRoute } from "./routes/__root.tsx";
import NotFound from "./components/404.tsx";

import "./index.css";
import "./assets/fonts/inter.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const notFoundRoute = new NotFoundRoute({
    getParentRoute: () => rootRoute,
    component: NotFound,
});

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
    routeTree,
    notFoundRoute,
    context: {
        queryClient,
    },
    defaultPreload: "intent",
    // FROM DOCS: Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
