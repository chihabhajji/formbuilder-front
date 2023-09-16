import { Dialog } from "@headlessui/react";
import { AlertComponentProps } from "./alert-provider.tsx";
const AlertDialog = (props: AlertComponentProps) => {
    return (
        <Dialog
            as="div"
            className="relative z-10"
            onClose={props.onClose}
            open={props.open}
        >
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 "
                        >
                            {props.title}
                        </Dialog.Title>
                        <div className="mt-2">
                            <p className="text-sm ">{props.message}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                                onClick={props.onConfirm}
                            >
                                {props.confirming ? "Loading..." : "Yes"}
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-2"
                                onClick={props.onClose}
                            >
                                No
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
};
export default AlertDialog;
