"use client";

import dynamic from "next/dynamic";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });
const Header = dynamic(() => import("./Header"), { ssr: false });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isRTL } = useLanguage();

    return (
        <div
            className={cn(
                "flex h-screen bg-[#020617] relative overflow-hidden text-white",
                isRTL && "font-arabic"
            )}
            dir={isRTL ? "rtl" : "ltr"}
            suppressHydrationWarning
        >
            {/* Dynamic Medical Spider Web Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <ParticleBackground color="#0a192f" particleCount={40} linkDistance={150} opacity={0.05} />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#b78a5d]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0a192f]/5 rounded-full blur-[100px]"></div>
            </div>

            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <Header />
                <main className="flex-1 overflow-y-auto animate-fade-up relative z-0 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
