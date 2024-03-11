import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
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
        </>
    );
}
