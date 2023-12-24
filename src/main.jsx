import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { EventPage, Eventloader } from "./pages/EventPage";
import { EventsPage, eventsListLoader } from "./pages/EventsPage";
import { CategoriesPage, categoriesListLoader } from "./pages/categoriesPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { UsersPage, usersListLoader } from "./pages/usersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        loader: eventsListLoader,
      },
      {
        path: "/event/:id",
        element: <EventPage />,
        loader: Eventloader,
      },
      {
        path: "/categoties/",
        element: <CategoriesPage />,
        loader: categoriesListLoader,
      },

      {
        path: "/users/",
        element: <UsersPage />,
        loader: usersListLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
