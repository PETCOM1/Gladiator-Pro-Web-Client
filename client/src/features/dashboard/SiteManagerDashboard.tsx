import {
    LayoutDashboard, Users, Shield, Clock,
    Map, AlertTriangle, CheckCircle2, XCircle, Radio
} from 'lucide-react';
import { DashboardLayout } from './layout/DashboardLayout';

const stats = [
    { label: 'On-Duty Guards', value: '26', icon: Users },
    { label: 'Patrol Points', value: '18', icon: Map },
    { label: 'Post Orders', value: '6', icon: Shield },
    { label: 'Active Incidents', value: '1', icon: AlertTriangle },
];

const patrols = [
    { sector: 'Gate A – Main Entry', officer: 'K. Mthembu', time: '2m ago', status: 'verified' },
    { sector: 'Perimeter – North Fence', officer: 'L. Khumalo', time: '8m ago', status: 'verified' },
    { sector: 'Loading Bay B', officer: 'T. Ndlovu', time: '15m ago', status: 'missed' },
    { sector: 'Roof Access Hatch', officer: 'S. Dlamini', time: '22m ago', status: 'verified' },
    { sector: 'Server Room – Level 3', officer: 'P. Mokoena', time: '31m ago', status: 'verified' },
];

const onDuty = [
    { name: 'K. Mthembu', post: 'Gate A', start: '06:00', radio: '01' },
    { name: 'L. Khumalo', post: 'North Patrol', start: '06:00', radio: '02' },
    { name: 'T. Ndlovu', post: 'Loading Bay', start: '06:00', radio: '03' },
    { name: 'S. Dlamini', post: 'Roof Access', start: '06:00', radio: '04' },
];

const incidents = [
    { ref: 'INC-1094', desc: 'Unauthorized vehicle — Gate B', time: '09:12', open: true },
    { ref: 'INC-1091', desc: 'Fire alarm test — Level 2', time: '07:45', open: false },
];

export function SiteManagerDashboard({ onLogout }: { onLogout: () => void }) {
    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Site Operations', active: true },
        { icon: <Clock size={20} />, label: 'Shift Schedule' },
        { icon: <Map size={20} />, label: 'NFC Patrols' },
        { icon: <Users size={20} />, label: 'Active Guards' },
        { icon: <Shield size={20} />, label: 'Post Orders' },
        { icon: <AlertTriangle size={20} />, label: 'Incidents' },
    ];

    return (
        <DashboardLayout
            title="Site Command"
            role="Site Manager"
            sidebarItems={sidebarItems}
            currentUser={{ name: 'Sarah Supervisor' }}
            onLogout={onLogout}
        >
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 group hover:border-brand-cyan/30 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">{s.label}</span>
                                <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border group-hover:border-brand-cyan/20 flex items-center justify-center transition-all">
                                    <Icon size={14} className="text-brand-cyan" />
                                </div>
                            </div>
                            <span className="text-3xl font-black text-white">{s.value}</span>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Patrol Feed */}
                <div className="xl:col-span-2 bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-tactical-border">
                        <div className="flex items-center gap-3">
                            <Map size={16} className="text-brand-cyan" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">NFC Patrol Log</h2>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full">
                            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    <div className="divide-y divide-tactical-border">
                        {patrols.map((p) => (
                            <div key={p.sector} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-midnight/30 transition-all group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all ${p.status === 'verified'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40'
                                        : 'bg-red-500/10 border-red-500/20 group-hover:border-red-500/40'
                                    }`}>
                                    {p.status === 'verified'
                                        ? <CheckCircle2 size={18} className="text-emerald-400" />
                                        : <XCircle size={18} className="text-red-400" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-white uppercase tracking-wide truncate">{p.sector}</p>
                                    <p className="text-[10px] text-tactical-muted uppercase tracking-widest">{p.officer}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${p.status === 'verified'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>{p.status}</span>
                                    <p className="text-[9px] text-tactical-muted mt-1">{p.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-6">

                    {/* On-Duty Officers */}
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-tactical-border">
                            <Users size={16} className="text-brand-cyan" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">On Duty Now</h2>
                            <span className="ml-auto text-[10px] font-black text-emerald-400 uppercase">↑ {onDuty.length} Officers</span>
                        </div>
                        <div className="divide-y divide-tactical-border">
                            {onDuty.map((o) => (
                                <div key={o.name} className="flex items-center gap-4 px-6 py-3.5 hover:bg-brand-midnight/30 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center text-[10px] font-black text-brand-cyan">
                                        {o.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white">{o.name}</p>
                                        <p className="text-[10px] text-tactical-muted uppercase">{o.post} · Since {o.start}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-tactical-muted">
                                        <Radio size={10} />
                                        <span className="text-[9px] font-bold">{o.radio}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Incident Log */}
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-tactical-border">
                            <AlertTriangle size={16} className="text-amber-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">Today's Incidents</h2>
                        </div>
                        <div className="divide-y divide-tactical-border">
                            {incidents.map((inc) => (
                                <div key={inc.ref} className="px-6 py-4 hover:bg-brand-midnight/30 transition-all">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-tactical-muted uppercase">{inc.ref} · {inc.time}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${inc.open ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {inc.open ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-white">{inc.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
