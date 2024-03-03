import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";
import Header from "../components/Header";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
    {
        component: Layout,
    }
);

function Layout() {
    return (
        <>
            <Header />
            <hr />
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
        </>
    );
}
