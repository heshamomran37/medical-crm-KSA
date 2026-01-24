'use client';

import { RefreshCcw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body>
                <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-8 text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-red-600">خطأ في النظام</h1>
                        <p className="text-lg text-slate-600">
                            حدث خطأ فادح يمنع التطبيق من العمل بشكل صحيح.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 font-bold"
                        >
                            <RefreshCcw size={20} />
                            تحديث الصفحة
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-10 max-w-3xl overflow-auto rounded border border-red-200 bg-red-50 p-6 text-sm font-mono text-red-900">
                            <h2 className="mb-2 font-bold text-red-800 underline">تفاصيل الخطأ:</h2>
                            <p>{error.message}</p>
                            {error.stack && <pre className="mt-4 text-[10px] whitespace-pre-wrap">{error.stack}</pre>}
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
