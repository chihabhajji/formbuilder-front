import {Link, Outlet, useNavigate} from "react-router-dom";
import {Suspense, useState} from "react";
import {ArrowRightCircleIcon, BanknotesIcon, DocumentPlusIcon, HomeIcon, TrashIcon} from '@heroicons/react/24/solid'
import {buttonVariants} from "../components/ui/button.tsx";
import {useAllQuery, useDeleteApiFormManagementByIdMutation} from "../store/formManagementApi.ts";
import {cn} from "../libs/utils/utils.ts";
import {useConfirmAlert} from "../components/ui/alert-provider.tsx";
import {ModeToggle} from "../components/ui/mode-toggle.tsx";

export default function MainLayout() {
    const [current, setCurrent] = useState<undefined | string>();
    const {data, refetch} = useAllQuery();
    const [trigger] = useDeleteApiFormManagementByIdMutation();

    const router = useNavigate();
    const { showAlert } = useConfirmAlert();
    const handleClick = (id: string) => {
        showAlert({
            title: "Confirm Deletion",
            confirmMessage: "Are you sure you want to delete this?",
            async onConfirm() {
                const result = await trigger({id});
                // @ts-ignore
                if(result.error) {

                } else {
                    if(current === id) {
                        setCurrent(undefined);
                        router("/");
                    }
                    refetch();
                }
            },
        });
    };
    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-col w-72 border-r border-primary">
                <div className="lg:flex hidden items-center h-16 px-6 border-b border-primary">
                    <BanknotesIcon
                        className=" h-6 w-6"
                        width={24}
                        height={24}
                    />
                    <h1 className="ml-2 text-sm font-semibold">
                        Customer Feedback Acquisition
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="py-4 space-y-2 lg:block hidden">
                        <Link to={"/"} className={cn("justify-start", buttonVariants({ variant: "ghost" }))}>
                            <HomeIcon className=" h-5 w-5"
                                      width={24}
                                      height={24}/>
                            <span className="ml-2">
                                Submissions
                            </span>
                        </Link>
                        <Link to={"/form-builder"} className={cn("justify-start", buttonVariants({ variant: "ghost" }))}>
                            <DocumentPlusIcon
                                className=" h-5 w-5"
                                width={24}
                                height={24}
                            />
                            <span className="ml-2">
                                New Camapaign
                            </span>
                        </Link>
                    </div>
                    <div className="border-t border-primary dark:border-primary lg:block hidden"/>
                    <div className="p-4 space-y-2  lg:block hidden">
                        {data && data.map((form) => <div key={form._id}
                                                         className={cn("flex items-center justify-between px-2 py-1 rounded-lg",
                                                             current === form._id && "bg-accent dark:bg-accent"
                                                         )}
                            >

                                <TrashIcon className=" h-5 w-5"
                                           onClick={() => handleClick(form._id)}
                                           width={24}
                                           height={24}/>
                                <Link
                                    to={`/form-builder/${form._id}`}
                                    onClick={() => setCurrent(form._id)}
                                    className={"flex items-center justify-between px-2 py-1 rounded-lg"}
                                >
                              <span className="text-sm truncate max-w-[10vw] mr-2">
                                {form.campaignName}
                              </span>
                                    <ArrowRightCircleIcon
                                        className=" h-5 w-5"
                                        width={24}
                                        height={24}
                                    />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 overflow-auto">
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
                <div className="absolute bottom-0 right-0 m-4">
                    <ModeToggle/>
                </div>
            </div>
        </div>
    )
}