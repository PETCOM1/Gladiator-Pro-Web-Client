import { useState } from 'react';
import {
    LayoutDashboard, Users, Shield, Clock,
    Map, AlertTriangle, CheckCircle2, XCircle, Radio,
    Plus, Edit3, Trash2, MapPin, X, Zap, User as UserIcon
} from 'lucide-react';
import { DashboardLayout } from './layout/DashboardLayout';
import {
    mockCheckpoints as initialCheckpoints,
    mockShifts as initialShifts,
    mockSiteIncidents as initialIncidents,
    mockOfficers
} from '../../services/mockData';
import type { NFCCheckpoint, ShiftAssignment, SiteIncident, Officer } from '../../types/user';
import { TacticalPagination } from '../../components/ui/Pagination';
import { cn } from '@/utils/cn';

// --- Types ---
type SiteView = 'operations' | 'shifts' | 'patrols' | 'guards' | 'incidents' | 'orders' | 'profile';

// --- Shared Components ---

function SectionHeader({ sub }: { title?: string; sub?: string }) {
    return sub ? (
        <div className="mb-6">
            <p className="text-xs text-tactical-muted mt-1">{sub}</p>
        </div>
    ) : null;
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="bg-tactical-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
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
    const [incidents] = useState<SiteIncident[]>(initialIncidents);
    const [siteOfficers] = useState<Officer[]>(mockOfficers.filter(o => o.siteId === 'site-1'));

    // --- Modals ---
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [editingShift, setEditingShift] = useState<ShiftAssignment | null>(null);
    const [isCPModalOpen, setIsCPModalOpen] = useState(false);
    const [editingCP, setEditingCP] = useState<NFCCheckpoint | null>(null);
    const [isTagRegistryOpen, setIsTagRegistryOpen] = useState(false);
    const [selectedCPForTags, setSelectedCPForTags] = useState<NFCCheckpoint | null>(null);
    const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
    const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

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


    const deleteCheckpoint = (id: string) => {
        if (confirm('Are you sure you want to decommission this NFC node?')) {
            setCheckpoints(prev => prev.filter(cp => cp.id !== id));
        }
    };

    const saveCheckpoint = (data: Partial<NFCCheckpoint>) => {
        if (editingCP) {
            setCheckpoints(prev => prev.map(cp => cp.id === editingCP.id ? { ...cp, ...data } : cp));
        } else {
            const newCP: NFCCheckpoint = {
                id: `cp-${Date.now()}`,
                siteId: 'site-1',
                name: data.name || 'New Node',
                location: data.location || 'Unassigned',
                status: 'active',
                lastScanned: 'Never',
                lastScannedBy: 'N/A',
                tagIds: []
            };
            setCheckpoints(prev => [newCP, ...prev]);
        }
        setIsCPModalOpen(false);
        setEditingCP(null);
    };

    const updateTagIds = (cpId: string, tagIds: string[]) => {
        setCheckpoints(prev => prev.map(cp => cp.id === cpId ? { ...cp, tagIds } : cp));
        if (selectedCPForTags?.id === cpId) {
            setSelectedCPForTags(prev => prev ? { ...prev, tagIds } : null);
        }
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
                <SectionHeader sub="Real-time tactical monitoring" />

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
                                <h2 className="text-sm font-black text-white uppercase tracking-tight">Live NFC Operations Log</h2>
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
        const [currentPage, setCurrentPage] = useState(1);
        const PAGE_SIZE = 5;

        const totalPages = Math.ceil(shifts.length / PAGE_SIZE);
        const paginated = shifts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
        return (
            <div>
                <SectionHeader sub="Deploy personnel and manage tactical rotations" />
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
                        {paginated.map(s => (
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
                <TacticalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={shifts.length}
                    resultRange={`${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, shifts.length)}`}
                />

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
        const [currentPage, setCurrentPage] = useState(1);
        const [searchQuery, setSearchQuery] = useState('');
        const [statusFilter, setStatusFilter] = useState<string>('all');
        const PAGE_SIZE = 5;

        const filtered = checkpoints.filter(cp => {
            const matchesSearch = cp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cp.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || cp.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
        const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

        return (
            <div>
                <SectionHeader sub="Manage physical scan points and patrol coverage" />

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search nodes or locations..."
                            className="w-full bg-tactical-surface border border-tactical-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'active', 'inactive', 'requires-maintenance'].map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                    statusFilter === f ? "bg-brand-cyan text-brand-midnight border-brand-cyan" : "bg-tactical-surface border-tactical-border text-tactical-muted hover:border-brand-cyan/30"
                                )}
                            >
                                {f.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { setEditingCP(null); setIsCPModalOpen(true); }}
                        className="px-6 py-2.5 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,194,255,0.15)] flex items-center gap-2"
                    >
                        <Plus size={14} /> Provision Node
                    </button>
                </div>

                <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-7 px-6 py-4 border-b border-tactical-border/50 bg-brand-midnight/30">
                        {['NFC Node', 'Location', 'Last Scan', 'Operator', 'Status', 'Tags', 'Actions'].map(h => (
                            <span key={h} className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">{h}</span>
                        ))}
                    </div>
                    <div className="divide-y divide-tactical-border">
                        {paginated.map(cp => (
                            <div key={cp.id} className="grid grid-cols-7 px-6 py-5 items-center hover:bg-brand-midnight/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0">
                                        <Zap size={14} className={cp.status === 'active' ? "text-brand-cyan" : "text-red-400"} />
                                    </div>
                                    <span className="text-xs font-bold text-white truncate">{cp.name}</span>
                                </div>
                                <span className="text-xs text-tactical-muted truncate">{cp.location}</span>
                                <span className="text-xs text-white">{cp.lastScanned || 'Never'}</span>
                                <span className="text-xs text-brand-cyan/80">{cp.lastScannedBy || 'N/A'}</span>
                                <div className="flex items-center justify-start">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border",
                                        cp.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                    )}>{cp.status}</span>
                                </div>
                                <div>
                                    <button
                                        onClick={() => { setSelectedCPForTags(cp); setIsTagRegistryOpen(true); }}
                                        className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 rounded border transition-all",
                                            (cp.tagIds?.length || 0) >= 10 && (cp.tagIds?.length || 0) <= 15
                                                ? "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/20"
                                                : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                                        )}
                                    >
                                        <Radio size={10} />
                                        <span className="text-[10px] font-black">{cp.tagIds?.length || 0} IDs</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingCP(cp); setIsCPModalOpen(true); }}
                                        className="p-2 rounded-lg bg-brand-midnight border border-tactical-border hover:border-brand-cyan/40 text-brand-cyan transition-all"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteCheckpoint(cp.id)}
                                        className="p-2 rounded-lg bg-brand-midnight border border-tactical-border hover:border-red-500/40 text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {paginated.length === 0 && (
                            <div className="px-6 py-12 text-center text-tactical-muted text-sm italic">No NFC nodes found in this sector.</div>
                        )}
                    </div>
                </div>

                <TacticalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={filtered.length}
                    resultRange={filtered.length > 0 ? `${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, filtered.length)}` : '0 - 0'}
                />

                <Modal isOpen={isCPModalOpen} onClose={() => setIsCPModalOpen(false)} title={editingCP ? "Modify NFC Node" : "Provision New NFC Node"}>
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        saveCheckpoint({
                            name: String(formData.get('name')),
                            location: String(formData.get('location'))
                        });
                    }}>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Node Designation</label>
                            <input name="name" defaultValue={editingCP?.name} placeholder="Gate B - Entry" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" required />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Physical Location</label>
                            <input name="location" defaultValue={editingCP?.location} placeholder="Level 1, East Wing" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" required />
                        </div>
                        <button type="submit" className="w-full bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] transition-all">
                            {editingCP ? "Commit Node Updates" : "Initialize NFC Provisioning"}
                        </button>
                    </form>
                </Modal>

                <Modal isOpen={isTagRegistryOpen} onClose={() => setIsTagRegistryOpen(false)} title={`Tag Registry: ${selectedCPForTags?.name}`}>
                    <div className="space-y-6">
                        <div className="p-4 bg-brand-midnight border border-tactical-border rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">Compliance Status</span>
                                <span className={cn(
                                    "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
                                    (selectedCPForTags?.tagIds?.length || 0) >= 10 && (selectedCPForTags?.tagIds?.length || 0) <= 15
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                    {(selectedCPForTags?.tagIds?.length || 0) >= 10 && (selectedCPForTags?.tagIds?.length || 0) <= 15 ? 'Compliant' : 'Non-Compliant'}
                                </span>
                            </div>
                            <p className="text-[10px] text-tactical-muted italic">Each NFC node must contain between 10 and 15 unique hardware tag IDs.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest block">Register Hardware ID</label>
                            <form className="flex gap-2" onSubmit={(e) => {
                                e.preventDefault();
                                const input = e.currentTarget.elements.namedItem('tagId') as HTMLInputElement;
                                if (input.value && selectedCPForTags) {
                                    if ((selectedCPForTags.tagIds?.length || 0) >= 15) {
                                        alert('Maximum capacity of 15 Tag IDs reached for this node.');
                                        return;
                                    }
                                    const newTags = [...(selectedCPForTags.tagIds || []), input.value];
                                    updateTagIds(selectedCPForTags.id, newTags);
                                    input.value = '';
                                }
                            }}>
                                <input name="tagId" placeholder="Scan or type Hardware ID..." className="flex-1 bg-brand-midnight border border-tactical-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50 h-[42px]" />
                                <button type="submit" className="px-4 bg-brand-cyan text-brand-midnight rounded-xl hover:scale-105 transition-all"><Plus size={18} /></button>
                            </form>
                        </div>

                        <div className="bg-brand-midnight border border-tactical-border rounded-xl max-h-[240px] overflow-y-auto scrollbar-hide">
                            <div className="divide-y divide-tactical-border/50">
                                {selectedCPForTags?.tagIds?.map((tid, idx) => (
                                    <div key={idx} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-brand-cyan/40">#{idx + 1}</span>
                                            <span className="text-xs font-bold text-white tracking-wider font-mono">{tid}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (selectedCPForTags) {
                                                    const newTags = selectedCPForTags.tagIds?.filter(t => t !== tid) || [];
                                                    updateTagIds(selectedCPForTags.id, newTags);
                                                }
                                            }}
                                            className="text-tactical-muted hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {(!selectedCPForTags?.tagIds || selectedCPForTags.tagIds.length === 0) && (
                                    <div className="p-8 text-center text-tactical-muted text-xs italic">No hardware IDs registered to this node.</div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-tactical-border/50">
                            <span className="text-[10px] font-black text-tactical-muted uppercase">Registry Load</span>
                            <span className="text-[10px] font-black text-white">{selectedCPForTags?.tagIds?.length || 0} / 15</span>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    };

    const PersonnelRegistryView = () => {
        const [currentPage, setCurrentPage] = useState(1);
        const [searchQuery, setSearchQuery] = useState('');
        const [roleFilter, setRoleFilter] = useState<string>('all');
        const PAGE_SIZE = 5;

        const filtered = siteOfficers.filter(o => {
            const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'all' || o.role.toLowerCase().includes(roleFilter.toLowerCase());
            return matchesSearch && matchesRole;
        });

        const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
        const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

        return (
            <div>
                <SectionHeader sub="Real-time GPS tracking and biometric health monitoring registry" />

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by name or callsign..."
                            className="w-full bg-tactical-surface border border-tactical-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'Supervisor', 'Lead', 'Officer'].map(f => (
                            <button
                                key={f}
                                onClick={() => setRoleFilter(f)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                    roleFilter === f ? "bg-brand-cyan text-brand-midnight border-brand-cyan" : "bg-tactical-surface border-tactical-border text-tactical-muted hover:border-brand-cyan/30"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-5 px-6 py-4 border-b border-tactical-border/50 bg-brand-midnight/30">
                        {['Personnel', 'Tactical Role', 'Status', 'Current Post', 'Actions'].map(h => (
                            <span key={h} className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">{h}</span>
                        ))}
                    </div>
                    <div className="divide-y divide-tactical-border">
                        {paginated.map(officer => (
                            <div key={officer.id} className="grid grid-cols-5 px-6 py-5 items-center hover:bg-brand-midnight/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-midnight border border-tactical-border flex items-center justify-center shrink-0">
                                        <UserIcon size={14} className="text-brand-cyan/60" />
                                    </div>
                                    <span className="text-sm font-bold text-white">{officer.name}</span>
                                </div>
                                <span className="text-xs text-tactical-muted uppercase tracking-widest font-black">{officer.role}</span>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full animate-pulse",
                                        officer.status === 'on-duty' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "bg-tactical-muted"
                                    )} />
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        officer.status === 'on-duty' ? "text-emerald-400" : "text-tactical-muted"
                                    )}>{officer.status}</span>
                                </div>
                                <span className="text-xs text-white uppercase tracking-tighter">
                                    {shifts.find(s => s.officerId === officer.id)?.post || 'Standby'}
                                </span>
                                <div>
                                    <button
                                        onClick={() => { setSelectedOfficer(officer); setIsPersonnelModalOpen(true); }}
                                        className="text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:underline"
                                    >
                                        View Profile →
                                    </button>
                                </div>
                            </div>
                        ))}
                        {paginated.length === 0 && (
                            <div className="px-6 py-12 text-center text-tactical-muted text-sm italic">No personnel found matching these criteria.</div>
                        )}
                    </div>
                </div>

                <TacticalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={filtered.length}
                    resultRange={filtered.length > 0 ? `${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, filtered.length)}` : '0 - 0'}
                />

                <Modal isOpen={isPersonnelModalOpen} onClose={() => setIsPersonnelModalOpen(false)} title="Tactical Personnel Profile">
                    {selectedOfficer && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-brand-midnight border border-tactical-border rounded-xl">
                                <div className="w-16 h-16 rounded-xl border border-brand-cyan/30 flex items-center justify-center bg-brand-midnight text-brand-cyan">
                                    <UserIcon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{selectedOfficer.name}</h3>
                                    <p className="text-[10px] text-brand-cyan font-black uppercase tracking-widest">{selectedOfficer.role}</p>
                                    <p className="text-[9px] text-tactical-muted mt-1">ID: {selectedOfficer.id.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-brand-midnight/50 border border-tactical-border/50 rounded-xl p-3">
                                    <span className="text-[9px] font-black text-tactical-muted uppercase block mb-1">Duty Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", selectedOfficer.status === 'on-duty' ? "bg-emerald-400" : "bg-tactical-muted")} />
                                        <span className="text-xs font-bold text-white capitalize">{selectedOfficer.status.replace('-', ' ')}</span>
                                    </div>
                                </div>
                                <div className="bg-brand-midnight/50 border border-tactical-border/50 rounded-xl p-3">
                                    <span className="text-[9px] font-black text-tactical-muted uppercase block mb-1">Shift Duration</span>
                                    <span className="text-xs font-bold text-white">{selectedOfficer.shiftStart || '--:--'} - {selectedOfficer.shiftEnd || '--:--'}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">Biometric Status</h4>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Pulse Rate', value: '72 BPM', status: 'optimal' },
                                        { label: 'Body Temp', value: '36.6°C', status: 'optimal' },
                                        { label: 'GPS Sync', value: 'Active', status: 'optimal' }
                                    ].map(b => (
                                        <div key={b.label} className="flex items-center justify-between px-3 py-2 bg-brand-midnight/30 border border-tactical-border/30 rounded-lg">
                                            <span className="text-[10px] text-tactical-muted">{b.label}</span>
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">{b.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-tactical-border/50 flex gap-3">
                                <button className="flex-1 bg-brand-cyan/10 border border-brand-cyan/20 py-2.5 rounded-xl text-[10px] font-black text-brand-cyan uppercase tracking-widest hover:bg-brand-cyan/20 transition-all">Direct Comms</button>
                                <button className="flex-1 bg-brand-midnight border border-tactical-border py-2.5 rounded-xl text-[10px] font-black text-tactical-muted uppercase tracking-widest hover:text-white transition-all">Full Dossier</button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        );
    };

    const ProfileSettingsView = () => {
        return (
            <div>
                <SectionHeader sub="Manage your personal profile and account security" />
                <div className="max-w-4xl space-y-6">
                    <div className="bg-tactical-surface border border-tactical-border rounded-2xl p-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative w-24 h-24">
                                <div className="w-full h-full rounded-2xl border-2 border-brand-cyan overflow-hidden bg-brand-midnight flex items-center justify-center shadow-[0_0_30px_rgba(0,194,255,0.1)]">
                                    <UserIcon size={40} className="text-brand-cyan/40" />
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-cyan rounded-lg flex items-center justify-center text-brand-midnight shadow-lg hover:scale-110 transition-all border-2 border-brand-midnight">
                                    <Edit3 size={14} />
                                </button>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Marcus Aurelius</h2>
                                <p className="text-xs text-brand-cyan font-black uppercase tracking-widest mt-1">Site Manager</p>
                                <p className="text-[10px] text-tactical-muted mt-2">Member since Oct 2023 • ID: GP-SM-001</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Full Name</label>
                                    <input type="text" defaultValue="Marcus Aurelius" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Email Address</label>
                                    <input type="email" defaultValue="m.aurelius@gladiator-pro.com" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Tactical Callsign</label>
                                    <input type="text" defaultValue="CENTURION" className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan/50" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-tactical-muted uppercase tracking-widest mb-1 block">Duty Status</label>
                                    <div className="flex items-center gap-2 bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Active Duty / Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-tactical-border flex justify-end gap-3">
                            <button className="px-6 py-2 border border-tactical-border text-tactical-muted text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-brand-cyan/30 hover:text-white transition-all">Reset Password</button>
                            <button className="px-8 py-2 bg-brand-cyan text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Update Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const sidebarItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Site Operations', description: 'Real-time tactical monitoring', active: activeView === 'operations', onClick: () => setActiveView('operations') },
        { icon: <Clock size={20} />, label: 'Shift Schedule', description: 'Deploy personnel and manage tactical rotations', active: activeView === 'shifts', onClick: () => setActiveView('shifts'), badge: shifts.length },
        { icon: <Map size={20} />, label: 'NFC Control', description: 'Manage physical scan points and patrol coverage', active: activeView === 'patrols', onClick: () => setActiveView('patrols') },
        { icon: <Users size={20} />, label: 'Active Guards', description: 'Real-time GPS tracking and biometric health monitoring', active: activeView === 'guards', onClick: () => setActiveView('guards') },
        { icon: <Shield size={20} />, label: 'Post Orders', description: 'Digital directive distribution for this sector', active: activeView === 'orders', onClick: () => setActiveView('orders') },
        { icon: <AlertTriangle size={20} />, label: 'Incidents', description: 'Log and track site-specific security breaches', active: activeView === 'incidents', onClick: () => setActiveView('incidents'), badge: incidents.filter(i => i.status === 'open').length },
    ];

    return (
        <DashboardLayout
            title="Site Command"
            role="Site Manager"
            sidebarItems={sidebarItems}
            currentUser={{ name: 'Sarah Supervisor' }}
            onLogout={onLogout}
            onProfileClick={() => setActiveView('profile')}
        >
            {activeView === 'operations' && <OperationsView />}
            {activeView === 'shifts' && <ShiftScheduleView />}
            {activeView === 'patrols' && <NFCPatrolsView />}
            {activeView === 'guards' && <PersonnelRegistryView />}
            {activeView === 'orders' && (
                <div className="p-12 text-center bg-tactical-surface border border-tactical-border rounded-3xl">
                    <Shield size={42} className="text-brand-cyan mx-auto mb-4 opacity-50" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest mb-2">Tactical Post Orders</h2>
                    <p className="text-xs text-tactical-muted">Digital directive distribution for this sector is synchronized with the latest security protocols.</p>
                </div>
            )}
            {activeView === 'incidents' && (
                <IncidentsView incidents={incidents} />
            )}
            {activeView === 'profile' && <ProfileSettingsView />}
        </DashboardLayout>
    );
}
// --- Sub-Views ---

function IncidentsView({ incidents }: { incidents: SiteIncident[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 4;

    const totalPages = Math.ceil(incidents.length / PAGE_SIZE);
    const paginated = incidents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div>
            <SectionHeader sub="Log and track site-specific security breaches" />
            <div className="bg-tactical-surface border border-tactical-border rounded-2xl overflow-hidden shadow-xl">
                <div className="divide-y divide-tactical-border">
                    {paginated.map(inc => (
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
                    {paginated.length === 0 && (
                        <div className="px-6 py-12 text-center text-tactical-muted text-sm">No incidents on record.</div>
                    )}
                </div>
                <TacticalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={incidents.length}
                    resultRange={incidents.length > 0 ? `${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, incidents.length)}` : '0 - 0'}
                />
            </div>
        </div>
    );
}
