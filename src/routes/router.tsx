import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { rootTree } from "./routes";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const history = createMemoryHistory({
    initialEntries:
        //["/"],
        ["/search-sample"],
});
export const router = createRouter({
    routeTree: rootTree,
    history: history
});

const historyView = createMemoryHistory({
    initialEntries:
        //["/"],
        ["/view-sample/$id"],
});
export const routerView = createRouter({
    routeTree: rootTree,
    history: historyView
});

const historyAddEdit = createMemoryHistory({
    initialEntries:
        //["/"],
        ["/add-edit-sample/$id"],
});
export const routerAddEdit = createRouter({
    routeTree: rootTree,
    history: historyAddEdit
});
