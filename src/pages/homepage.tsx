import {useAllQuery, useDeleteApiFormManagementByIdMutation} from "../store/formManagementApi.ts";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {enqueueSnackbar} from 'notistack';
import {useConfirmAlert} from "../components/AlertProvider.tsx";

export default function HomePage() {
    const forms = useAllQuery();
    const [trigger, mutationState] = useDeleteApiFormManagementByIdMutation({

    });


    const { showAlert } = useConfirmAlert();
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
        <div className="grid grid-cols-1 gap-4">
            <div className="text-xl font-bold">Forms</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms.data.map((form) => {
                    if(form.fields?.length === 0) return null;
                    return (
                        <div key={form._id} className="p-4 border rounded-lg">
                            <Link to={`/answer/${form._id}`} key={form._id}>
                                <div className="text-lg font-semibold">
                                    {form.answers?.length ?? 0} Answers
                                </div>
                                <div className="text-lg font-semibold">
                                    {form.fields?.length ?? 0} Fields
                                </div>
                            </Link>
                            <button
                                onClick={() => handleClick(form._id)}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                            <Link
                                to={`/form-builder/${form._id}`}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                            >
                                Update
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>

    )
}