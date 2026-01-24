"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Phone, Mail, MessageCircle, Building, User, Trash2, AlertTriangle, Facebook, Instagram, Ghost, Send, Music, UserPlus, List, ExternalLink } from "lucide-react";
import { PatientForm } from "@/components/patients/PatientForm";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog";
import { PatientDetailsDialog } from "@/components/patients/PatientDetailsDialog";
import { ImportPatientsDialog } from "@/components/patients/ImportPatientsDialog";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { deletePatient } from "@/lib/actions";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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

interface PatientsPageClientProps {
    patients: Patient[];
    query: string;
    type: string;
    totalPages: number;
    currentPage: number;
}

export function PatientsPageClient({ patients, query, type, totalPages, currentPage }: PatientsPageClientProps) {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [viewPatient, setViewPatient] = useState<Patient | null>(null);
    const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
    const { t, isRTL } = useLanguage();

    const openWhatsAppLink = async (patient: Patient) => {
        if (!patient.whatsapp) return;
        let phone = patient.whatsapp.replace(/[^0-9]/g, '');
        // Normalize for Egypt (010xxx -> 2010xxx)
        if (phone.startsWith("0") && !phone.startsWith("00")) {
            phone = "2" + phone;
        }
        const msgText = `Hello ${patient.name}, this is MedCRM.`;
        const msg = encodeURIComponent(msgText);

        // --- Sync with INTERNAL CHAT HISTORY ---
        try {
            await fetch("/api/whatsapp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "log_sent_message",
                    phoneNumber: phone,
                    message: msgText
                })
            });
        } catch (err) {
            console.error("Failed to sync message log:", err);
        }

        // Link strategy: api.whatsapp.com for best universal bridging
        const url = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;

        // Anchor strategy: Browsers handle target on links more reliably than window.open
        const link = document.createElement('a');
        link.href = url;
        link.target = 'WhatsAppGlobalSession';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        if (!patientToDelete) return;
        const result = await deletePatient(patientToDelete.id);
        if (result.success) {
            setPatientToDelete(null);
        } else {
            alert(result.message);
        }
    };

    const getPageLink = (page: number) => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (type) params.set('type', type);
        params.set('page', page.toString());
        return `/patients?${params.toString()}`;
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-[#0a192f] flex items-center gap-3">
                            <User className="text-[#b78a5d]" size={36} />
                            {t('patients_title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 pr-1">{t('patients_subtitle')}</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'list' ? "bg-[#0a192f] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                            )}
                        >
                            <List size={16} />
                            <span>{t('patient_list')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('add')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === 'add' ? "bg-[#0a192f] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                            )}
                        >
                            <UserPlus size={16} />
                            <span>{t('add_new_patient')}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <ImportPatientsDialog />
                    </div>
                </div>

                {/* Content Switching */}
                {activeTab === 'list' ? (
                    <>
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
                            <form className="contents">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isRTL ? "right-3" : "left-3")} size={16} />
                                    <input
                                        name="q"
                                        defaultValue={query}
                                        type="text"
                                        placeholder={t('search_patients')}
                                        className={cn(
                                            "w-full h-11 rounded-2xl border border-slate-100 bg-slate-50/50 px-9 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all",
                                            isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
                                        )}
                                    />
                                </div>
                                <select
                                    name="type"
                                    defaultValue={type}
                                    className="h-11 px-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 appearance-none min-w-[140px] font-bold text-slate-600"
                                >
                                    <option value="">{t('all_types')}</option>
                                    <option value="Individual">{t('individual')}</option>
                                    <option value="Company">{t('company')}</option>
                                </select>
                                <button className="flex items-center gap-2 px-6 h-11 rounded-2xl bg-[#0a192f] text-white text-xs font-black uppercase tracking-widest hover:bg-[#112240] transition-all shadow-lg shadow-[#0a192f]/10">
                                    {t('apply')}
                                </button>
                            </form>
                        </div>

                        {/* Patients Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {patients.length === 0 ? (
                                <div className="col-span-full p-20 text-center text-slate-400 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-8 shadow-inner">
                                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl shadow-slate-200/50">
                                        <User size={48} className="text-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-black text-2xl uppercase tracking-[0.2em] text-slate-300">{t('archive_empty')}</p>
                                        <p className="text-xs font-medium text-slate-400 italic">No clinical records found in this view.</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('add')}
                                        className="h-12 px-8 rounded-2xl bg-[#0a192f] text-white text-xs font-black uppercase tracking-widest hover:bg-[#112240] transition-all shadow-xl shadow-[#0a192f]/10 flex items-center gap-2"
                                    >
                                        <UserPlus size={16} />
                                        {t('add_new_patient')}
                                    </button>
                                </div>
                            ) : (
                                patients.map((patient, idx) => (
                                    <div
                                        key={patient.id}
                                        onClick={() => setSelectedPatient(patient)}
                                        className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-camel transition-all duration-500 p-8 space-y-6 cursor-pointer group animate-fade-up relative overflow-hidden"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-105 ${patient.type === 'Company'
                                                    ? 'bg-[#0a192f] text-[#b78a5d]'
                                                    : 'bg-slate-50 text-[#0a192f]'
                                                    }`}>
                                                    {patient.type === 'Company' ? <Building size={28} /> : <User size={28} />}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif italic text-[#0a192f] group-hover:text-[#b78a5d] transition-colors duration-300">{patient.name}</h3>
                                                    <span className={cn(
                                                        "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border mt-2",
                                                        patient.type === 'Company'
                                                            ? 'bg-[#0a192f] text-white border-transparent'
                                                            : 'bg-slate-50 text-slate-500 border-slate-100'
                                                    )}>
                                                        {t(patient.type.toLowerCase())}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-4 pt-6 relative z-10 border-t border-slate-50">
                                            {patient.phone && (
                                                <div className="flex items-center gap-4 text-slate-400 group-hover:text-[#0a192f] transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#b78a5d]/10 group-hover:text-[#b78a5d]">
                                                        <Phone size={16} />
                                                    </div>
                                                    <span className="font-bold text-sm tracking-tight" dir="ltr">{patient.phone}</span>
                                                </div>
                                            )}
                                            {patient.email && (
                                                <div className="flex items-center gap-4 text-slate-400 group-hover:text-[#0a192f] transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#b78a5d]/10 group-hover:text-[#b78a5d]">
                                                        <Mail size={16} />
                                                    </div>
                                                    <span className="truncate font-bold text-sm tracking-tight">{patient.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status & Quick Actions */}
                                        <div className="flex flex-col gap-5 pt-6 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <span className={cn(
                                                    "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                    patient.status === 'Admitted' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        patient.status === 'New' ? 'bg-[#b78a5d]/10 text-[#b78a5d] border-[#b78a5d]/20' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'
                                                )}>
                                                    {t(patient.status.toLowerCase())}
                                                </span>
                                            </div>

                                            <div className="flex gap-2 flex-wrap mb-4" onClick={(e) => e.stopPropagation()}>
                                                {patient.facebook && (
                                                    <a href={`https://facebook.com/${patient.facebook}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 flex items-center justify-center transition-all duration-300 shadow-sm" title="Facebook">
                                                        <Facebook size={18} />
                                                    </a>
                                                )}
                                                {patient.tiktok && (
                                                    <a href={`https://tiktok.com/@${patient.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-slate-50 text-black hover:bg-black hover:text-white border border-slate-200 flex items-center justify-center transition-all duration-300 shadow-sm" title="TikTok">
                                                        <Music size={18} />
                                                    </a>
                                                )}
                                                {patient.instagram && (
                                                    <a href={`https://instagram.com/${patient.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white border border-pink-100 flex items-center justify-center transition-all duration-300 shadow-sm" title="Instagram">
                                                        <Instagram size={18} />
                                                    </a>
                                                )}
                                                {patient.snapchat && (
                                                    <a href={`https://snapchat.com/add/${patient.snapchat.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-400 hover:text-white border border-yellow-100 flex items-center justify-center transition-all duration-300 shadow-sm" title="Snapchat">
                                                        <Ghost size={18} />
                                                    </a>
                                                )}
                                                {patient.telegram && (
                                                    <a href={`https://t.me/${patient.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white border border-sky-100 flex items-center justify-center transition-all duration-300 shadow-sm" title="Telegram">
                                                        <Send size={18} />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                                                {patient.whatsapp && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openWhatsAppLink(patient);
                                                        }}
                                                        className="flex-1 h-12 rounded-2xl bg-white hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 transition-all duration-500 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-sm group/wa"
                                                    >
                                                        <MessageCircle size={16} className="group-hover/wa:animate-bounce" />
                                                        {t('chat')}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setViewPatient(patient);
                                                    }}
                                                    className="h-12 px-6 rounded-2xl bg-[#0a192f] text-white hover:bg-[#112240] transition-all duration-300 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-[#0a192f]/10"
                                                >
                                                    {t('details')}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPatientToDelete(patient);
                                                    }}
                                                    className="w-12 h-12 rounded-2xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 transition-all duration-300 flex items-center justify-center shadow-sm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))
                            )}
                        </div>


                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={cn("flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm mt-8", isRTL && "md:flex-row-reverse")}>
                                <div className="text-sm text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    {t('showing_page')} <span className="text-[#0a192f]">{currentPage}</span> {t('of')} <span className="text-[#0a192f]">{totalPages}</span>
                                </div>
                                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                                    <Link
                                        href={getPageLink(1)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center transition-all duration-300",
                                            currentPage === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-slate-50 text-[#0a192f]"
                                        )}
                                    >
                                        <ChevronsLeft size={18} />
                                    </Link>
                                    <Link
                                        href={getPageLink(currentPage - 1)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center transition-all duration-300",
                                            currentPage === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-slate-50 text-[#0a192f]"
                                        )}
                                    >
                                        <ChevronLeft size={18} />
                                    </Link>

                                    <div className="flex items-center gap-2 mx-2">
                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Link
                                                    key={pageNum}
                                                    href={getPageLink(pageNum)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300",
                                                        currentPage === pageNum
                                                            ? "bg-[#b78a5d] text-white shadow-lg shadow-[#b78a5d]/20 scale-105"
                                                            : "border border-slate-100 hover:bg-slate-50 text-[#0a192f]"
                                                    )}
                                                >
                                                    {pageNum}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <Link
                                        href={getPageLink(currentPage + 1)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center transition-all duration-300",
                                            currentPage === totalPages ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-slate-50 text-[#0a192f]"
                                        )}
                                    >
                                        <ChevronRight size={18} />
                                    </Link>
                                    <Link
                                        href={getPageLink(totalPages)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center transition-all duration-300",
                                            currentPage === totalPages ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-slate-50 text-[#0a192f]"
                                        )}
                                    >
                                        <ChevronsRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <PatientForm onSuccess={() => {
                            setTimeout(() => setActiveTab('list'), 1500);
                        }} />
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            {selectedPatient && (
                <EditPatientDialog
                    patient={selectedPatient}
                    isOpen={!!selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {patientToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t('confirm_delete')}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('delete_patient_msg')}
                            </p>
                            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-sm font-bold text-slate-700">{patientToDelete.name}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 flex gap-3 justify-end">
                            <button
                                onClick={() => setPatientToDelete(null)}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Dialog */}
            {viewPatient && (
                <PatientDetailsDialog
                    patient={viewPatient}
                    isOpen={!!viewPatient}
                    onClose={() => setViewPatient(null)}
                />
            )}
        </DashboardLayout>
    );
}
