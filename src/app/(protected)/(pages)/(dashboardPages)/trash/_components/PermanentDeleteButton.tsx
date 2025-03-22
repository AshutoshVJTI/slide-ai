"use client";

import { permanentDeleteProject } from "@/actions/project";
import AlertDialogBox from "@/components/global/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
    projectId: string;
};

const PermanentDeleteButton = ({ projectId }: Props) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handlePermanentDelete = async () => {
        setLoading(true);

        try {
            const res = await permanentDeleteProject(projectId);

            if (res.status !== 200) {
                throw new Error(res.error || "Failed to permanently delete project");
            }
            
            toast.success("Success", {
                description: "Project permanently deleted",
            });
            
            router.refresh();
            setOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Error", {
                description: "Failed to permanently delete project",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialogBox
            description="This action cannot be undone. This will permanently delete your project and remove your data from our servers."
            className="bg-red-500 text-white dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
            onClick={handlePermanentDelete}
            loading={loading}
            handleOpen={() => setOpen(!open)}
            open={open}
        >
            <Button
                size="sm"
                variant="ghost"
                className="bg-background-80 dark:hover:bg-background-90 text-destructive hover:text-white"
                disabled={loading}
            >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
            </Button>
        </AlertDialogBox>
    );
};

export default PermanentDeleteButton; 