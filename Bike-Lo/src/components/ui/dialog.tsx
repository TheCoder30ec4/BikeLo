import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

export function Dialog({ open, onOpenChange, children, title }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop - Light and Dark Mode */}
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" />
      
      {/* Dialog Content */}
      <div
        className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-800 relative transition-all">
          {/* Close Button - Always visible with Light/Dark Mode styling */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 pr-14 bg-gray-50/50 dark:bg-gray-800/30 rounded-t-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100" style={{ fontFamily: "'Noto Serif', serif" }}>
                {title}
              </h2>
            </div>
          )}
          <div className={`${title ? "p-6" : "p-6 pt-12"} bg-white dark:bg-gray-900 ${title ? "rounded-b-xl" : "rounded-xl"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
