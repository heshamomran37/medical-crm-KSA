"use client";

import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DebugPage() {
    const { data: session } = useSession();

    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Session Debug Info</h1>
                <div className="bg-card p-4 rounded-lg border">
                    <pre className="text-sm">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </div>
            </div>
        </DashboardLayout>
    );
}
