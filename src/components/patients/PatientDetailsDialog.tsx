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
                "bg-[#0a192f] w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar",
                isRTL && "text-right"
            )} dir={isRTL ? "rtl" : "ltr"}>

                {/* Decorative background glows */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#b78a5d]/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#b78a5d]/5 blur-[100px] rounded-full pointer-events-none" />

                {/* Header Pattern */}
                <div className="absolute top-0 inset-x-0 h-40 bg-[#0a192f]">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
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
                            "w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-[#0a192f] text-3xl transition-transform hover:scale-105 duration-500",
                            patient.type === 'Company' ? 'bg-[#b78a5d] text-white' : 'bg-white/10 text-white'
                        )}>
                            {patient.type === 'Company' ? <Building size={40} /> : <User size={40} />}
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif italic text-white tracking-tight">{patient.name}</h2>
                            <div className="flex items-center justify-center gap-2">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    patient.type === 'Company' ? 'bg-[#b78a5d] text-white border-transparent' : 'bg-white/5 text-slate-400 border-white/10'
                                )}>
                                    {t(patient.type.toLowerCase())}
                                </span>
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    patient.status === 'Admitted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        patient.status === 'New' ? 'bg-[#b78a5d]/10 text-[#f59e0b] border-[#b78a5d]/20' :
                                            'bg-white/5 text-slate-500 border-white/10'
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
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-1 text-center transition-all hover:bg-white/10">
                                <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-[0.2em]">{t('gender')}</span>
                                <p className="font-bold text-white text-lg">{patient.gender ? (patient.gender === 'Male' ? t('male') : t('female')) : '—'}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-1 text-center transition-all hover:bg-white/10">
                                <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-[0.2em]">{t('birth_date')}</span>
                                <p className="font-bold text-white text-lg">
                                    {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US') : '—'}
                                </p>
                            </div>
                        </div>

                        {/* 2. Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-[#f59e0b] uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-12 h-px bg-gradient-to-r from-[#f59e0b] to-transparent opacity-50"></span>
                                {t('contact_info')}
                            </h3>
                            <div className="grid gap-3">
                                {patient.phone && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#b78a5d]/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#b78a5d] group-hover:text-white transition-all">
                                            <Phone size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Phone</span>
                                            <span className="text-md font-bold text-white tracking-tight" dir="ltr">{patient.phone}</span>
                                        </div>
                                    </div>
                                )}
                                {patient.email && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#b78a5d]/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#b78a5d] group-hover:text-white transition-all">
                                            <Mail size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Email</span>
                                            <span className="text-md font-bold text-white tracking-tight">{patient.email}</span>
                                        </div>
                                    </div>
                                )}
                                {patient.address && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#b78a5d]/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#b78a5d] group-hover:text-white transition-all">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">{t('address')}</span>
                                            <span className="text-md font-bold text-white tracking-tight leading-relaxed">{patient.address}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Social Media */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-[#f59e0b] uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-12 h-px bg-gradient-to-r from-[#f59e0b] to-transparent opacity-50"></span>
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
                                    <a href={`https://tiktok.com/@${patient.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white hover:text-black transition-all">
                                        <Music size={16} /> TikTok
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
                                <h3 className="text-[11px] font-black text-[#f59e0b] uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-12 h-px bg-gradient-to-r from-[#f59e0b] to-transparent opacity-50"></span>
                                    {t('activity')}
                                </h3>
                                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-slate-300 leading-relaxed italic text-md shadow-inner">
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
