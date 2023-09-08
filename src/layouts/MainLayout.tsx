import {Link, Outlet} from "react-router-dom";
import {Suspense} from "react";

export default function MainLayout() {

        return (
            <div className="flex flex-col h-screen">
                <div className="flex flex-col flex-grow">
                    <Link to={"/"}>
                        Home
                    </Link>
                    <Link to={"/form-builder"}>
                        Form builder
                    </Link>
                </div>
                <div className="flex flex-col flex-grow">
                    <div className="flex flex-grow">
                        <div
                            className="md:max-w-auto min-h-screen min-w-0 max-w-full flex-1  rounded-tl-none bg-slate-100 px-4 pb-4 shadow-sm before:block before:h-px before:w-full before:content-[''] dark:bg-darkmode-700 md:px-[22px]">
                            <Suspense
                                fallback={
                                    <div className="flex h-full w-full flex-col items-center justify-center">
                                        <div className="flex items-center justify-center">
                                            Loading...
                                        </div>
                                    </div>
                                }
                            >
                                <Outlet/>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        )
    }