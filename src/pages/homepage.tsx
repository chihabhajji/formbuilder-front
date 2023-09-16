import {useAllQuery, useDeleteApiFormManagementByIdMutation} from "../store/formManagementApi.ts";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {enqueueSnackbar} from 'notistack';
import {useConfirmAlert} from "../components/ui/alert-provider.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Button, buttonVariants} from "../components/ui/button.tsx";
import {cn} from "../libs/utils/utils.ts";
import {CheckBadgeIcon} from "@heroicons/react/20/solid";

export default function HomePage() {
    const forms = useAllQuery();
    const [trigger, mutationState] = useDeleteApiFormManagementByIdMutation({});


    const {showAlert} = useConfirmAlert();
    const handleClick = (id: string) => {
        showAlert({
            title: "Confirm Deletion",
            confirmMessage: "Are you sure you want to delete this?",
            async onConfirm() {
                trigger({id})
            },
        });
    };

    useEffect(() => {
        const requestId = mutationState?.originalArgs?.id;
        const existsindata = forms.data?.find((form) => form._id === requestId);
        if (mutationState.isSuccess && existsindata) {
            forms.refetch();
            enqueueSnackbar("Form deleted", {
                variant: "success"
            })
        }
    }, [mutationState, forms]);
    if (forms.isLoading) return <div>Loading...</div>
    if (forms.isError) return <div>Error...</div>
    if (!forms.data) return <div>Form not found</div>
    return (
        <div className="grid grid-cols-1 gap-4 p-4">
            <div className="text-xl font-bold top-4">Forms</div>
            <div className="border-t border-primary dark:border-primary"/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms.data.map((form) =>
                        (
                            <Link to={`/answer/${form._id}`} key={form._id}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{form.campaignName}</CardTitle>
                                        <CardDescription>
                                            <div>
                                                <span>Created at </span>
                                                <time>{Intl.DateTimeFormat('en-US').format(form.createdAt ? new Date(form.createdAt) : new Date())}</time>
                                            </div>
                                            <div>
                                                {form.createdAt !== form.updatedAt && (
                                                    <span>
                                                    <span>Updated at </span>
                                                    <time>{Intl.DateTimeFormat('en-US').format(new Date(form.updatedAt))}</time>
                                                </span>
                                                )}
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={"flex flex-row"}>
                                            <CheckBadgeIcon height={24} width={24}/>
                                            <span>{
                                                ` ${form?.answers?.length ?? 0} answers`
                                            }</span>
                                        </div>

                                    </CardContent>
                                    <CardFooter className={"flex flex-row place-content-evenly"}>
                                        <Link
                                            to={`/form-builder/${form._id}`}
                                            className={cn(
                                                buttonVariants({variant: "outline"}))
                                        }
                                        >
                                            Update
                                        </Link>
                                        <Button
                                            onClick={() => handleClick(form._id)}
                                            variant={"destructive"}
                                        >
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        )
                    // (
                    //     <div key={form._id} className="p-4 border rounded-lg">
                    //         <Link to={`/answer/${form._id}`} key={form._id}>
                    //             <div className="text-lg font-semibold">
                    //                 {form.answers?.length ?? 0} Answers
                    //             </div>
                    //             <div className="text-lg font-semibold">
                    //                 {form.fields?.length ?? 0} Fields
                    //             </div>
                    //         </Link>

                    //     </div>
                )}
            </div>
        </div>

    )
}