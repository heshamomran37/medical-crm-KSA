import React from 'react';

export default function SettingsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-4">
            <div>
                <div className="h-10 w-64 bg-slate-200 rounded-lg mb-2"></div>
                <div className="h-4 w-48 bg-slate-100 rounded-lg"></div>
            </div>

            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-slate-100 w-10 h-10"></div>
                            <div className="h-6 w-48 bg-slate-200 rounded"></div>
                        </div>
                        <div className="h-4 w-64 bg-slate-50 rounded"></div>
                    </div>
                    <div className="p-6 grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-100 rounded"></div>
                            <div className="h-10 w-full bg-slate-50 rounded-md border border-slate-100"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-100 rounded"></div>
                            <div className="h-10 w-full bg-slate-50 rounded-md border border-slate-100"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
