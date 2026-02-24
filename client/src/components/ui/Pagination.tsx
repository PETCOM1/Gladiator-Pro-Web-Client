import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalResults?: number;
    resultRange?: string;
    className?: string;
}

export function TacticalPagination({
    currentPage,
    totalPages,
    onPageChange,
    totalResults,
    resultRange,
    className
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-tactical-border bg-brand-midnight/10", className)}>
            <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-tactical-muted uppercase tracking-[0.2em]">
                    Mission Results: <span className="text-white">{resultRange || `Page ${currentPage} of ${totalPages}`}</span>
                </p>
                {totalResults !== undefined && (
                    <span className="text-[9px] font-bold text-brand-cyan/60 uppercase tracking-widest px-2 py-0.5 bg-brand-cyan/5 border border-brand-cyan/10 rounded-full">
                        {totalResults} Total Objects
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-tactical-border text-tactical-muted hover:border-brand-cyan/30 hover:text-brand-cyan disabled:opacity-30 disabled:hover:border-tactical-border disabled:hover:text-tactical-muted transition-all"
                >
                    <ChevronLeft size={14} />
                </button>

                <div className="flex items-center mx-2 gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-[10px] font-black transition-all border",
                                    currentPage === pageNum
                                        ? "bg-brand-cyan text-brand-midnight border-brand-cyan shadow-[0_0_15px_rgba(0,194,255,0.2)]"
                                        : "bg-tactical-surface border-tactical-border text-tactical-muted hover:border-brand-cyan/30 hover:text-white"
                                )}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-tactical-border text-tactical-muted hover:border-brand-cyan/30 hover:text-brand-cyan disabled:opacity-30 disabled:hover:border-tactical-border disabled:hover:text-tactical-muted transition-all"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
