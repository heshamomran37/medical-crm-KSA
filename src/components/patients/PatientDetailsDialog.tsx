"use client";

import { X, Phone, Mail, MapPin, Calendar, User, Activity, Building, Crown, Facebook, Instagram, Ghost, Send, Music } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface Patient {
    id: string;
    name: string;
    type: string;
    phone: string | null;
    whatsapp: string | null;
    telegram: string | null;
    instagram: string | null;
    snapchat: string | null;
    facebook: string | null;
    tiktok: string | null;
    email: string | null;
    address: string | null;
    gender: string | null;
    birthDate: Date | null;
    status: string;
    followUpStatus: string | null;
}

interface PatientDetailsDialogProps {
    patient: Patient;
    isOpen: boolean;
    onClose: () => void;
}

export function PatientDetailsDialog({ patient, isOpen, onClose }: PatientDetailsDialogProps) {
    const { t, isRTL } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className={cn(
                "bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto",
                isRTL && "text-right"
            )} dir={isRTL ? "rtl" : "ltr"}>

                {/* Header Pattern */}
                <div className="absolute top-0 inset-x-0 h-32 bg-[#0a192f] overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>

                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all",
                        isRTL ? "left-4" : "right-4"
                    )}
                >
                    <X size={18} />
                </button>

                <div className="relative px-8 pb-8 pt-20">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className={cn(
                            "w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white text-3xl",
                            patient.type === 'Company' ? 'bg-[#b78a5d] text-[#0a192f]' : 'bg-white text-[#0a192f]'
                        )}>
                            {patient.type === 'Company' ? <Building size={40} /> : <User size={40} />}
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-[#0a192f]">{patient.name}</h2>
                            <div className="flex items-center justify-center gap-2">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    patient.type === 'Company' ? 'bg-[#0a192f] text-white border-transparent' : 'bg-slate-100 text-slate-600 border-slate-200'
                                )}>
                                    {t(patient.type.toLowerCase())}
                                </span>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    patient.status === 'Admitted' ? 'bg-green-50 text-green-700 border-green-200' :
                                        patient.status === 'New' ? 'bg-[#b78a5d]/10 text-[#b78a5d] border-[#b78a5d]/20' :
                                            'bg-slate-50 text-slate-500 border-slate-100'
                                )}>
                                    {t(patient.status.toLowerCase())}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid gap-8">

                        {/* 1. Statistics / Quick Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1 text-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('gender')}</span>
                                <p className="font-bold text-[#0a192f]">{patient.gender ? (patient.gender === 'Male' ? t('male') : t('female')) : '—'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1 text-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('birth_date')}</span>
                                <p className="font-bold text-[#0a192f]">
                                    {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US') : '—'}
                                </p>
                            </div>
                        </div>

                        {/* 2. Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-[#b78a5d] uppercase tracking-widest flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-[#b78a5d]"></span>
                                {t('contact_info')}
                            </h3>
                            <div className="grid gap-3">
                                {patient.phone && (
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-[#b78a5d]/50 transition-colors group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#b78a5d] group-hover:text-white transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs text-slate-400 font-medium block">Phone</span>
                                            <span className="text-sm font-bold text-[#0a192f]" dir="ltr">{patient.phone}</span>
                                        </div>
                                    </div>
                                )}
                                {patient.email && (
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-[#b78a5d]/50 transition-colors group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#b78a5d] group-hover:text-white transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs text-slate-400 font-medium block">Email</span>
                                            <span className="text-sm font-bold text-[#0a192f]">{patient.email}</span>
                                        </div>
                                    </div>
                                )}
                                {patient.address && (
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-[#b78a5d]/50 transition-colors group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#b78a5d] group-hover:text-white transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs text-slate-400 font-medium block">{t('address')}</span>
                                            <span className="text-sm font-bold text-[#0a192f]">{patient.address}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Social Media */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-[#b78a5d] uppercase tracking-widest flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-[#b78a5d]"></span>
                                {t('social_media')}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {patient.facebook && (
                                    <a href={`https://facebook.com/${patient.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/10 text-[#1877F2] font-bold text-sm hover:bg-[#1877F2] hover:text-white transition-all">
                                        <Facebook size={18} /> Facebook
                                    </a>
                                )}
                                {patient.instagram && (
                                    <a href={`https://instagram.com/${patient.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E4405F]/10 text-[#E4405F] font-bold text-sm hover:bg-[#E4405F] hover:text-white transition-all">
                                        <Instagram size={18} /> Instagram
                                    </a>
                                )}
                                {patient.tiktok && (
                                    <a href={`https://tiktok.com/@${patient.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 text-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                                        <Music size={18} /> TikTok
                                    </a>
                                )}
                                {patient.snapchat && (
                                    <a href={`https://snapchat.com/add/${patient.snapchat.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFC00]/20 text-yellow-600 font-bold text-sm hover:bg-[#FFFC00] hover:text-black transition-all">
                                        <Ghost size={18} /> Snapchat
                                    </a>
                                )}
                                {patient.telegram && (
                                    <a href={`https://t.me/${patient.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#229ED9]/10 text-[#229ED9] font-bold text-sm hover:bg-[#229ED9] hover:text-white transition-all">
                                        <Send size={18} /> Telegram
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* 4. Notes/Activity */}
                        {patient.followUpStatus && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-[#b78a5d] uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-8 h-[2px] bg-[#b78a5d]"></span>
                                    {t('activity')}
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
                                    &ldquo;{patient.followUpStatus}&rdquo;
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
