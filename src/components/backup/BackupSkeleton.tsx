import React from 'react';

export default function BackupSkeleton() {
    return (
        <div className="flex flex-col h-full space-y-6 animate-pulse p-4">
            <div>
                <div className="h-10 w-64 bg-slate-200 rounded-lg mb-2"></div>
                <div className="h-4 w-48 bg-slate-100 rounded-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm h-80 flex flex-col justify-between">
                        <div>
                            <div className="h-12 w-12 rounded-lg bg-slate-100 mb-4"></div>
                            <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                            <div className="h-4 w-full bg-slate-50 rounded mb-2"></div>
                            <div className="h-4 w-2/3 bg-slate-50 rounded"></div>
                        </div>
                        <div className="h-10 w-full bg-slate-100 rounded-md"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
