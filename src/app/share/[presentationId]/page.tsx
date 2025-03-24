"use client";
import { getSharedProjectById } from "@/actions/project";
import { themes } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MasterRecursiveComponent from "@/app/(protected)/presentation/[presentationId]/_components/editor/MasterRecursiveComponent";
import { SafeImage } from "@/components/ui/safe-image";

const SharedPage = () => {
  const params = useParams();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [orderedSlides, setOrderedSlides] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const { currentTheme, setCurrentTheme, setSlides, getOrderedSlides, setProject } = useSlideStore();

  // Expose SafeImage to the global scope for use in dynamic components
  useEffect(() => {
    // This ensures any components that rely on window.SafeImage can use it
    if (typeof window !== 'undefined') {
      (window as any).SafeImage = SafeImage;
    }
    
    return () => {
      // Clean up on unmount
      if (typeof window !== 'undefined') {
        delete (window as any).SafeImage;
      }
    };
  }, []);

  const gotToPreviousSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  const isLastSlide = currentSlideIndex === orderedSlides.length - 1;

  const goToNextSlide = () => {
    if (currentSlideIndex < orderedSlides.length - 1) {
      setCurrentSlideIndex((prev) => Math.min(prev + 1, orderedSlides.length - 1));
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    toast.info("Preparing your presentation for download...");
    
    try {
      // Create a download URL based on the presentationId
      const downloadUrl = `/api/download/${params.presentationId}`;
      
      console.log("Fetching presentation from:", downloadUrl);
      
      // Fetch the file with a 30 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(downloadUrl, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Try to parse error as JSON
        let errorData;
        try {
          errorData = await response.json();
          toast.error(errorData.message || "Failed to download presentation");
        } catch (err) {
          void err; // Using void to explicitly ignore the err variable
          toast.error(`Download failed with status: ${response.status}`);
        }
        console.error("Download error:", response.status, errorData);
        return;
      }
      
      // Check content type to determine if it's JSON (error) or file
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // It's an error message in JSON format
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to download presentation");
        console.error("Download returned JSON error:", errorData);
        return;
      }
      
      // If it's a file, create a blob and download it
      const blob = await response.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `presentation-${params.presentationId}.pptx`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
      toast.success("Presentation downloaded successfully!");
      
    } catch (error) {
      console.error("Download error:", error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error("Download timed out. Please try again.");
      } else {
        toast.error("Failed to download presentation. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Update the ordered slides whenever the slides in the store change
  useEffect(() => {
    setOrderedSlides(getOrderedSlides());
  }, [getOrderedSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (currentSlideIndex < orderedSlides.length - 1) {
          setCurrentSlideIndex((prev) => Math.min(prev + 1, orderedSlides.length - 1));
        }
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [orderedSlides.length, currentSlideIndex]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSharedProjectById(params.presentationId as string);
        if (res.status !== 200 || !res.data) {
          toast.error("Error", {
            description: "Unable to fetch presentation",
          });
          return;
        }

        const findTheme = themes.find(
          (theme) => theme.name === res.data.themeName
        );
        setCurrentTheme(findTheme || themes[0]);
        setTheme(findTheme?.type === "dark" ? "dark" : "light");
        setProject(res.data);
        setSlides(JSON.parse(JSON.stringify(res.data.slides)));
      } catch (err) {
        void err; // Using void to explicitly ignore the err variable
        toast.error("Error", { description: "An unexpected error occurred" });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.presentationId, setCurrentTheme, setProject, setSlides, setTheme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orderedSlides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">This presentation has no slides.</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div
          className="relative w-full h-full"
          style={{
            aspectRatio: "16/9",
            maxHeight: "100vh",
            maxWidth: "177.78vh",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className={`w-full h-full pointer-events-none ${orderedSlides[currentSlideIndex].className}`}
              style={{
                backgroundColor: currentTheme.slideBackgroundColor,
                backgroundImage: currentTheme.gradientBackground,
                color: currentTheme.accentColor,
                fontFamily: currentTheme.fontFamily,
              }}
            >
              <MasterRecursiveComponent
                content={orderedSlides[currentSlideIndex].content}
                onContentChange={() => {}}
                slideId={orderedSlides[currentSlideIndex].id}
                isPreview={false}
                isEditable={false}
              />
            </motion.div>
          </AnimatePresence>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={gotToPreviousSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm py-2 px-3">
              {currentSlideIndex + 1} / {orderedSlides.length}
            </span>
            {!isLastSlide && (
              <Button variant="outline" size="icon" onClick={goToNextSlide}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default SharedPage; 