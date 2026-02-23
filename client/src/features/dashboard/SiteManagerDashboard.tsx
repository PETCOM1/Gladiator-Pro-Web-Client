import { useState, useMemo } from 'react';
import {
    LayoutDashboard, Users, Shield, Clock,
    Map, AlertTriangle, CheckCircle2, XCircle, Radio,
    Plus, Search, Edit3, Trash2, MapPin, Signal, ChevronRight,
    Save, X, MoreVertical, Zap
} from 'lucide-react';
import { DashboardLayout } from './layout/DashboardLayout';
import {
    mockCheckpoints as initialCheckpoints,
    mockShifts as initialShifts,
    mockSiteIncidents as initialIncidents,
    mockOfficers,
    mockSites
} from '../../services/mockData';
import type { NFCCheckpoint, ShiftAssignment, SiteIncident, Officer } from '../../types/user';
import { cn } from '@/utils/cn';

// --- Types ---
type SiteView = 'operations' | 'shifts' | 'patrols' | 'guards' | 'incidents' | 'orders';

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

export function SiteManagerDashboard({ onLogout }: { onLogout: () => void }) {
    const [activeView, setActiveView] = useState<SiteView>('operations');

    // --- State ---
    const [checkpoints, setCheckpoints] = useState<NFCCheckpoint[]>(initialCheckpoints);
    const [shifts, setShifts] = useState<ShiftAssignment[]>(initialShifts);
    const [incidents, setIncidents] = useState<SiteIncident[]>(initialIncidents);
    const [siteOfficers] = useState<Officer[]>(mockOfficers.filter(o => o.siteId === 'site-1'));

    // --- Modals ---
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [editingShift, setEditingShift] = useState<ShiftAssignment | null>(null);
    const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);

    // --- Actions ---
    const saveShift = (data: Partial<ShiftAssignment>) => {
        if (editingShift) {
            setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...s, ...data } : s));
        } else {
            const officer = siteOfficers.find(o => o.id === data.officerId);
            const newShift: ShiftAssignment = {
                id: `sh-${Date.now()}`,
                siteId: 'site-1',
                officerId: data.officerId || '',
                officerName: officer?.name || 'Unknown',
                post: data.post || 'Unassigned',
                startTime: data.startTime || '06:00',
                endTime: data.endTime || '14:00',
                status: 'active',
                radioChannel: data.radioChannel || '01'
            };
            setShifts(prev => [...prev, newShift]);
        }
        setIsShiftModalOpen(false);
        setEditingShift(null);
    };

    const toggleCheckpointStatus = (id: string) => {
        setCheckpoints(prev => prev.map(cp =>
            cp.id === id ? { ...cp, status: cp.status === 'active' ? 'inactive' : 'active' } : cp
        ));
    };

    // --- Views ---

    const OperationsView = () => {
        const stats = [
            { label: 'On-Duty Guards', value: String(shifts.filter(s => s.status === 'active').length), icon: Users, color: 'text-brand-cyan' },
            { label: 'Patrol Points', value: String(checkpoints.length), icon: Map, color: 'text-purple-400' },
            { label: 'Point Compliance', value: '92%', icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Active Incidents', value: String(incidents.filter(i => i.status !== 'resolved').length), icon: AlertTriangle, color: 'text-red-400' },
        ];

        return (
            <div>
                <SectionHeader title="Site Command: North Sector Complex" sub="Real-time tactical monitoring" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 group hover:border-brand-cyan/30 transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">{s.label}</span>
                                    <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border group-hover:border-brand-cyan/20 flex items-center justify-center transition-all">
                                        <Icon size={14} className={s.color} />
                                    </div>
                                </div>
                                <span className="text-3xl font-black text-white">{s.value}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Live Patrol Feed */}
                    <div className="xl:col-span-2 bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-tactical-border">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-brand-cyan" />
                                <h2 className="text-sm font-black text-white uppercase tracking-tight">Live NFC Patrol Log</h2>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full">
                                <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-brand-cyan uppercase tracking-widest">Live Updates</span>
                            </div>
                        </div>
                        <div className="divide-y divide-tactical-border">
                            {checkpoints.map((p) => (
                                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-midnight/30 transition-all group">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all",
                                        p.status === 'active' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
                                    )}>
                                        {p.status === 'active' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-white uppercase tracking-wide truncate">{p.name}</p>
                                        <p className="text-[10px] text-tactical-muted uppercase tracking-widest">{p.lastScannedBy || 'Unscanned'}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border",
                                            p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        )}>{p.status}</span>
                                        <p className="text-[9px] text-tactical-muted mt-1">{p.lastScanned}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* On-Duty Snapshot */}
                        <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-tactical-border">
                                <h2 className="text-sm font-black text-white uppercase tracking-tight">On Post Now</h2>
                            </div>
                            <div className="divide-y divide-tactical-border">
                                {shifts.filter(s => s.status === 'active').map(s => (
                                    <div key={s.id} className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center text-[10px] font-black text-brand-cyan">
                                            {s.officerName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white">{s.officerName}</p>
                                            <p className="text-[10px] text-tactical-muted uppercase tracking-widest">{s.post}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-cyan/5 border border-brand-cyan/20 rounded">
                                            <Radio size={10} className="text-brand-cyan" />
                                            <span className="text-[9px] font-black text-brand-cyan">{s.radioChannel}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-brand-midnight border border-red-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle size={16} className="text-red-400" />
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Critical Alerts</span>
                            </div>
                            {incidents.filter(i => i.severity === 'high' || i.severity === 'critical').map(i => (
                                <div key={i.id} className="mb-4 last:mb-0">
                                    <p className="text-xs font-bold text-white mb-1">{i.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-tactical-muted uppercase">{i.reference}</span>
                                        <span className="text-[9px] font-black text-red-400 uppercase tracking-tight">{i.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ShiftScheduleView = () => {
        return (
            <div>
                <SectionHeader title="Shift Management" sub="Deploy personnel and manage tactical rotations" />
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex gap-2">
                        {['Day Shift', 'Night Shift', 'Standby'].map(t => (
                            <button key={t} className="px-4 py-2 rounded-xl bg-tactical-surface border border-tactical-border text-[10px] font-black uppercase tracking-widest text-tactical-muted hover:border-brand-cyan/40 hover:text-white transition-all">{t}</button>
                        ))}
                    </div>
                    <button
                        onClick={() => { setEditingShift(null); setIsShiftModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                    >
                        <Plus size={14} /> Assign New Shift
                    </button>
                </div>

                <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-5 px-6 py-4 border-b border-tactical-border/50 bg-brand-midnight/30">
                        {['Personnel', 'Tactical Post', 'Channel', 'Duration', 'Action'].map(h => (
                            <span key={h} className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">{h}</span>
                        ))}
                    </div>
                    <div className="divide-y divide-tactical-border">
                        {shifts.map(s => (
                            <div key={s.id} className="grid grid-cols-5 px-6 py-5 items-center hover:bg-brand-midnight/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0">
                                        <Users size={14} className="text-brand-cyan/60" />
                                    </div>
                                    <span className="text-sm font-bold text-white">{s.officerName}</span>
                                </div>
                                <span className="text-xs text-tactical-muted uppercase tracking-widest font-black">{s.post}</span>
                                <div className="flex items-center gap-1.5 text-brand-cyan">
                                    <Radio size={12} />
                                    <span className="text-[10px] font-black">{s.radioChannel}</span>
                                </div>
                                <span className="text-xs text-white font-medium">{s.startTime} - {s.endTime}</span>
                                <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingShift(s); setIsShiftModalOpen(true); }}
                                        className="p-2 rounded-lg bg-brand-midnight border border-tactical-border hover:border-brand-cyan/40 text-brand-cyan transition-all"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => setShifts(prev => prev.filter(sh => sh.id !== s.id))}
                                        className="p-2 rounded-lg bg-brand-midnight border border-tactical-border hover:border-red-500/40 text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Modal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} title={editingShift ? "Update Tactical Assignment" : "Initialize New Shift"}>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); saveShift({ officerId: String(formData.get('officerId')), post: String(formData.get('post')), radioChannel: String(formData.get('channel')), startTime: String(formData.get('start')), endTime: String(formData.get('end')) }); }}>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Deploy Officer</label>
                            <select name="officerId" defaultValue={editingShift?.officerId} className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50 h-[46px]">
                                {siteOfficers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Tactical Post</label>
                                <input name="post" defaultValue={editingShift?.post} placeholder="Gate A" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Comm Channel</label>
                                <input name="channel" defaultValue={editingShift?.radioChannel} placeholder="01" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Shift Start</label>
                                <input name="start" defaultValue={editingShift?.startTime || '06:00'} type="time" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50 h-[46px]" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Shift End</label>
                                <input name="end" defaultValue={editingShift?.endTime || '14:00'} type="time" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50 h-[46px]" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] transition-all">
                            {editingShift ? "Confirm Updates" : "Engage Assignment"}
                        </button>
                    </form>
                </Modal>
            </div>
        );
    };

    const NFCPatrolsView = () => {
        return (
            <div>
                <SectionHeader title="NFC Infrastructure" sub="Manage physical scan points and patrol coverage" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {checkpoints.map(cp => (
                        <div key={cp.id} className="bg-tactical-surface border border-tactical-border rounded-2xl p-6 hover:border-brand-cyan/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-midnight border border-tactical-border flex items-center justify-center group-hover:border-brand-cyan/20">
                                    <Zap size={20} className={cn(cp.status === 'active' ? "text-brand-cyan" : "text-red-400")} />
                                </div>
                                <button
                                    onClick={() => toggleCheckpointStatus(cp.id)}
                                    className={cn(
                                        "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border transition-all",
                                        cp.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                    )}
                                >
                                    {cp.status}
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">{cp.name}</h3>
                            <div className="flex items-center gap-2 text-tactical-muted text-xs mb-4">
                                <MapPin size={12} />
                                <span>{cp.location}</span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-tactical-border/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Last Scan</span>
                                    <span className="text-xs font-bold text-white">{cp.lastScanned || 'Never'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Operator</span>
                                    <span className="text-xs text-brand-cyan/80">{cp.lastScannedBy || 'N/A'}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2.5 rounded-xl border border-tactical-border text-[9px] font-black uppercase tracking-widest text-tactical-muted hover:border-brand-cyan/40 hover:text-brand-cyan transition-all">
                                View Full History
                            </button>
                        </div>
                    ))}
                    <button className="bg-brand-midnight/30 border-2 border-dashed border-tactical-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-tactical-muted hover:border-brand-cyan/30 hover:text-brand-cyan transition-all">
                        <Plus size={32} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Provision New NFC Node</span>
                    </button>
                </div>
            </div>
        );
    };

    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Site Operations', active: activeView === 'operations', onClick: () => setActiveView('operations') },
        { icon: <Clock size={20} />, label: 'Shift Schedule', active: activeView === 'shifts', onClick: () => setActiveView('shifts'), badge: shifts.length },
        { icon: <Map size={20} />, label: 'NFC Patrols', active: activeView === 'patrols', onClick: () => setActiveView('patrols') },
        { icon: <Users size={20} />, label: 'Active Guards', active: activeView === 'guards', onClick: () => setActiveView('guards') },
        { icon: <Shield size={20} />, label: 'Post Orders', active: activeView === 'orders', onClick: () => setActiveView('orders') },
        { icon: <AlertTriangle size={20} />, label: 'Incidents', active: activeView === 'incidents', onClick: () => setActiveView('incidents'), badge: incidents.filter(i => i.status === 'open').length },
    ];

    return (
        <DashboardLayout
            title="Site Command"
            role="Site Manager"
            sidebarItems={sidebarItems}
            currentUser={{ name: 'Sarah Supervisor' }}
            onLogout={onLogout}
        >
            {activeView === 'operations' && <OperationsView />}
            {activeView === 'shifts' && <ShiftScheduleView />}
            {activeView === 'patrols' && <NFCPatrolsView />}
            {activeView === 'guards' && (
                <div className="flex flex-col items-center justify-center p-20 text-center">
                    <Users size={48} className="text-tactical-muted mb-4 opacity-30" />
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Active Guard Roster</h2>
                    <p className="text-sm text-tactical-muted max-w-sm mt-2">Real-time GPS tracking and biometric health monitoring interface is currently in provisioning.</p>
                </div>
            )}
            {activeView === 'orders' && (
                <div className="p-12 text-center bg-tactical-surface border border-tactical-border rounded-3xl">
                    <Shield size={42} className="text-brand-cyan mx-auto mb-4 opacity-50" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest mb-2">Tactical Post Orders</h2>
                    <p className="text-xs text-tactical-muted">Digital directive distribution for this sector is synchronized with the latest security protocols.</p>
                </div>
            )}
            {activeView === 'incidents' && (
                <div>
                    <SectionHeader title="Incident Command" sub="Log and track site-specific security breaches" />
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden shadow-xl">
                        <div className="divide-y divide-tactical-border">
                            {incidents.map(inc => (
                                <div key={inc.id} className="p-6 hover:bg-brand-midnight/20 transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                                                inc.severity === 'critical' || inc.severity === 'high' ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"
                                            )}>
                                                <AlertTriangle size={20} className={inc.severity === 'critical' || inc.severity === 'high' ? "text-red-400" : "text-amber-400"} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-white uppercase tracking-tight">{inc.reference}</h3>
                                                <p className="text-[10px] text-tactical-muted uppercase tracking-widest">Reported by {inc.reportedBy}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            inc.status === 'open' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        )}>{inc.status}</span>
                                    </div>
                                    <p className="text-sm font-bold text-white mb-4 line-clamp-2">{inc.description}</p>
                                    <div className="flex items-center justify-between border-t border-tactical-border/50 pt-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-tactical-muted uppercase tracking-tight">Severity: <span className={inc.severity === 'critical' ? 'text-red-500' : 'text-amber-400'}>{inc.severity}</span></span>
                                            <span className="text-[10px] font-black text-tactical-muted uppercase tracking-tight">{inc.timestamp}</span>
                                        </div>
                                        <button className="text-[9px] font-black text-brand-cyan uppercase tracking-widest hover:underline">Manage Resolution →</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
