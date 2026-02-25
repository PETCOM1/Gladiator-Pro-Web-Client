import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Building2, Globe, Zap, CreditCard,
    Wrench, UserPlus, MessageSquare, Search,
    ChevronDown, ChevronUp, X, Check,
    Ban, Unlock, Activity, TrendingUp, TrendingDown,
    CheckCircle2, AlertCircle, Clock, User as UserIcon, Plus
} from 'lucide-react';
import { DashboardLayout } from './layout/DashboardLayout';
import {
    mockTenants, mockPayments, mockTickets,
    mockMaintenanceLogs, mockOnboarding
} from '../../services/mockData';
import { TacticalPagination } from '../../components/ui/Pagination';
import type { Tenant, SupportTicket, OnboardingRequest, MaintenanceLog } from '../../types/user';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const planColor: Record<string, string> = {
    enterprise: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    pro: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    basic: 'bg-tactical-muted/10 text-tactical-muted border-tactical-muted/20',
};
const statusColor: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
    onboarding: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    open: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    'in-progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed: 'bg-tactical-muted/10 text-tactical-muted border-tactical-muted/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    corrective: 'bg-red-500/10 text-red-400 border-red-500/20',
    preventive: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    emergency: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};
const severityColor: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
};

const fmt = (d: string) => new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtCur = (n: number) => `R ${n.toLocaleString('en-ZA')}`;

function SectionHeader({ sub }: { title?: string; sub?: string }) {
    return sub ? (
        <div className="mb-6">
            <p className="text-xs text-tactical-muted mt-1">{sub}</p>
        </div>
    ) : null;
}
function Badge({ label, color }: { label: string; color: string }) {
    return <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${color}`}>{label}</span>;
}
function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
    return <div onClick={onClick} className={`bg-tactical-surface border border-tactical-border rounded-2xl ${className}`}>{children}</div>;
}
function TableHeader({ cols }: { cols: string[] }) {
    return (
        <div className="grid px-6 py-3 border-b border-tactical-border bg-brand-midnight/30" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
            {cols.map(c => <span key={c} className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">{c}</span>)}
        </div>
    );
}

// ─── Overview ────────────────────────────────────────────────────────────────
function OverviewView({ onNav }: { onNav: (v: string) => void }) {
    const totalRevenue = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const overdue = mockPayments.filter(p => p.status === 'overdue').length;
    const openTickets = mockTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
    const statCards = [
        { label: 'Active Tenants', value: String(mockTenants.filter(t => t.status === 'active').length), change: '+2 this month', up: true, icon: Building2, nav: 'tenants' },
        { label: 'Monthly Revenue', value: fmtCur(totalRevenue), change: '+R 1,999', up: true, icon: CreditCard, nav: 'payments' },
        { label: 'Open Tickets', value: String(openTickets), change: overdue > 0 ? `${overdue} overdue invoices` : 'All clear', up: openTickets === 0, icon: MessageSquare, nav: 'tickets' },
        { label: 'System Uptime', value: '99.9%', change: '+0.1%', up: true, icon: Activity, nav: 'maintenance' },
    ];
    return (
        <div>
            <SectionHeader sub="Operational snapshot of the Gladiator Pro SaaS platform" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <button key={s.label} onClick={() => onNav(s.nav)} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 flex flex-col gap-3 group hover:border-brand-cyan/40 transition-all text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">{s.label}</span>
                                <div className="w-8 h-8 rounded-lg bg-brand-midnight flex items-center justify-center border border-tactical-border group-hover:border-brand-cyan/20"><Icon size={14} className="text-brand-cyan" /></div>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-white leading-none">{s.value}</span>
                            </div>
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{s.change}
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-tactical-border">
                        <div className="flex items-center gap-3"><Globe size={16} className="text-brand-cyan" /><h2 className="text-sm font-black text-white uppercase tracking-tight">Tenant Directory</h2></div>
                        <button onClick={() => onNav('tenants')} className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline">View All »</button>
                    </div>
                    <div className="divide-y divide-tactical-border">
                        {mockTenants.slice(0, 4).map((t) => (
                            <div key={t.id} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-midnight/30 transition-all">
                                <div className="w-9 h-9 rounded-xl bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0"><Building2 size={16} className="text-brand-cyan/60" /></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{t.name}</p>
                                    <p className="text-[10px] text-tactical-muted uppercase tracking-widest">{t.officers} Officers · {t.location}</p>
                                </div>
                                <Badge label={t.status} color={statusColor[t.status]} />
                            </div>
                        ))}
                    </div>
                </Card>
                <div className="flex flex-col gap-6">
                    <div className="bg-brand-midnight rounded-2xl p-6 border border-brand-cyan/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-transparent pointer-events-none" />
                        <div className="flex items-center gap-2 mb-1 relative z-10"><Zap size={14} className="text-brand-cyan" /><span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Onboarding Queue</span></div>
                        <p className="text-3xl font-black text-white relative z-10 mt-1">{mockOnboarding.filter(o => o.status === 'pending').length} <span className="text-base font-medium text-tactical-muted">Pending</span></p>
                        <button onClick={() => onNav('onboarding')} className="w-full mt-4 bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(0,194,255,0.2)] relative z-10">Review Onboarding →</button>
                    </div>
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4"><CheckCircle2 size={14} className="text-emerald-400" /><span className="text-[10px] font-black text-white uppercase tracking-widest">Platform Status</span></div>
                        {[
                            { name: 'API Gateway', ok: mockMaintenanceLogs.find(m => m.service === 'API Gateway' && m.status !== 'resolved') === undefined },
                            { name: 'Auth Service', ok: true },
                            { name: 'NFC Sync Engine', ok: mockMaintenanceLogs.find(m => m.service === 'NFC Sync Engine' && m.status !== 'resolved') === undefined },
                            { name: 'Alert Queue', ok: true },
                        ].map((svc) => (
                            <div key={svc.name} className="flex items-center justify-between py-2">
                                <span className="text-xs text-tactical-muted">{svc.name}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${svc.ok ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
                                    <span className={`text-[9px] font-bold uppercase ${svc.ok ? 'text-emerald-400' : 'text-red-400'}`}>{svc.ok ? 'Operational' : 'Degraded'}</span>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => onNav('maintenance')} className="w-full mt-3 text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline text-left">View Maintenance Log →</button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ─── Tenant Management ────────────────────────────────────────────────────────
function TenantsView() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('all');
    const [tenants, setTenants] = useState(mockTenants);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 4;

    const [showAddModal, setShowAddModal] = useState(false);
    const [newTenant, setNewTenant] = useState({
        name: '',
        contactEmail: '',
        subscriptionPlan: 'basic' as Tenant['subscriptionPlan'],
        location: '',
        monthlyFee: 1999,
    });

    const toggleStatus = (id: string) => {
        setTenants(prev => prev.map(t =>
            t.id === id ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t
        ));
    };

    const handleAddTenant = (e: React.FormEvent) => {
        e.preventDefault();
        const tenant: Tenant = {
            id: `tenant-${Date.now()}`,
            ...newTenant,
            status: 'onboarding',
            officers: 0,
            createdAt: new Date().toISOString().split('T')[0],
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
        setTenants(prev => [tenant, ...prev]);
        setShowAddModal(false);
        setNewTenant({
            name: '',
            contactEmail: '',
            subscriptionPlan: 'basic',
            location: '',
            monthlyFee: 1999,
        });
    };

    const filtered = tenants.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.contactEmail.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || t.status === filter;
        return matchSearch && matchFilter;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    useEffect(() => setCurrentPage(1), [search, filter]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <SectionHeader sub="Manage all tenants, plans, and account statuses" />
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,194,255,0.15)]"
                >
                    <Plus size={14} /> Provision New Tenant
                </button>
            </div>

            {showAddModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setShowAddModal(false)}
                >
                    <Card
                        className="w-full max-w-xl p-8 relative animate-in zoom-in-95 duration-300 bg-tactical-surface/60 backdrop-blur-xl border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-tactical-muted hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Provision New Tenant</h2>
                            <p className="text-[10px] text-brand-cyan font-black uppercase tracking-[0.2em] mt-1">Operational Deployment Stage</p>
                        </div>

                        <form onSubmit={handleAddTenant} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Company Name</label>
                                    <input
                                        required
                                        value={newTenant.name}
                                        onChange={e => setNewTenant(p => ({ ...p, name: e.target.value }))}
                                        className="bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                                        placeholder="Tenant Entity Name"
                                    />
                                </div>
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Contact Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={newTenant.contactEmail}
                                        onChange={e => setNewTenant(p => ({ ...p, contactEmail: e.target.value }))}
                                        className="bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                                        placeholder="admin@tenant.com"
                                    />
                                </div>
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Subscription Plan</label>
                                    <select
                                        value={newTenant.subscriptionPlan}
                                        onChange={e => setNewTenant(p => ({ ...p, subscriptionPlan: e.target.value as Tenant['subscriptionPlan'] }))}
                                        className="bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50 h-[46px]"
                                    >
                                        <option value="basic">Basic (R1,999/mo)</option>
                                        <option value="pro">Pro (R5,999/mo)</option>
                                        <option value="enterprise">Enterprise (R12,999/mo)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Operational Hub (Location)</label>
                                    <input
                                        required
                                        value={newTenant.location}
                                        onChange={e => setNewTenant(p => ({ ...p, location: e.target.value }))}
                                        className="bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                                        placeholder="City, Province"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-tactical-border text-tactical-muted text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-midnight transition-all">Cancel Mission</button>
                                <button type="submit" className="flex-2 px-12 py-3 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] shadow-[0_0_24px_rgba(0,194,255,0.2)] transition-all">Execute Provisioning</button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full bg-tactical-surface border border-tactical-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-brand-cyan/50" />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'onboarding', 'suspended'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-brand-cyan text-brand-midnight border-brand-cyan' : 'bg-tactical-surface border-tactical-border text-tactical-muted hover:border-brand-cyan/30'}`}>{f}</button>
                    ))}
                </div>
            </div>
            <Card className="overflow-hidden">
                <TableHeader cols={['Company', 'Plan', 'Officers', 'Location', 'Monthly Fee', 'Status', 'Actions']} />
                <div className="divide-y divide-tactical-border">
                    {paginated.map(t => (
                        <div key={t.id} className="grid px-6 py-4 items-center gap-4 hover:bg-brand-midnight/20 transition-all" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                            <div className="flex items-center gap-3 col-span-1">
                                <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0"><Building2 size={14} className="text-brand-cyan/60" /></div>
                                <div className="min-w-0"><p className="text-xs font-bold text-white truncate">{t.name}</p><p className="text-[9px] text-tactical-muted truncate">{t.contactEmail}</p></div>
                            </div>
                            <Badge label={t.subscriptionPlan} color={planColor[t.subscriptionPlan]} />
                            <span className="text-sm font-bold text-white">{t.officers}</span>
                            <span className="text-xs text-tactical-muted truncate">{t.location}</span>
                            <span className="text-xs font-bold text-white">{fmtCur(t.monthlyFee)}</span>
                            <Badge label={t.status} color={statusColor[t.status]} />
                            <div className="flex gap-2">
                                {t.status !== 'onboarding' && (
                                    <button onClick={() => toggleStatus(t.id)} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${t.status === 'active' ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}>
                                        {t.status === 'active' ? <><Ban size={10} /> Suspend</> : <><Unlock size={10} /> Activate</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {paginated.length === 0 && (
                        <div className="px-6 py-12 text-center text-tactical-muted text-sm">No tenants match your search or filter.</div>
                    )}
                </div>
                <TacticalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={filtered.length}
                    resultRange={filtered.length > 0 ? `${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, filtered.length)}` : '0 - 0'}
                />
            </Card>
        </div>
    );
}

// ─── Payments ────────────────────────────────────────────────────────────────
function PaymentsView() {
    const totalRevenue = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const overdueAmt = mockPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
    const pending = mockPayments.filter(p => p.status === 'pending').length;
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 5;

    const totalPages = Math.ceil(mockPayments.length / PAGE_SIZE);
    const paginated = mockPayments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div>
            <SectionHeader sub="Monitor subscriptions, invoices, and billing status" />
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Revenue Collected', value: fmtCur(totalRevenue), icon: TrendingUp, color: 'text-emerald-400' },
                    { label: 'Overdue Balance', value: fmtCur(overdueAmt), icon: AlertCircle, color: 'text-red-400' },
                    { label: 'Pending Invoices', value: String(pending), icon: Clock, color: 'text-amber-400' },
                ].map(c => {
                    const Icon = c.icon;
                    return (
                        <Card key={c.label} className="p-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0"><Icon size={16} className={c.color} /></div>
                            <div><p className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">{c.label}</p><p className="text-xl font-black text-white mt-1">{c.value}</p></div>
                        </Card>
                    );
                })}
            </div>
            <Card className="overflow-hidden">
                <TableHeader cols={['Tenant', 'Plan', 'Amount', 'Status', 'Due Date', 'Paid Date', 'Invoice #']} />
                <div className="divide-y divide-tactical-border">
                    {paginated.map(p => (
                        <div key={p.id} className="grid px-6 py-4 items-center" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                            <span className="text-xs font-bold text-white truncate">{p.tenantName}</span>
                            <Badge label={p.plan} color={planColor[p.plan]} />
                            <span className="text-xs font-bold text-white">{fmtCur(p.amount)}</span>
                            <Badge label={p.status} color={statusColor[p.status]} />
                            <span className="text-xs text-tactical-muted">{fmt(p.dueDate)}</span>
                            <span className="text-xs text-tactical-muted">{p.paidDate ? fmt(p.paidDate) : '—'}</span>
                            <span className="text-[10px] text-brand-cyan font-mono">{p.invoiceId}</span>
                        </div>
                    ))}
                </div>
                <TacticalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={mockPayments.length}
                    resultRange={`${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, mockPayments.length)}`}
                />
            </Card>
        </div>
    );
}

// ─── Maintenance ──────────────────────────────────────────────────────────────
function MaintenanceView() {
    const [logs, setLogs] = useState<MaintenanceLog[]>(mockMaintenanceLogs);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ service: '', type: 'corrective' as MaintenanceLog['type'], note: '', assignedTo: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 5;

    const totalPages = Math.ceil(logs.length / PAGE_SIZE);
    const paginated = logs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const markResolved = (id: string) => setLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'resolved', resolvedAt: new Date().toISOString() } : l));
    const handleSubmit = () => {
        if (!form.service || !form.note) return;
        const newLog: MaintenanceLog = { id: `MNT-${Date.now()}`, ...form, status: 'pending', reportedAt: new Date().toISOString() };
        setLogs(prev => [newLog, ...prev]);
        setForm({ service: '', type: 'corrective', note: '', assignedTo: '' });
        setShowForm(false);
    };

    const services = ['API Gateway', 'Auth Service', 'NFC Sync Engine', 'Alert Queue', 'Database', 'File Storage'];

    return (
        <div>
            <SectionHeader sub="Corrective & preventive maintenance logs for the platform" />
            {/* Platform Status Strip */}
            <Card className="p-5 mb-6">
                <p className="text-[10px] font-black text-tactical-muted uppercase tracking-widest mb-4">Live Service Status</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {services.slice(0, 4).map(svc => {
                        const issue = logs.find(l => l.service === svc && l.status !== 'resolved');
                        return (
                            <div key={svc} className={`flex items-center gap-3 p-3 rounded-xl border ${issue ? 'border-red-500/20 bg-red-500/5' : 'border-tactical-border bg-brand-midnight/30'}`}>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${issue ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
                                <div><p className="text-xs font-bold text-white">{svc}</p><p className={`text-[9px] font-bold uppercase ${issue ? 'text-red-400' : 'text-emerald-400'}`}>{issue ? issue.status : 'Operational'}</p></div>
                            </div>
                        );
                    })}
                </div>
            </Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-white uppercase tracking-tight">Maintenance Log</h2>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                    <Wrench size={12} /> Log New Issue
                </button>
            </div>
            {showForm && (
                <Card className="p-6 mb-5 border-brand-cyan/20">
                    <p className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-4">New Maintenance Entry</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Service</label>
                            <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50">
                                <option value="">Select service</option>
                                {services.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'corrective' | 'preventive' | 'emergency' }))} className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50">
                                <option value="corrective">Corrective</option>
                                <option value="preventive">Preventive</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Assigned To</label>
                            <input value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} placeholder="e.g. Dev Team – Backend" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-brand-cyan/50" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Notes</label>
                            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Describe the issue..." className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-brand-cyan/50" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSubmit} className="px-6 py-2 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Submit</button>
                        <button onClick={() => setShowForm(false)} className="px-6 py-2 border border-tactical-border text-tactical-muted text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-red-500/30 hover:text-red-400 transition-all">Cancel</button>
                    </div>
                </Card>
            )
            }
            <Card className="overflow-hidden">
                <TableHeader cols={['Service', 'Type', 'Status', 'Reported', 'Resolved', 'Assigned To', 'Action']} />
                <div className="divide-y divide-tactical-border">
                    {paginated.map(l => (
                        <div key={l.id} className="px-6 py-4">
                            <div className="grid items-center gap-4" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                                <span className="text-xs font-bold text-white">{l.service}</span>
                                <Badge label={l.type} color={statusColor[l.type]} />
                                <Badge label={l.status} color={l.status === 'resolved' ? statusColor.resolved : l.status === 'in-progress' ? statusColor['in-progress'] : statusColor.pending} />
                                <span className="text-xs text-tactical-muted">{fmt(l.reportedAt)}</span>
                                <span className="text-xs text-tactical-muted">{l.resolvedAt ? fmt(l.resolvedAt) : '—'}</span>
                                <span className="text-xs text-tactical-muted truncate">{l.assignedTo}</span>
                                {l.status !== 'resolved' && (
                                    <button onClick={() => markResolved(l.id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all w-fit">
                                        <Check size={10} /> Resolve
                                    </button>
                                )}
                            </div>
                            <p className="text-[10px] text-tactical-muted mt-2 ml-0 italic">{l.note}</p>
                        </div>
                    ))}
                </div>
                <TacticalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={logs.length}
                    resultRange={`${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, logs.length)}`}
                />
            </Card>
        </div>
    );
}

// ─── Onboarding ──────────────────────────────────────────────────────────────
function OnboardingView() {
    const [requests, setRequests] = useState<OnboardingRequest[]>(mockOnboarding);

    const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: decision } : r));
    };

    const pending = requests.filter(r => r.status === 'pending');
    const history = requests.filter(r => r.status !== 'pending');

    return (
        <div>
            <SectionHeader sub="Review and approve new tenant applications" />
            {pending.length === 0 ? (
                <Card className="p-12 text-center mb-8">
                    <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-white">All applications processed</p>
                    <p className="text-xs text-tactical-muted mt-1">No pending onboarding requests</p>
                </Card>
            ) : (
                <div className="space-y-4 mb-8">
                    {pending.map(r => (
                        <Card key={r.id} className="p-6 border-amber-500/10">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center"><UserPlus size={14} className="text-brand-cyan" /></div>
                                        <div>
                                            <p className="text-sm font-black text-white">{r.companyName}</p>
                                            <p className="text-[10px] text-tactical-muted">{r.contactName} · {r.contactEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Badge label={r.plan} color={planColor[r.plan]} />
                                        <span className="text-[10px] text-tactical-muted flex items-center gap-1"><Clock size={10} /> Submitted {fmt(r.submittedAt)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleDecision(r.id, 'rejected')} className="flex items-center gap-1.5 px-4 py-2 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-all">
                                        <X size={12} /> Reject
                                    </button>
                                    <button onClick={() => handleDecision(r.id, 'approved')} className="flex items-center gap-1.5 px-4 py-2 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                                        <Check size={12} /> Approve
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            {history.length > 0 && (
                <>
                    <h2 className="text-sm font-black text-tactical-muted uppercase tracking-tight mb-4">Processed Applications</h2>
                    <Card className="overflow-hidden">
                        <TableHeader cols={['Company', 'Contact', 'Plan', 'Submitted', 'Decision', 'Notes']} />
                        <div className="divide-y divide-tactical-border">
                            {history.map(r => (
                                <div key={r.id} className="grid px-6 py-4 items-center gap-4" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
                                    <span className="text-xs font-bold text-white">{r.companyName}</span>
                                    <span className="text-xs text-tactical-muted">{r.contactEmail}</span>
                                    <Badge label={r.plan} color={planColor[r.plan]} />
                                    <span className="text-xs text-tactical-muted">{fmt(r.submittedAt)}</span>
                                    <Badge label={r.status} color={statusColor[r.status]} />
                                    <span className="text-[10px] text-tactical-muted italic">{r.notes || '—'}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}

// ─── Tickets ─────────────────────────────────────────────────────────────────
function TicketsView() {
    const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
    const [filter, setFilter] = useState<string>('all');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 4;

    const submitResponse = (id: string) => {
        const reply = responses[id];
        if (!reply?.trim()) return;
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'in-progress', response: reply } : t));
        setResponses(r => ({ ...r, [id]: '' }));
        setExpanded(null);
    };

    const resolve = (id: string) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));

    const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    useEffect(() => setCurrentPage(1), [filter]);

    return (
        <div>
            <SectionHeader sub="Tenant complaints and support requests" />
            <div className="flex gap-2 mb-6">
                {['all', 'open', 'in-progress', 'resolved'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-brand-cyan text-brand-midnight border-brand-cyan' : 'bg-tactical-surface border-tactical-border text-tactical-muted hover:border-brand-cyan/30'}`}>{f.replace('-', ' ')}</button>
                ))}
                <span className="ml-auto self-center text-[10px] text-tactical-muted">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-3 mb-6">
                {paginated.map(t => (
                    <Card key={t.id} className={`overflow-hidden ${t.severity === 'critical' ? 'border-red-500/30' : ''}`}>
                        <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-brand-midnight/20 transition-all text-left" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <span className="text-[9px] font-black text-tactical-muted">{t.id}</span>
                                    <Badge label={t.severity} color={severityColor[t.severity]} />
                                    <Badge label={t.status} color={statusColor[t.status]} />
                                </div>
                                <p className="text-sm font-bold text-white">{t.subject}</p>
                                <p className="text-[10px] text-tactical-muted mt-0.5">{t.tenantName} · {fmt(t.createdAt)}</p>
                            </div>
                            {expanded === t.id ? <ChevronUp size={16} className="text-tactical-muted shrink-0" /> : <ChevronDown size={16} className="text-tactical-muted shrink-0" />}
                        </button>
                        {expanded === t.id && (
                            <div className="px-6 pb-5 border-t border-tactical-border pt-4">
                                <p className="text-sm text-white/80 leading-relaxed mb-4">{t.message}</p>
                                {t.response && (
                                    <div className="bg-brand-midnight/40 border border-brand-cyan/10 rounded-xl p-4 mb-4">
                                        <p className="text-[9px] font-black text-brand-cyan uppercase tracking-widest mb-1">Previous Response</p>
                                        <p className="text-xs text-white/80">{t.response}</p>
                                    </div>
                                )}
                                {t.status !== 'resolved' && (
                                    <div className="flex flex-col gap-3">
                                        <textarea value={responses[t.id] || ''} onChange={e => setResponses(r => ({ ...r, [t.id]: e.target.value }))} placeholder="Type your response..." rows={3} className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-brand-cyan/50 resize-none" />
                                        <div className="flex gap-3">
                                            <button onClick={() => submitResponse(t.id)} className="flex items-center gap-2 px-5 py-2 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                                                <MessageSquare size={12} /> Send Response
                                            </button>
                                            <button onClick={() => resolve(t.id)} className="flex items-center gap-2 px-5 py-2 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500/10 transition-all">
                                                <CheckCircle2 size={12} /> Mark Resolved
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                ))}
                {paginated.length === 0 && (
                    <Card className="p-12 text-center">
                        <MessageSquare size={28} className="text-tactical-muted mx-auto mb-3" />
                        <p className="text-sm font-bold text-white">No tickets in this category</p>
                    </Card>
                )}
            </div>
            <TacticalPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalResults={filtered.length}
                resultRange={filtered.length > 0 ? `${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, filtered.length)}` : '0 - 0'}
            />
        </div>
    );
}

// ─── Root Component ────────────────────────────────────────────────────────────
type View = 'overview' | 'tenants' | 'payments' | 'maintenance' | 'onboarding' | 'tickets' | 'profile';

const ProfileSettingsView = () => {
    return (
        <div>
            <SectionHeader sub="Manage your platform administrator profile" />
            <div className="max-w-4xl space-y-6">
                <div className="bg-tactical-surface border border-tactical-border rounded-2xl p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative w-24 h-24">
                            <div className="w-full h-full rounded-2xl border-2 border-brand-cyan overflow-hidden bg-brand-midnight flex items-center justify-center shadow-[0_0_30px_rgba(0,194,255,0.1)]">
                                <UserIcon size={40} className="text-brand-cyan/40" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-cyan rounded-lg flex items-center justify-center text-brand-midnight shadow-lg hover:scale-110 transition-all border-2 border-brand-midnight">
                                <Wrench size={14} />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Admin User</h2>
                            <p className="text-xs text-brand-cyan font-black uppercase tracking-widest mt-1">Platform Administrator</p>
                            <p className="text-[10px] text-tactical-muted mt-2">Platform Control Authority • ID: GP-ADM-001</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Full Name</label>
                                <input type="text" defaultValue="Admin User" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Email Address</label>
                                <input type="email" defaultValue="admin@gladiator-pro.com" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">System Callsign</label>
                                <input type="text" defaultValue="ADMIN_LEVEL_1" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Duty Status</label>
                                <div className="flex items-center gap-2 bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">Active System Control</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-tactical-border flex justify-end gap-3">
                        <button className="px-6 py-2 border border-tactical-border text-tactical-muted text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-brand-cyan/30 hover:text-white transition-all">Reset Password</button>
                        <button className="px-8 py-2 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Update System Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function GlobalAdminDashboard({ onLogout }: { onLogout: () => void }) {
    const [activeView, setActiveView] = useState<View>('overview');

    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'System Overview', description: 'Real-time snapshot of the Gladiator Pro SaaS platform', active: activeView === 'overview', onClick: () => setActiveView('overview') },
        { icon: <Building2 size={20} />, label: 'Tenant Management', description: 'Manage all tenants, plans, and account statuses', active: activeView === 'tenants', onClick: () => setActiveView('tenants') },
        { icon: <CreditCard size={20} />, label: 'Payment Gateway', description: 'Monitor subscriptions, invoices, and billing status', active: activeView === 'payments', onClick: () => setActiveView('payments') },
        { icon: <Wrench size={20} />, label: 'System Maintenance', description: 'Corrective & preventive maintenance logs for the platform', active: activeView === 'maintenance', onClick: () => setActiveView('maintenance') },
        { icon: <UserPlus size={20} />, label: 'Onboarding Queue', description: 'Review and approve new tenant applications', active: activeView === 'onboarding', onClick: () => setActiveView('onboarding'), badge: mockOnboarding.filter(o => o.status === 'pending').length || undefined },
        { icon: <MessageSquare size={20} />, label: 'Support Tickets', description: 'Tenant complaints and support requests', active: activeView === 'tickets', onClick: () => setActiveView('tickets'), badge: mockTickets.filter(t => t.status === 'open').length || undefined },
    ];

    return (
        <DashboardLayout
            title="Global Admin"
            role="Platform Administrator"
            sidebarItems={sidebarItems}
            currentUser={{ name: 'Admin User' }}
            onLogout={onLogout}
            onProfileClick={() => setActiveView('profile')}
        >
            {activeView === 'overview' && <OverviewView onNav={(v) => setActiveView(v as View)} />}
            {activeView === 'tenants' && <TenantsView />}
            {activeView === 'payments' && <PaymentsView />}
            {activeView === 'maintenance' && <MaintenanceView />}
            {activeView === 'onboarding' && <OnboardingView />}
            {activeView === 'tickets' && <TicketsView />}
            {activeView === 'profile' && <ProfileSettingsView />}
        </DashboardLayout>
    );
}
