import React from 'react';

export default function ActivitySkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="h-10 w-64 bg-slate-200 rounded-lg mb-2"></div>
                    <div className="h-4 w-48 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-10 w-32 bg-slate-100 rounded-md"></div>
                    <div className="h-10 w-32 bg-slate-100 rounded-md"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-slate-100 p-4 h-28">
                        <div className="flex justify-between mb-4">
                            <div className="w-24 h-4 bg-slate-100 rounded"></div>
                            <div className="w-4 h-4 bg-slate-100 rounded"></div>
                        </div>
                        <div className="w-10 h-8 bg-slate-200 rounded"></div>
                        <div className="w-20 h-3 bg-slate-50 rounded mt-2"></div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-50 h-14 bg-slate-50/50"></div>
                <div className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 h-24 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                            <div className="flex-1 space-y-3">
                                <div className="w-40 h-4 bg-slate-200 rounded"></div>
                                <div className="w-full h-3 bg-slate-50 rounded"></div>
                                <div className="w-32 h-3 bg-slate-50 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
