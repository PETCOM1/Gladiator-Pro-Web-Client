import { useState, useMemo } from 'react';
import {
    LayoutDashboard, Users, MapPin, Settings,
    BarChart3, Shield, Clock, AlertTriangle, Search, Plus,
    UserX, Edit3, Save, Trash2, X, Briefcase, ChevronRight,
    Lock, Mail, Building
} from 'lucide-react';
import { DashboardLayout } from './layout/DashboardLayout';
import { mockSites as initialSites, mockOfficers as initialOfficers, mockUsers as initialUsers } from '../../services/mockData';
import type { Site, Officer, User } from '../../types/user';
import { cn } from '@/utils/cn';

// --- Types ---
type TenantView = 'overview' | 'sites' | 'supervisors' | 'officers' | 'analytics' | 'settings';

// --- Helpers ---
const badgeStyle: Record<string, string> = {
    'on-duty': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'off-duty': 'bg-tactical-muted/10 text-tactical-muted border-tactical-border',
    'on-leave': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

// --- Shared Components ---

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
    return (
        <div className="mb-6">
            <h1 className="text-xl font-black text-white uppercase tracking-tight">{title}</h1>
            {sub && <p className="text-xs text-tactical-muted mt-1">{sub}</p>}
        </div>
    );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-tactical-surface border border-tactical-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-tactical-border">
                    <h2 className="text-sm font-black text-white uppercase tracking-tight">{title}</h2>
                    <button onClick={onClose} className="text-tactical-muted hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// --- Main Component ---

export function TenantAdminDashboard({ onLogout }: { onLogout: () => void }) {
    const [activeView, setActiveView] = useState<TenantView>('overview');

    // --- State ---
    const [sites, setSites] = useState<Site[]>(initialSites.filter(s => s.tenantId === 'tenant-1'));
    const [officers, setOfficers] = useState<Officer[]>(initialOfficers.filter(o => o.tenantId === 'tenant-1'));
    const [supervisors, setSupervisors] = useState<User[]>(
        Object.values(initialUsers).filter(u => u.role === 'site-manager' && u.tenantId === 'tenant-1')
    );
    const [companyInfo, setCompanyInfo] = useState({
        name: 'SecureCorp Solutions',
        email: 'ceo@securecorp.com',
        branding: 'Tactical'
    });

    // --- Modals State ---
    const [isSupModalOpen, setIsSupModalOpen] = useState(false);
    const [editingSupervisor, setEditingSupervisor] = useState<User | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningSite, setAssigningSite] = useState<Site | null>(null);

    // --- Supervisor Actions ---
    const saveSupervisor = (data: Partial<User>) => {
        if (editingSupervisor) {
            setSupervisors(prev => prev.map(s => s.id === editingSupervisor.id ? { ...s, ...data } : s));
        } else {
            const newSup: User = {
                id: `sup-${Date.now()}`,
                name: data.name || '',
                email: data.email || '',
                role: 'site-manager',
                tenantId: 'tenant-1'
            };
            setSupervisors(prev => [...prev, newSup]);
        }
        setIsSupModalOpen(false);
        setEditingSupervisor(null);
    };

    const deleteSupervisor = (id: string) => {
        setSupervisors(prev => prev.filter(s => s.id !== id));
        // Also unassign from sites
        setSites(prev => prev.map(s => s.managerId === id ? { ...s, managerId: '', managerName: 'Unassigned' } : s));
    };

    // --- Site Assignment ---
    const assignSupervisorToSite = (siteId: string, supervisorId: string) => {
        const sup = supervisors.find(s => s.id === supervisorId);
        setSites(prev => prev.map(s =>
            s.id === siteId
                ? { ...s, managerId: supervisorId, managerName: sup?.name || 'Unassigned' }
                : s
        ));
        setIsAssignModalOpen(false);
    };

    // --- Views ---

    const OverviewView = () => {
        const kpis = [
            { label: 'Operational Sites', value: String(sites.length), icon: MapPin, note: 'Daily Monitoring' },
            { label: 'Active Officers', value: String(officers.filter(o => o.status === 'on-duty').length), icon: Users, note: 'Full Roster' },
            { label: 'Total Supervisors', value: String(supervisors.length), icon: Shield, note: 'Site Admin Team' },
            { label: 'Avg Compliance', value: '94%', icon: BarChart3, note: 'Target 95%' },
        ];

        return (
            <div>
                <SectionHeader title="Operational Overview" sub={`Managing operations for ${companyInfo.name}`} />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {kpis.map((k) => {
                        const Icon = k.icon;
                        return (
                            <div key={k.label} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 group hover:border-brand-cyan/30 transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">{k.label}</span>
                                    <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border group-hover:border-brand-cyan/20 flex items-center justify-center">
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
                    <div className="xl:col-span-2 bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-tactical-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-brand-cyan" />
                                <h2 className="text-sm font-black text-white uppercase tracking-tight">Rapid Site Status</h2>
                            </div>
                            <button onClick={() => setActiveView('sites')} className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline">View Sites »</button>
                        </div>
                        <div className="divide-y divide-tactical-border">
                            {sites.slice(0, 3).map(site => (
                                <div key={site.id} className="px-6 py-4 flex items-center justify-between hover:bg-brand-midnight/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0">
                                            <Shield size={14} className="text-brand-cyan/60" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">{site.name}</p>
                                            <p className="text-[10px] text-tactical-muted uppercase tracking-widest">{site.totalOfficers} Personnel</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest leading-none mb-1">Supervisor</p>
                                        <p className="text-[10px] font-bold text-white">{site.managerName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-brand-midnight rounded-2xl p-6 border border-brand-cyan/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Users size={16} className="text-brand-cyan" />
                                <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Admin Oversight</span>
                            </div>
                            <p className="text-2xl font-black text-white leading-tight mb-2">Manage your Supervisor Network</p>
                            <p className="text-xs text-tactical-muted">Add new site managers or reassign them to critical sectors as needed.</p>
                        </div>
                        <button onClick={() => setActiveView('supervisors')} className="w-full mt-6 py-3 bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]">
                            Supervisor Command →
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const SiteManagementView = () => {
        return (
            <div>
                <SectionHeader title="Site Management" sub="Operational oversight level" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites.map(site => (
                        <div key={site.id} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 hover:border-brand-cyan/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-midnight border border-tactical-border flex items-center justify-center group-hover:border-brand-cyan/20">
                                    <Shield size={20} className="text-brand-cyan" />
                                </div>
                                <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Active</div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{site.name}</h3>
                            <p className="text-xs text-tactical-muted mb-4 truncate">{site.location}</p>

                            <div className="space-y-3 pt-4 border-t border-tactical-border/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">Supervisor</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white">{site.managerName}</span>
                                        <button
                                            onClick={() => { setAssigningSite(site); setIsAssignModalOpen(true); }}
                                            className="p-1.5 rounded-lg bg-brand-midnight border border-tactical-border hover:border-brand-cyan/40 text-brand-cyan transition-all"
                                        >
                                            <Edit3 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">Officers</span>
                                    <span className="text-xs font-bold text-white">{site.totalOfficers} Units</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="bg-brand-midnight/30 border-2 border-dashed border-tactical-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-tactical-muted hover:border-brand-cyan/30 hover:text-brand-cyan transition-all">
                        <Plus size={32} />
                        <span className="text-xs font-black uppercase tracking-widest">Register New Site</span>
                    </button>
                </div>

                <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign Supervisor: ${assigningSite?.name}`}>
                    <div className="space-y-4">
                        <p className="text-xs text-tactical-muted">Select a supervisor from your network to manage this site.</p>
                        <div className="space-y-2">
                            {supervisors.map(sup => (
                                <button
                                    key={sup.id}
                                    onClick={() => assignSupervisorToSite(assigningSite?.id || '', sup.id)}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all",
                                        assigningSite?.managerId === sup.id
                                            ? "bg-brand-cyan/10 border-brand-cyan text-brand-cyan"
                                            : "bg-brand-midnight border-tactical-border text-white hover:border-brand-cyan/30"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center">
                                            <Users size={14} className={assigningSite?.managerId === sup.id ? "text-brand-cyan" : "text-tactical-muted"} />
                                        </div>
                                        <span className="text-sm font-bold">{sup.name}</span>
                                    </div>
                                    {assigningSite?.managerId === sup.id && <Lock size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    };

    const SupervisorManagementView = () => {
        const [search, setSearch] = useState('');

        return (
            <div>
                <SectionHeader title="Supervisor Network" sub="Manage company administrators and site managers" />
                <div className="mb-6 flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full bg-tactical-surface border border-tactical-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingSupervisor(null); setIsSupModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-cyan/10"
                    >
                        <Plus size={14} /> Register Supervisor
                    </button>
                </div>

                <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-4 px-6 py-4 border-b border-tactical-border/50 bg-brand-midnight/30">
                        {['Administrator', 'Contact', 'Sector Assignment', 'Administrative Actions'].map(h => (
                            <span key={h} className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">{h}</span>
                        ))}
                    </div>
                    <div className="divide-y divide-tactical-border">
                        {supervisors.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
                            <div key={s.id} className="grid grid-cols-4 px-6 py-5 items-center hover:bg-brand-midnight/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0">
                                        <Briefcase size={14} className="text-brand-cyan/60" />
                                    </div>
                                    <span className="text-sm font-bold text-white truncate">{s.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-tactical-muted">
                                    <Mail size={12} className="shrink-0" />
                                    <span className="text-xs truncate">{s.email}</span>
                                </div>
                                <div>
                                    {sites.find(site => site.managerId === s.id) ? (
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            <span className="text-xs font-bold truncate">{sites.find(site => site.managerId === s.id)?.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-tactical-muted italic">
                                            <div className="w-1.5 h-1.5 rounded-full bg-tactical-muted" />
                                            <span className="text-xs tracking-tight">Floating Admin</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingSupervisor(s); setIsSupModalOpen(true); }}
                                        className="p-2 rounded-lg bg-brand-midnight border border-tactical-border hover:border-brand-cyan/40 text-brand-cyan transition-all"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteSupervisor(s.id)}
                                        className="p-2 rounded-lg bg-brand-midnight border border-tactical-border hover:border-red-500/40 text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Modal isOpen={isSupModalOpen} onClose={() => setIsSupModalOpen(false)} title={editingSupervisor ? "Update Admin Profile" : "Register New Supervisor"}>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); saveSupervisor({ name: String(formData.get('name')), email: String(formData.get('email')) }); }}>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Full Name</label>
                            <input name="name" defaultValue={editingSupervisor?.name} required placeholder="e.g. Marcus Aurelius" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Email Interface</label>
                            <input name="email" type="email" defaultValue={editingSupervisor?.email} required placeholder="admin@securecorp.com" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button type="submit" className="flex-1 bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:scale-[1.02] transition-all">
                                {editingSupervisor ? "Save Profile Changes" : "Confirm Registration"}
                            </button>
                            <button type="button" onClick={() => setIsSupModalOpen(false)} className="px-6 border border-tactical-border text-tactical-muted font-black text-[10px] uppercase tracking-widest rounded-xl hover:text-white transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    };

    const OfficerDirectoryView = () => {
        const [search, setSearch] = useState('');
        const [siteFilter, setSiteFilter] = useState('all');

        const filteredOfficers = officers.filter(o =>
            (o.name.toLowerCase().includes(search.toLowerCase()) || o.role.toLowerCase().includes(search.toLowerCase())) &&
            (siteFilter === 'all' || o.siteId === siteFilter)
        );

        return (
            <div>
                <SectionHeader title="Personnel Roster" sub="Operational officer database and live status tracking" />
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Filter by name or tactical role..."
                            className="w-full bg-tactical-surface border border-tactical-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50"
                        />
                    </div>
                    <select
                        value={siteFilter}
                        onChange={e => setSiteFilter(e.target.value)}
                        className="bg-tactical-surface border border-tactical-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50 h-[42px]"
                    >
                        <option value="all">All Sites</option>
                        {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-5 px-6 py-4 border-b border-tactical-border/50 bg-brand-midnight/30">
                        {['Personnel', 'Tactical Role', 'Live Status', 'Deployment Sector', 'Active Shift'].map(h => (
                            <span key={h} className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">{h}</span>
                        ))}
                    </div>
                    <div className="divide-y divide-tactical-border">
                        {filteredOfficers.map(o => (
                            <div key={o.id} className="grid grid-cols-5 px-6 py-4 items-center hover:bg-brand-midnight/10 transition-all">
                                <span className="text-xs font-bold text-white">{o.name}</span>
                                <span className="text-[10px] font-black text-brand-cyan/60 uppercase tracking-widest">{o.role}</span>
                                <div>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${badgeStyle[o.status]}`}>
                                        {o.status.replace('-', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={10} className="text-tactical-muted" />
                                    <span className="text-xs text-white font-medium">{sites.find(s => s.id === o.siteId)?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={10} className="text-brand-cyan" />
                                    <span className="text-[10px] font-bold text-white">{o.shiftStart ? `${o.shiftStart} - ${o.shiftEnd}` : 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                        {filteredOfficers.length === 0 && (
                            <div className="px-6 py-12 text-center text-tactical-muted text-sm">No personnel matching current filters.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const OperationalAnalyticsView = () => {
        return (
            <div>
                <SectionHeader title="Operational Oversight" sub="Personnel deployment trends and incident response analytics" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <BarChart3 size={16} className="text-brand-cyan" />
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">Compliance History</h3>
                            </div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+2.4% vs L/M</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Checkpoint Compliance', val: 98, color: 'bg-brand-cyan' },
                                { label: 'Incident Response Time', val: 88, color: 'bg-emerald-400' },
                                { label: 'NFC Patrol Coverage', val: 94, color: 'bg-purple-500' },
                                { label: 'Equipment Uptime', val: 92, color: 'bg-amber-400' },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[10px] font-bold text-tactical-muted uppercase tracking-wide">{item.label}</span>
                                        <span className="text-[10px] font-black text-white">{item.val}%</span>
                                    </div>
                                    <div className="h-1.5 bg-brand-midnight rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock size={16} className="text-brand-cyan" />
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">Personnel Distribution</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {sites.map(site => {
                                const onDuty = officers.filter(o => o.siteId === site.id && o.status === 'on-duty').length;
                                const pct = (onDuty / (site.totalOfficers || 1)) * 100;
                                return (
                                    <div key={site.id} className="flex items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate">{site.name}</p>
                                            <div className="h-1.5 bg-brand-midnight rounded-full mt-1.5 overflow-hidden">
                                                <div className="h-full bg-brand-cyan" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-xs font-black text-white">{onDuty}</p>
                                            <p className="text-[9px] font-black text-tactical-muted uppercase tracking-tight">Active</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-brand-midnight/40 border-2 border-dashed border-tactical-border rounded-[2.5rem] p-12 text-center">
                    <BarChart3 size={48} className="text-tactical-muted mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-black text-white uppercase tracking-tight mb-2 italic">Advanced Tactical Intelligence</p>
                    <p className="text-sm text-tactical-muted max-w-md mx-auto">Predictive heatmaps and site-specific threat modeling modules are currently being provisioned for your enterprise.</p>
                </div>
            </div>
        );
    };

    const SettingsView = () => {
        return (
            <div>
                <SectionHeader title="Company Configuration" sub="Manage your company profile and platform preferences" />
                <div className="max-w-4xl space-y-6">
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Building size={20} className="text-brand-cyan" />
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Enterprise Profile</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Company Name</label>
                                    <input value={companyInfo.name} onChange={e => setCompanyInfo(c => ({ ...c, name: e.target.value }))} className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Primary Administrator Email</label>
                                    <input value={companyInfo.email} onChange={e => setCompanyInfo(c => ({ ...c, email: e.target.value }))} className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-3 block">Strategic UI Branding</label>
                                    <div className="flex gap-3">
                                        {['Tactical', 'Softened', 'High-Contrast'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setCompanyInfo(c => ({ ...c, branding: t }))}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    companyInfo.branding === t ? "bg-brand-cyan border-brand-cyan text-brand-midnight" : "bg-brand-midnight border-tactical-border text-tactical-muted hover:border-brand-cyan/40"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-500/20 transition-all">
                                    <Save size={14} className="inline mr-2" /> Save System Preferences
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-black text-red-400 uppercase tracking-tight mb-1">Critical Account Actions</h3>
                            <p className="text-xs text-tactical-muted">Requesting account suspension or platform migration requires verified identity keys.</p>
                        </div>
                        <button className="px-6 py-2.5 border border-red-500/40 text-red-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-all">
                            Initiate Termination
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Operational Overview', active: activeView === 'overview', onClick: () => setActiveView('overview') },
        { icon: <MapPin size={20} />, label: 'Site Management', active: activeView === 'sites', onClick: () => setActiveView('sites') },
        { icon: <Shield size={20} />, label: 'Supervisor Network', active: activeView === 'supervisors', onClick: () => setActiveView('supervisors'), badge: supervisors.length },
        { icon: <Users size={20} />, label: 'Personnel Roster', active: activeView === 'officers', onClick: () => setActiveView('officers') },
        { icon: <BarChart3 size={20} />, label: 'Tactical Analytics', active: activeView === 'analytics', onClick: () => setActiveView('analytics') },
        { icon: <Settings size={20} />, label: 'System Settings', active: activeView === 'settings', onClick: () => setActiveView('settings') },
    ];

    return (
        <DashboardLayout
            title="Tenant Command"
            role="Enterprise Owner"
            sidebarItems={sidebarItems}
            currentUser={{ name: 'John Tenant' }}
            onLogout={onLogout}
        >
            {activeView === 'overview' && <OverviewView />}
            {activeView === 'sites' && <SiteManagementView />}
            {activeView === 'supervisors' && <SupervisorManagementView />}
            {activeView === 'officers' && <OfficerDirectoryView />}
            {activeView === 'analytics' && <OperationalAnalyticsView />}
            {activeView === 'settings' && <SettingsView />}
        </DashboardLayout>
    );
}
