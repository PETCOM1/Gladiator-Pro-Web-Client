import {
    LayoutDashboard, Building2, ShieldCheck, Settings,
    AlertCircle, Activity, TrendingUp, TrendingDown,
    CheckCircle2, Globe, Zap, Clock
} from 'lucide-react';
import { DashboardLayout } from './layout/DashboardLayout';

const statCards = [
    { label: 'Active Tenants', value: '47', change: '+3', up: true, icon: Building2 },
    { label: 'Global Officers', value: '2,841', change: '+128', up: true, icon: ShieldCheck },
    { label: 'Incidents (24h)', value: '12', change: '-4', up: false, icon: AlertCircle },
    { label: 'System Uptime', value: '99.9%', change: '+0.1%', up: true, icon: Activity },
];

const tenants = [
    { name: 'SecureCorp Solutions', plan: 'Enterprise', officers: 320, status: 'active' },
    { name: 'Ironclad Security Ltd', plan: 'Pro', officers: 148, status: 'active' },
    { name: 'Vanguard Patrol Inc.', plan: 'Pro', officers: 96, status: 'onboarding' },
    { name: 'Atlas Guard Services', plan: 'Basic', officers: 44, status: 'active' },
];

const incidents = [
    { id: 'INC-1094', site: 'North Sector Complex', severity: 'high', time: '2m ago' },
    { id: 'INC-1093', site: 'Harbor Freight Terminal', severity: 'medium', time: '14m ago' },
    { id: 'INC-1091', site: 'Central Mall – Gate C', severity: 'low', time: '1h ago' },
];

const severityStyle = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
};

export function GlobalCommandDashboard({ onLogout }: { onLogout: () => void }) {
    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'System Overview', active: true },
        { icon: <Building2 size={20} />, label: 'Tenant Management' },
        { icon: <ShieldCheck size={20} />, label: 'License Controls' },
        { icon: <AlertCircle size={20} />, label: 'Global Incidents' },
        { icon: <Activity size={20} />, label: 'System Health' },
        { icon: <Settings size={20} />, label: 'Platform Config' },
    ];

    return (
        <DashboardLayout
            title="Global Command"
            role="Super Administrator"
            sidebarItems={sidebarItems}
            currentUser={{ name: 'Marcus Global' }}
            onLogout={onLogout}
        >
            {/* Stat Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 flex flex-col gap-3 group hover:border-brand-cyan/30 transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">{s.label}</span>
                                <div className="w-8 h-8 rounded-lg bg-brand-midnight flex items-center justify-center border border-tactical-border group-hover:border-brand-cyan/20 transition-all">
                                    <Icon size={14} className="text-brand-cyan" />
                                </div>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black text-white">{s.value}</span>
                                <span className={`text-[10px] font-black mb-1 flex items-center gap-0.5 ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {s.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main 3-col grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Tenant Directory */}
                <div className="xl:col-span-2 bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-tactical-border">
                        <div className="flex items-center gap-3">
                            <Globe size={16} className="text-brand-cyan" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">Tenant Directory</h2>
                        </div>
                        <button className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline">View All »</button>
                    </div>
                    <div className="divide-y divide-tactical-border">
                        {tenants.map((t) => (
                            <div key={t.name} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-midnight/30 transition-all group">
                                <div className="w-9 h-9 rounded-xl bg-brand-midnight border border-tactical-border group-hover:border-brand-cyan/20 flex items-center justify-center shrink-0 transition-all">
                                    <Building2 size={16} className="text-brand-cyan/60 group-hover:text-brand-cyan transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{t.name}</p>
                                    <p className="text-[10px] text-tactical-muted uppercase tracking-widest">{t.officers} Officers · {t.plan}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${t.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                    {t.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-6">

                    {/* New Tenant Queue CTA */}
                    <div className="bg-brand-midnight rounded-2xl p-6 border border-brand-cyan/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-transparent pointer-events-none" />
                        <div className="flex items-center gap-2 mb-1 relative z-10">
                            <Zap size={14} className="text-brand-cyan" />
                            <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Onboarding Queue</span>
                        </div>
                        <p className="text-3xl font-black text-white relative z-10 mt-1">3 <span className="text-base font-medium text-tactical-muted">Pending</span></p>
                        <button className="w-full mt-4 bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(0,194,255,0.2)] relative z-10">
                            Review Onboarding →
                        </button>
                    </div>

                    {/* Incidents Feed */}
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden flex-1">
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-tactical-border">
                            <AlertCircle size={16} className="text-red-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">Live Incidents</h2>
                            <span className="ml-auto w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        </div>
                        <div className="divide-y divide-tactical-border">
                            {incidents.map((inc) => (
                                <div key={inc.id} className="px-6 py-4 hover:bg-brand-midnight/30 transition-all">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-tactical-muted uppercase">{inc.id}</span>
                                        <div className="flex items-center gap-1 text-tactical-muted text-[10px]">
                                            <Clock size={10} /> {inc.time}
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-white mb-2">{inc.site}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${severityStyle[inc.severity as keyof typeof severityStyle]}`}>
                                        {inc.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Platform Status</span>
                        </div>
                        {['API Gateway', 'Auth Service', 'NFC Engine', 'Alert Queue'].map((svc) => (
                            <div key={svc} className="flex items-center justify-between py-2">
                                <span className="text-xs text-tactical-muted">{svc}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span className="text-[9px] text-emerald-400 font-bold uppercase">Operational</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
