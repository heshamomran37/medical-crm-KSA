'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-6 p-8 text-center animate-fade-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50 text-red-600 ring-8 ring-red-50">
                <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    عذراً، حدث خطأ غير متوقع
                </h2>
                <p className="mx-auto max-w-[500px] text-muted-foreground">
                    واجه النظام مشكلة تقنية أثناء تحميل البيانات. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني إذا استمرت المشكلة.
                </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <button
                    onClick={() => reset()}
                    className="flex items-center justify-center gap-2 px-8 h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                    <RefreshCcw size={16} />
                    إعادة المحاولة
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 h-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                >
                    العودة للرئيسية
                </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 max-w-2xl overflow-auto rounded-lg bg-red-50 p-4 text-left text-xs font-mono text-red-800">
                    {error.message}
                    {error.stack && <pre className="mt-2 text-[10px]">{error.stack}</pre>}
                </div>
            )}
        </div>
    );
}
