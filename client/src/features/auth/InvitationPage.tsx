import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export function InvitationPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [inviteData, setInviteData] = useState<{ email: string; role: string; tenantName: string } | null>(null);

    const [form, setForm] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!token) {
            setError('Missing invitation token.');
            setLoading(false);
            return;
        }

        const validate = async () => {
            try {
                const data = await authService.validateInvitation(token);
                setInviteData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        validate();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            await authService.acceptInvitation({
                token: token!,
                name: form.name,
                password: form.password
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-tactical-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
                    <p className="text-tactical-muted text-xs font-black uppercase tracking-widest">Validating Invitation...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-tactical-bg flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-tactical-surface border border-brand-cyan/20 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Access Granted</h2>
                    <p className="text-tactical-muted text-sm mb-6">Your profile has been initialized. Redirecting to command center...</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-brand-cyan text-brand-midnight font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] transition-all"
                    >
                        Proceed to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tactical-bg flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(#00C2FF 1px, transparent 1px), linear-gradient(to right, #00C2FF 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            <div className="relative z-10 w-full max-w-lg bg-tactical-surface border border-tactical-border rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-tactical-border bg-brand-midnight/40">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-brand-midnight border border-brand-cyan/20 flex items-center justify-center">
                            <Shield size={24} className="text-brand-cyan" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Accept Invitation</h2>
                            <p className="text-[10px] text-brand-cyan font-black uppercase tracking-widest mt-1">Gladiator Pro Command Network</p>
                        </div>
                    </div>

                    {inviteData && (
                        <div className="bg-brand-midnight/60 border border-tactical-border/50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Hub / Tenant</span>
                                <span className="text-xs font-bold text-white">{inviteData.tenantName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Assigned Role</span>
                                <span className="text-xs font-bold text-brand-cyan uppercase tracking-tighter italic">{inviteData.role}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-tactical-muted uppercase tracking-widest">Registered Interface</span>
                                <span className="text-xs font-bold text-white">{inviteData.email}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400">
                            <AlertCircle size={18} className="shrink-0" />
                            <p className="text-xs font-bold leading-relaxed">{error}</p>
                        </div>
                    )}

                    {!inviteData && error ? (
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-brand-midnight border border-tactical-border text-tactical-muted font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:text-white transition-all"
                        >
                            Return to Login
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tactical-muted" />
                                    <input
                                        required
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="e.g. Marcus Aurelius"
                                        className="w-full bg-brand-midnight border border-tactical-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest ml-1">Secure Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tactical-muted" />
                                    <input
                                        required
                                        type="password"
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        placeholder="••••••••••••"
                                        className="w-full bg-brand-midnight border border-tactical-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest ml-1">Confirm Identity Key</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tactical-muted" />
                                    <input
                                        required
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                        placeholder="••••••••••••"
                                        className="w-full bg-brand-midnight border border-tactical-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-brand-cyan text-brand-midnight font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] shadow-[0_0_24px_rgba(0,194,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 mt-4 transition-all"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Initialize Profile <ArrowRight size={14} /></>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
