import { useState, type FormEvent } from 'react';
import { Shield, Eye, EyeOff, ArrowRight, ChevronRight } from 'lucide-react';
import logo from '../../assets/Gladiator_Logo.png';
import { useTenant } from '../../contexts/TenantContext';
import type { UserRole } from '../../types/user';

const demoAccounts = [
    {
        role: 'super-admin' as UserRole,
        label: 'Global Command',
        email: 'admin@gladiator.pro',
        password: 'Gladiator@2025',
        description: 'Super Admin Oversight',
        color: 'brand-cyan',
    },
    {
        role: 'global-admin' as UserRole,
        label: 'Global Admin',
        email: 'julius@gladiator.pro',
        password: 'Gladiator@2025',
        description: 'Operational Management',
        color: 'brand-steel',
    },
    {
        role: 'tenant-admin' as UserRole,
        label: 'Tenant Admin',
        email: 'ceo@securecorp.com',
        password: 'SecureCorp@2025',
        description: 'SecureCorp Solutions',
        color: 'brand-steel',
    },
    {
        role: 'site-manager' as UserRole,
        label: 'Site Manager',
        email: 'sarah@northsector.com',
        password: 'NorthSector@2025',
        description: 'North Sector Complex',
        color: 'brand-steel',
    },
];

export function LoginPage() {
    const { login, loginByRole } = useTenant();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // Simulate network latency
        const result = login(email, password);
        if (!result.success) setError(result.error ?? 'Login failed.');
        setLoading(false);
    };

    const fillDemo = (acc: typeof demoAccounts[0]) => {
        setEmail(acc.email);
        setPassword(acc.password);
        setError('');
    };

    return (
        <div className="min-h-screen bg-tactical-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(#00C2FF 1px, transparent 1px), linear-gradient(to right, #00C2FF 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-cyan/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                <div className="hidden md:flex flex-col gap-8">
                    {/* Brand Identity Block */}
                    <div className="flex flex-col items-start gap-5">
                        <div className="w-28 h-28 rounded-full bg-brand-midnight/60 border border-brand-cyan/20 shadow-[0_0_40px_rgba(0,194,255,0.12)] overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/8 via-transparent to-transparent pointer-events-none rounded-full" />
                            <img
                                src={logo}
                                alt="Gladiator Logo"
                                className="w-full h-full object-cover rounded-full relative z-10 transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">GLADIATOR</h1>
                            <p className="text-[10px] text-brand-cyan font-black uppercase tracking-[0.35em] mt-1.5">Pro · Tactical Command</p>
                        </div>
                    </div>

                    <p className="text-tactical-muted text-sm leading-relaxed max-w-xs">
                        Enterprise security operations platform for multi-site guard management, NFC patrol tracking, and real-time incident response.
                    </p>

                    {/* Demo credential cards */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-tactical-muted uppercase tracking-widest mb-4">Demo Accounts — Click to Fill →</p>
                        {demoAccounts.map((acc) => (
                            <button
                                key={acc.role}
                                onClick={() => fillDemo(acc)}
                                className="w-full flex items-center gap-4 p-4 bg-tactical-surface border border-tactical-border rounded-2xl hover:border-brand-cyan/40 hover:bg-brand-midnight/60 transition-all group text-left"
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-midnight border border-tactical-border group-hover:border-brand-cyan/30 flex items-center justify-center shrink-0 transition-all">
                                    <Shield size={16} className="text-brand-cyan/60 group-hover:text-brand-cyan transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-white uppercase tracking-wide">{acc.label}</p>
                                    <p className="text-[10px] text-tactical-muted truncate">{acc.email}</p>
                                    <p className="text-[9px] text-brand-cyan/60 uppercase tracking-widest mt-0.5">{acc.description}</p>
                                </div>
                                <ChevronRight size={14} className="text-tactical-muted group-hover:text-brand-cyan transition-colors shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right login form */}
                <div className="bg-tactical-surface border border-tactical-border rounded-3xl p-8 shadow-2xl shadow-black/40">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Access System</h2>
                        <p className="text-tactical-muted text-sm mt-1">Enter your credentials to authenticate</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@command.pro"
                                required
                                className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-tactical-muted uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full bg-brand-midnight border border-tactical-border rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-tactical-muted hover:text-brand-cyan transition-colors"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-bold">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-cyan text-brand-midnight font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_24px_rgba(0,194,255,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-brand-midnight/30 border-t-brand-midnight rounded-full animate-spin" />
                            ) : (
                                <>Authenticate <ArrowRight size={14} /></>
                            )}
                        </button>
                    </form>

                    {/* Quick access (mobile) */}
                    <div className="md:hidden mt-6 pt-6 border-t border-tactical-border">
                        <p className="text-[10px] font-black text-tactical-muted uppercase tracking-widest mb-3">Quick Demo Access</p>
                        <div className="grid grid-cols-3 gap-2">
                            {demoAccounts.map((acc) => (
                                <button
                                    key={acc.role}
                                    onClick={() => loginByRole(acc.role)}
                                    className="py-2.5 px-3 bg-brand-midnight border border-tactical-border rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:border-brand-cyan/40 hover:text-brand-cyan transition-all"
                                >
                                    {acc.label.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
