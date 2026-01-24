import React from 'react';

export default function PatientsSkeleton() {
    return (
        <div className="flex flex-col gap-6 p-4 animate-pulse">
            <div className="flex justify-between items-center mb-4">
                <div className="h-10 w-48 bg-slate-200 rounded-lg"></div>
                <div className="h-10 w-32 bg-slate-100 rounded-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm h-64 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                            <div className="w-16 h-6 bg-slate-50 rounded-full"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                            <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <div className="h-4 w-24 bg-slate-50 rounded"></div>
                            <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
