import {lazy} from "react";
import {createBrowserRouter, Outlet} from "react-router-dom";
import MainLayout from "../layouts/MainLayout.tsx";

const AnswerFormPage = lazy(
    () => import('./answer.tsx')
);

const HomePage = lazy(
    () => import('./homepage.tsx')
);

const BuilderPage = lazy(
    () => import('./builder.tsx')
);
export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: '',
                element: (
                    <>
                        <Outlet />
                    </>
                ),
                children: [
                    {
                        path: '',
                        element: <HomePage />,
                    },
                    {
                        path: 'answer/:id',
                        element: <AnswerFormPage />,
                    },
                    {
                        path: 'form-builder/:id',
                        element: <BuilderPage />,
                    },
                    {
                        path: 'form-builder',
                        element: <BuilderPage />,
                    },
                ],
            },
        ],
    },
]);