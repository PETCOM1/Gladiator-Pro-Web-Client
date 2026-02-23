import {
    LayoutDashboard, Users, FileText, Settings,
    BarChart3, MapPin, TrendingUp, Shield, Clock, AlertTriangle
} from 'lucide-react';
import { DashboardLayout } from './layout/DashboardLayout';

const kpis = [
    { label: 'Operational Sites', value: '12', icon: MapPin, note: 'All Active' },
    { label: 'Active Officers', value: '148', icon: Users, note: '3 On Leave' },
    { label: 'Open Incidents', value: '4', icon: AlertTriangle, note: '1 Critical' },
    { label: 'Avg Response', value: '3.2m', icon: Clock, note: 'This Week' },
];

const sites = [
    { name: 'North Sector Complex', manager: 'Sarah S.', officers: 28, incidents: 1, compliance: 94 },
    { name: 'Harbor Freight Terminal', manager: 'James O.', officers: 42, incidents: 2, compliance: 88 },
    { name: 'Central Mall – Security', manager: 'Lynn P.', officers: 19, incidents: 0, compliance: 100 },
    { name: 'Westside Data Center', manager: 'Thomas M.', officers: 35, incidents: 0, compliance: 97 },
];

const shifts = [
    { officer: 'K. Mthembu', role: 'Gate A Supervisor', time: '06:00 – 14:00', status: 'on-duty' },
    { officer: 'B. Nkosi', role: 'Patrol Lead – North', time: '14:00 – 22:00', status: 'upcoming' },
    { officer: 'F. Dlamini', role: 'Control Room', time: '22:00 – 06:00', status: 'upcoming' },
];

const shiftStyle = {
    'on-duty': 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30',
    'upcoming': 'bg-brand-midnight text-tactical-muted border-tactical-border',
};

export function TenantAdminDashboard({ onLogout }: { onLogout: () => void }) {
    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Company Overview', active: true },
        { icon: <MapPin size={20} />, label: 'Site Management' },
        { icon: <Users size={20} />, label: 'Officer Directory' },
        { icon: <FileText size={20} />, label: 'Enterprise Reports' },
        { icon: <BarChart3 size={20} />, label: 'Performance Analytics' },
        { icon: <Settings size={20} />, label: 'Company Settings' },
    ];

    return (
        <DashboardLayout
            title="Tenant Command"
            role="Tenant Administrator"
            sidebarItems={sidebarItems}
            currentUser={{ name: 'John Tenant' }}
            onLogout={onLogout}
        >
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpis.map((k) => {
                    const Icon = k.icon;
                    return (
                        <div key={k.label} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 group hover:border-brand-cyan/30 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">{k.label}</span>
                                <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border group-hover:border-brand-cyan/20 flex items-center justify-center transition-all">
                                    <Icon size={14} className="text-brand-cyan" />
                                </div>
                            </div>
                            <span className="text-3xl font-black text-white block">{k.value}</span>
                            <span className="text-[10px] text-tactical-muted uppercase tracking-wide mt-1 block">{k.note}</span>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Site Grid */}
                <div className="xl:col-span-2 bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-tactical-border">
                        <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-brand-cyan" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">Site Performance</h2>
                        </div>
                        <button className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline">View All »</button>
                    </div>

                    {/* Table header */}
                    <div className="grid grid-cols-5 px-6 py-3 border-b border-tactical-border/50">
                        {['Site', 'Manager', 'Officers', 'Incidents', 'Compliance'].map((h) => (
                            <span key={h} className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">{h}</span>
                        ))}
                    </div>

                    <div className="divide-y divide-tactical-border">
                        {sites.map((s) => (
                            <div key={s.name} className="grid grid-cols-5 px-6 py-4 items-center hover:bg-brand-midnight/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-brand-midnight border border-tactical-border group-hover:border-brand-cyan/20 flex items-center justify-center shrink-0 transition-all">
                                        <Shield size={12} className="text-brand-cyan/60 group-hover:text-brand-cyan transition-colors" />
                                    </div>
                                    <span className="text-xs font-bold text-white truncate">{s.name}</span>
                                </div>
                                <span className="text-xs text-tactical-muted">{s.manager}</span>
                                <span className="text-xs font-bold text-white">{s.officers}</span>
                                <span className={`text-xs font-bold ${s.incidents > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{s.incidents}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-brand-midnight rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${s.compliance >= 95 ? 'bg-emerald-400' : s.compliance >= 85 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${s.compliance}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-white w-9 text-right">{s.compliance}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">

                    {/* Upcoming Shifts */}
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-tactical-border">
                            <Clock size={16} className="text-brand-cyan" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">Shift Roster</h2>
                        </div>
                        <div className="divide-y divide-tactical-border">
                            {shifts.map((sh) => (
                                <div key={sh.officer} className="px-6 py-4 flex flex-col gap-1.5 hover:bg-brand-midnight/30 transition-all">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-white">{sh.officer}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${shiftStyle[sh.status as keyof typeof shiftStyle]}`}>{sh.status}</span>
                                    </div>
                                    <span className="text-[10px] text-tactical-muted">{sh.role}</span>
                                    <span className="text-[10px] font-bold text-brand-cyan/80">{sh.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compliance Overview */}
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp size={14} className="text-brand-cyan" />
                            <h2 className="text-sm font-black text-white uppercase tracking-tight">Compliance Score</h2>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-5xl font-black text-white">94<span className="text-xl text-tactical-muted">%</span></div>
                            <div className="flex-1">
                                <div className="h-2 bg-brand-midnight rounded-full overflow-hidden">
                                    <div className="h-full w-[94%] bg-gradient-to-r from-brand-cyan to-emerald-400 rounded-full" />
                                </div>
                                <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-wide">↑ 2% vs last month</p>
                            </div>
                        </div>
                        <p className="text-xs text-tactical-muted">Based on 12 sites, 4,200+ officer checkpoints and 380 incident resolutions this month.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
