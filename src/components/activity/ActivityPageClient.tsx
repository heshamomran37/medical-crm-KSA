"use client";

import React from 'react';
import { Activity, UserPlus, Calendar, AlertCircle, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface ActivityLog {
    id: string;
    action: string;
    description: string;
    createdAt: Date;
    userId?: string | null;
}

interface ActivityPageClientProps {
    activities: ActivityLog[];
}

export default function ActivityPageClient({ activities }: ActivityPageClientProps) {
    const { t, isRTL } = useLanguage();

    const getIcon = (action: string) => {
        if (action.includes('patient')) return UserPlus;
        if (action.includes('appointment')) return Calendar;
        if (action.includes('employee')) return UserPlus;
        if (action.includes('alert')) return AlertCircle;
        return Activity;
    };

    const getColor = (action: string) => {
        if (action.includes('patient')) return "text-green-600 bg-green-50";
        if (action.includes('appointment')) return "text-blue-600 bg-blue-50";
        if (action.includes('employee')) return "text-purple-600 bg-purple-50";
        if (action.includes('alert')) return "text-red-600 bg-red-50";
        return "text-slate-600 bg-slate-50";
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return t('just_now');
        if (minutes < 60) return `${minutes} ${t('minutes_ago')}`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${t('hours_ago')}`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className={cn("flex flex-col gap-6", isRTL && "text-right")}>
            <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4", isRTL && "md:flex-row-reverse")}>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('system_activity')}</h1>
                    <p className="text-muted-foreground mt-1">{t('monitor_activity_desc')}</p>
                </div>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <select className={cn("h-10 px-3 rounded-md border border-input bg-background text-sm", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
                        <option>{t('all_activities')}</option>
                        <option>{t('patients')}</option>
                        <option>{t('appointments')}</option>
                        <option>{t('employees')}</option>
                        <option>{t('system')}</option>
                    </select>
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className={cn("p-4 border-b border-border bg-muted/30", isRTL && "text-right")}>
                    <h2 className={cn("font-semibold flex items-center gap-2", isRTL && "flex-row-reverse")}>
                        <Clock size={18} />
                        {t('recent_activity')}
                    </h2>
                </div>
                <div className="divide-y divide-border">
                    {activities.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground italic">
                            {t('no_activities_found')}
                        </div>
                    ) : (
                        activities.map((activity) => {
                            const Icon = getIcon(activity.action.toLowerCase());
                            const colorClass = getColor(activity.action.toLowerCase());
                            return (
                                <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
                                    <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className={cn("flex-1", isRTL && "text-right")}>
                                                    <h3 className="font-semibold text-foreground uppercase text-xs tracking-wider">{activity.action}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                                    <div className={cn("flex items-center gap-3 mt-2 text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
                                                        <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                            {activity.userId ? 'User' : 'System'}
                                                        </span>
                                                        <span>{formatTimestamp(activity.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                {activities.length > 0 && (
                    <div className="p-4 text-center border-t border-border">
                        <button className="text-sm text-primary hover:underline font-medium">
                            {t('load_more_activities')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
