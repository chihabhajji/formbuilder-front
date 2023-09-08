import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux";
import {RouterProvider} from "react-router";
import {store} from "./store";
import {router} from "./pages";
import {SnackbarProvider} from 'notistack';
import AlertProvider from "./components/AlertProvider";
import AlertDialog from "./components/AlertDialog";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AlertProvider AlertComponent={AlertDialog}>
        <Provider store={store}>
            <Suspense
                fallback={
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <div className="flex items-center justify-center">
                            Loading...
                        </div>
                    </div>
                }
            >

                    <RouterProvider router={router}/>

                <SnackbarProvider/>
            </Suspense>
        </Provider>
        </AlertProvider>
    </React.StrictMode>,
)
