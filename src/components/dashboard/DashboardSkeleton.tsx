import React from 'react';

export default function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8 animate-pulse p-4">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <div className="h-10 w-48 bg-slate-200 rounded-lg mb-2"></div>
                    <div className="h-4 w-64 bg-slate-100 rounded-lg"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm h-48 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                            <div className="w-12 h-4 bg-slate-50 rounded"></div>
                        </div>
                        <div>
                            <div className="w-24 h-3 bg-[#b78a5d]/10 rounded mb-2"></div>
                            <div className="w-16 h-8 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <div className="lg:col-span-2 p-8 rounded-[3rem] bg-white border border-slate-100 h-96">
                    <div className="h-6 w-32 bg-slate-200 rounded mb-8"></div>
                    <div className="w-full h-64 bg-slate-50 rounded-3xl border border-dashed border-slate-200"></div>
                </div>
                <div className="p-8 rounded-[3rem] bg-white border border-slate-100 h-96">
                    <div className="h-6 w-32 bg-slate-200 rounded mb-8"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((j) => (
                            <div key={j} className="h-12 w-full bg-slate-50 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
