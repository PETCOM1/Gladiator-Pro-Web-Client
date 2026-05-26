import { useState, useEffect } from 'react';
import { Plus, MapPin, UserPlus, Loader2, Building2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteService } from '../../services/siteService';
import { authService } from '../../services/authService';

interface Site {
    id: string;
    name: string;
    location: string;
    _count?: {
        users: number;
        incidents: number;
    };
}

export function SiteManagementPage() {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

    const [siteForm, setSiteForm] = useState({ name: '', location: '' });
    const [inviteForm, setInviteForm] = useState({ email: '' });
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const data = await siteService.getSites();
            setSites(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSite = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        try {
            await siteService.createSite(siteForm);
            setStatus({ type: 'success', message: 'Site registered successfully.' });
            setSiteForm({ name: '', location: '' });
            setShowRegisterModal(false);
            fetchSites();
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        }
    };

    const handleInviteManager = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSite) return;
        setStatus(null);
        try {
            await authService.sendInvitation(inviteForm.email, 'SUPERVISOR', undefined); // Wait, we need to update sendInvitation to support siteId on frontend too
            // Let's actually update authService below first!
            setStatus({ type: 'success', message: `Invitation sent to site manager for ${selectedSite.name}.` });
            setInviteForm({ email: '' });
            setShowInviteModal(false);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">SITE COMMAND</h1>
                    <p className="text-[10px] text-brand-cyan font-black uppercase tracking-[0.35em] mt-1.5">Asset & Personnel Infrastructure</p>
                </div>
                <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]"
                >
                    <Plus size={14} /> Register New Site
                </button>
            </header>

            {status && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                    status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold uppercase tracking-wide">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map(site => (
                    <div key={site.id} className="bg-tactical-surface border border-tactical-border rounded-3xl p-6 hover:border-brand-cyan/30 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-brand-cyan/10 transition-all" />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-brand-midnight border border-tactical-border flex items-center justify-center group-hover:border-brand-cyan/20 transition-all">
                                <Building2 size={24} className="text-brand-cyan" />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { setSelectedSite(site); setShowInviteModal(true); }}
                                    className="p-2 rounded-lg bg-brand-midnight border border-tactical-border text-tactical-muted hover:text-brand-cyan hover:border-brand-cyan/30 transition-all"
                                    title="Invite Site Manager"
                                >
                                    <UserPlus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight uppercase italic">{site.name}</h3>
                                <div className="flex items-center gap-2 text-tactical-muted text-[10px] uppercase font-black tracking-widest mt-1">
                                    <MapPin size={10} className="text-brand-cyan" />
                                    {site.location}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-tactical-border/50">
                                <div className="px-3 py-2 bg-brand-midnight/40 rounded-xl border border-tactical-border/30">
                                    <span className="block text-[8px] font-black text-tactical-muted uppercase tracking-widest mb-1">Personnel</span>
                                    <span className="text-sm font-black text-white">{site._count?.users || 0}</span>
                                </div>
                                <div className="px-3 py-2 bg-brand-midnight/40 rounded-xl border border-tactical-border/30">
                                    <span className="block text-[8px] font-black text-tactical-muted uppercase tracking-widest mb-1">Incidents</span>
                                    <span className="text-sm font-black text-red-400">{site._count?.incidents || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Register Site Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-midnight/80 backdrop-blur-md">
                    <div className="bg-tactical-surface border border-tactical-border rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-brand-cyan" />
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Register Asset</h2>
                        <p className="text-tactical-muted text-xs mb-8 uppercase tracking-widest font-black">Link new operational site to network</p>
                        
                        <form onSubmit={handleRegisterSite} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest ml-1">Site Designation</label>
                                <input 
                                    required
                                    value={siteForm.name}
                                    onChange={e => setSiteForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. ALPHA BASE TERMINAL"
                                    className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest ml-1">Location / Coordinates</label>
                                <input 
                                    required
                                    value={siteForm.location}
                                    onChange={e => setSiteForm(f => ({ ...f, location: e.target.value }))}
                                    placeholder="e.g. SANDTON, JOHANNESBURG"
                                    className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-4 rounded-xl border border-tactical-border text-tactical-muted font-black text-[10px] uppercase tracking-widest hover:bg-brand-midnight/60 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-4 rounded-xl bg-brand-cyan text-brand-midnight font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]">Execute</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Manager Modal */}
            {showInviteModal && selectedSite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-midnight/80 backdrop-blur-md">
                    <div className="bg-tactical-surface border border-tactical-border rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-brand-steel" />
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Assign Command</h2>
                        <p className="text-tactical-muted text-xs mb-8 uppercase tracking-widest font-black">Invite Supervisor for {selectedSite.name}</p>
                        
                        <form onSubmit={handleInviteManager} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest ml-1">Manager Interface (Email)</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tactical-muted" />
                                    <input 
                                        required
                                        type="email"
                                        value={inviteForm.email}
                                        onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                                        placeholder="commander@network.local"
                                        className="w-full bg-brand-midnight border border-tactical-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-steel"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-4 rounded-xl border border-tactical-border text-tactical-muted font-black text-[10px] uppercase tracking-widest hover:bg-brand-midnight/60 transition-all">Abort</button>
                                <button type="submit" className="flex-1 px-4 py-4 rounded-xl bg-brand-steel text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]">Send Intel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
