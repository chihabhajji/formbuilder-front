import {Button} from "../../components/ui/button.tsx";
import {formSlice, useAppDispatch, useAppSelector} from "../../store";
import {ArrowRightCircleIcon} from "@heroicons/react/24/solid";
import {useState} from "react";

export default function CampaignNameStep(){
    const [currentCampaignName, setCurrentCampaignName] = useState<string>("");
    const campaignName = useAppSelector((state) => state.form.campaignName);
    const dispatch = useAppDispatch()

    return (
        <div className="p-8 space-y-6 dark:bg-accent-foreground rounded-md w-full max-w-md mx-auto shadow-lg mt-20">
            <div className="flex flex-col space-y-2 dark:text-accent">
                <label className="text-lg font-semibold" htmlFor="fieldType">
                    Campaign name:
                </label>
                <div className={"flex flex-row"}>
                    <input
                        id="fieldLabel"
                        type="text"
                        className="px-4 py-2 w-full border rounded-md"
                        value={campaignName}
                        onChange={(e) =>
                            setCurrentCampaignName(e.target.value)
                        }
                    />
                    <Button
                        className={"ml-2 my-auto bg-accent text-primary hover:text-accent"}
                        disabled={!currentCampaignName || currentCampaignName.length < 4}
                        onClick={() =>
                            dispatch(formSlice.actions.setCampaignName(currentCampaignName))
                        }
                    >
                        <ArrowRightCircleIcon
                            className=" h-5 w-5"
                            width={24}
                            height={24}
                        />
                    </Button>
                </div>
            </div>
        </div>
    )
}