import FormBuilder from "../features/dynamic-form-builder/FormBuilder.tsx";
import {useParams} from "react-router";
import {useGetApiFormManagementOneByIdQuery} from "../store/formManagementApi.ts";
import {useEffect, useState} from "react";
import {formSlice, useAppDispatch} from "../store";

export default function FormBuilderPage() {
    const [fetched, setFetched] = useState(false);
    const formid = useParams<{ id: string }>().id;
    const result = useGetApiFormManagementOneByIdQuery({
        id: formid!
    }, {
        skip: !formid
    });
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(!fetched && result.isSuccess && result.data?.fields){
            dispatch(dispatch(formSlice.actions.setStore({
                fields: result.data.fields,
                required: result.data.required,
                properties: result.data.properties
            })))
            // DUMB AF but i'm in a pickle
            setFetched(true);
        }
    }, [dispatch, result]);


    return (
        <div className="flex flex-col h-screen">
           <FormBuilder id={formid}/>
        </div>
    )
}