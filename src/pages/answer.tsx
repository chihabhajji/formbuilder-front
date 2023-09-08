import {useParams} from "react-router";
import {useGetApiFormManagementOneByIdQuery, useSubmitFormAnswerMutation} from "../store/formManagementApi.ts";
import FormConsumer from "../features/form-consumer/FormConsumer.tsx";
import {useCallback, useEffect} from "react";
import {FormData} from "../features/form-consumer/CustomForm.tsx";
import {enqueueSnackbar} from "notistack";

export default function AnswerForm() {
    const formid = useParams<{ id: string }>().id;
    if (!formid) throw new Error("Form ID is not defined");
    const query = useGetApiFormManagementOneByIdQuery({
        id: formid
    });
    
    const [trigger, mutationState] = useSubmitFormAnswerMutation();


    const onSubmitForm = useCallback((data: FormData) => {
        try {
            trigger({
                formId: formid,
                data: data.data
            });
        } catch (error) {
            // dynamicFormRef.current?.form.setError(key, {
            //     type: "manual",
            //     message: message
            // });
        }
        return;
    }, [formid, trigger]);

    useEffect(() => {
        if(mutationState.isSuccess){
            // forms.refetch();
            enqueueSnackbar("Redirecting", {
                variant: "success"
            })
            const timeout = setTimeout(() => {
                window.location.href = "/";
            }, 1000);
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [mutationState.isSuccess]);
    if (query.isLoading) return <div>Loading...</div>
    if (query.isError) return <div>Error...</div>
    if (!query.data) return <div>Form not found</div>

    if (!query.data.fields) return <div>Form has no fields</div>
    if(!query.data.fields.length) return <div>Form has no fields</div>
    if(mutationState.isLoading) return <div>Submitting...</div>
    if(mutationState.isError) return <div>Submit error...</div>
    if(mutationState.isSuccess) return <div>Submit success...</div>
    return (
        <FormConsumer form={query.data} onSubmitForm={onSubmitForm}/>
    )
}