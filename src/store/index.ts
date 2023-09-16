import {JSONSchemaType} from "ajv";
import {
    configureStore,
    createSlice,
    isRejectedWithValue,
    Middleware,
    MiddlewareAPI,
    PayloadAction
} from "@reduxjs/toolkit";
import {Field, formManagementApi} from "./formManagementApi.ts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {setupListeners} from "@reduxjs/toolkit/dist/query/react";
import {enqueueSnackbar} from "notistack";

interface FormState {
    campaignName: string | undefined;
    fields: Field[];
    required: string[];
    fieldsHistory: Field[];
    properties: JSONSchemaType<any>;
}

const initialState: FormState = {
    campaignName: undefined,
    fields: [],
    required: [],
    fieldsHistory: [],
    properties: {
        type: "object",
    }
};

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setStore: (state, action: PayloadAction<FormState>) => {
            state.fields = action.payload.fields;
            state.required = action.payload.required;
            state.properties = {
                ...state.properties,
                type: "object",
            };
            state.campaignName = action.payload.campaignName
        },
        addField: (state, action: PayloadAction<Field>) => {
            const index = state.fields.findIndex((field) => field.name === action.payload.name);
            if (index !== -1) {
                state.fields.push({
                    ...action.payload,
                    name: `${action.payload.name}-${state.fields.length}`,
                });
            } else {
                state.fields.push(action.payload);
            }
            // add to properties
            state.properties = {
                ...state.properties,
                properties: {
                    ...state.properties.properties,
                    [action.payload.name]: {
                        ...state.properties[action.payload.name],
                        type: action.payload.type,
                        format: action.payload.type === "email" ? "email" : undefined,
                        errorMessage: {
                            format: action.payload.type === "email" ? "email" : undefined,
                        }
                    }
                }
            }
        },
        undoLast: (state) => {
            if (state.fields.length === 0) return;
            state.fieldsHistory.push(state.fields!.pop()!);
        },
        redoLast: (state) => {
            if (state.fieldsHistory.length === 0) return;
            state.fields.push(state.fieldsHistory!.pop()!);
        },
        reset: (state) => {
            state.fields = [];
            state.fieldsHistory = [];
            state.required = [];
            state.properties = {
                type: "object",
            }
            state.campaignName = undefined;
        },
        toggleRequired: (state, action: PayloadAction<string>) => {
            const index = state.required.findIndex((name) => name === action.payload);
            const wasRequired = index !== -1;
            if (wasRequired) {
                state.required.splice(index, 1);
            } else {
                state.required.push(action.payload);
            }
            //     handle properties
            state.properties = {
                ...state.properties,
                properties: {
                    ...state.properties.properties,
                    [action.payload]: {
                        ...state.properties.properties[action.payload],
                        minLength: wasRequired ? undefined : 1,
                        errorMessage: {
                            ...state.properties.properties[action.payload]?.errorMessage,
                            required: wasRequired ? undefined : 'This field is required',
                            minLength: wasRequired ? undefined : 'This field is required',
                        },
                    }
                }
            }
            console.log(state.properties)
        },
        removeField: (state, action: PayloadAction<string>) => {
            state.fields = state.fields.filter((field) => field.name !== action.payload);
            state.properties = {
                ...state.properties,
                properties: {
                    ...state.properties.properties,
                    [action.payload]: undefined,
                }
            }
        },
        addOption: (state, action: PayloadAction<string>) => {
            state.fields.find((field) => field.name === action.payload)?.options?.push({
                value: `${action.payload}-${state.fields.find((field) => field.name === action.payload)?.options?.length}`,
                label: `${action.payload}-${state.fields.find((field) => field.name === action.payload)?.options?.length}`,
            })
        },
        setCampaignName: (state, action: PayloadAction<string | undefined>) => {
            state.campaignName = action.payload;
        },
        addProperties: (state, action: PayloadAction<{ name: string, type: "email" | "date" | "password" | "address", format?: string }>) => {
            // update fields
            const index = state.fields.findIndex((field) => field.name === action.payload.name);
            if (index !== -1) {
                state.fields[index] = {
                    ...state.fields[index],
                    type: action.payload.type,
                }
                state.properties = {
                    type: "object",
                    properties: {
                        ...state.properties.properties,
                        [action.payload.name]: {
                            ...state.properties[action.payload.name],
                            type: "string",
                            format: action.payload.format,
                            errorMessage: {
                                format: action.payload.format === "email" ? `Please enter a valid email format`: undefined,
                            }
                        }
                    }
                };
            }
        }
    },
});

export const rtkQueryErrorLogger: Middleware =
    (_: MiddlewareAPI) => (next) => (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        if (isRejectedWithValue(action)) {
            console.warn('We got a rejected action!')
            enqueueSnackbar(action.payload.error, {
                variant: 'error',
            })
        }
        // UI UX el na3ama
        // else if (isFulfilled(action)){
        //     enqueueSnackbar('Success!', {
        //         variant: 'success',
        //     })
        // }

        return next(action)
    }

export const store = configureStore({
    reducer: {
        form: formSlice.reducer,
        api: formManagementApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(formManagementApi.middleware).concat(rtkQueryErrorLogger)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


setupListeners(store.dispatch)
