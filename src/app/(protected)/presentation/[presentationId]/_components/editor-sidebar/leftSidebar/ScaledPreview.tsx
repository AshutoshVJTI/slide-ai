import { Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import React from "react";
import MasterRecursiveComponent from "../../editor/MasterRecursiveComponent";

type Props = {
    slide: Slide;
    isActive: boolean;
    index?: number;
};

const ScaledPreview = ({ isActive, slide }: Props) => {
    const { currentTheme } = useSlideStore();

    return (
        <div
            className={cn(
"w-full relative aspect-video rounded-lg overflow-hidden transition-all duration-200 p-2 ring-2 ring-primary/20 ring-offset-2",
                isActive
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-2"
            )}
            style={{
                fontFamily: currentTheme.fontFamily,
                color: currentTheme.accentColor,
                backgroundColor: currentTheme.slideBackgroundColor,
                backgroundImage: currentTheme.gradientBackground,
            }}
        >
            <div className="scale-[0.5] origin-top-left overflow-hidden size-[200%]">
                <MasterRecursiveComponent
                    slideId={slide.id}
                    content={slide.content}
                    onContentChange={() => { }}
                    isPreview={true}
                />
            </div>
        </div>
    );
};

export default ScaledPreview;