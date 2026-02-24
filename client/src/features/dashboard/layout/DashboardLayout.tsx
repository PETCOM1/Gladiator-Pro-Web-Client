import { type ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    User,
    ChevronLeft,
    ChevronRight,
    Menu,
    Settings,
    Bell,
    HelpCircle,
    Search
} from 'lucide-react';
import logo from '@/assets/Gladiator_Logo.png';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/900.css';

interface SidebarItem {
    icon: ReactNode;
    label: string;
    description?: string;
    active?: boolean;
    onClick?: () => void;
    badge?: number;
}

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
    role: string;
    sidebarItems: SidebarItem[];
    currentUser?: {
        name: string;
        avatar?: string;
    };
    onLogout: () => void;
    onSettings?: () => void;
    onProfileClick?: () => void;
}

export function DashboardLayout({
    children,
    title,
    role,
    sidebarItems,
    currentUser,
    onLogout,
    onSettings,
    onProfileClick
}: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const activeItem = sidebarItems.find(item => item.active);
    const sectionTitle = activeItem ? activeItem.label : title;
    const sectionSubtitle = activeItem?.description;

    return (
        <div className="flex h-screen overflow-hidden bg-tactical-bg font-outfitSelection text-tactical-text">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={toggleMobileMenu}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 96 : 288 }}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 md:relative flex flex-col bg-brand-midnight text-white transition-all duration-300 ease-in-out border-r border-tactical-border",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className={cn(
                    "flex flex-col h-full",
                    isCollapsed ? "items-center py-8" : "p-8"
                )}>
                    {/* Logo */}
                    <div className={cn(
                        "flex items-center mb-10 transition-all duration-300",
                        isCollapsed ? "justify-center" : "justify-start"
                    )}>
                        {isCollapsed ? (
                            <div className="w-10 h-10 rounded-full bg-brand-midnight border border-brand-cyan/30 flex items-center justify-center shadow-[0_0_16px_rgba(0,194,255,0.15)] overflow-hidden">
                                <img src={logo} alt="Gladiator" className="w-full h-full object-cover rounded-full" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-12 h-12 rounded-full bg-brand-midnight border border-brand-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,194,255,0.15)] overflow-hidden shrink-0">
                                    <img src={logo} alt="Gladiator" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">GLADIATOR</h2>
                                    <p className="text-[9px] font-bold text-brand-cyan/70 uppercase tracking-[0.2em] mt-0.5">Pro Command</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile info */}
                    <button
                        onClick={onProfileClick}
                        className={cn(
                            "mb-10 text-center flex flex-col items-center w-full transition-all duration-300 hover:opacity-80 group/profile",
                            isCollapsed ? "mb-6" : "mb-10"
                        )}
                    >
                        <div className={cn(
                            "relative group mb-4",
                            isCollapsed ? "w-10 h-10" : "w-14 h-14"
                        )}>
                            <div className={cn(
                                "rounded-2xl border-2 border-brand-steel overflow-hidden shadow-2xl transition-all duration-300 group-hover/profile:scale-105 group-hover/profile:border-brand-cyan bg-brand-steel flex items-center justify-center w-full h-full",
                            )}>
                                {currentUser?.avatar ? (
                                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className={cn("text-brand-cyan/40", isCollapsed ? "w-5 h-5" : "w-8 h-8")} />
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-cyan border-2 border-brand-midnight rounded-full shadow-lg shadow-brand-cyan/20" />
                        </div>
                        {!isCollapsed && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                <h3 className="font-bold text-lg text-white mb-0.5">{currentUser?.name || "Marcus Aurelius"}</h3>
                                <p className="text-[10px] text-brand-cyan font-black uppercase tracking-[0.2em]">{role}</p>
                            </div>
                        )}
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar w-full">
                        {sidebarItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick?.();
                                    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                                }}
                                className={cn(
                                    "flex items-center transition-all duration-300 rounded-xl group w-full relative h-12",
                                    isCollapsed ? "justify-center px-0" : "px-4 gap-4",
                                    item.active
                                        ? "bg-brand-steel text-brand-cyan shadow-[0_0_20px_rgba(0,194,255,0.1)] border border-brand-cyan/20"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <div className={cn(
                                    "transition-transform duration-300",
                                    item.active ? "scale-110" : "group-hover:scale-110 group-hover:rotate-3"
                                )}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && (
                                    <span className="text-sm font-bold truncate">{item.label}</span>
                                )}

                                {/* Badge */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <div className={cn(
                                        "absolute flex items-center justify-center bg-brand-cyan text-brand-midnight text-[9px] font-black rounded-full min-w-[18px] h-[18px] px-1 shadow-[0_0_10px_rgba(0,194,255,0.4)]",
                                        isCollapsed ? "top-2 right-2" : "right-4"
                                    )}>
                                        {item.badge}
                                    </div>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto pt-6 border-t border-tactical-border w-full flex flex-col gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-xl text-white/40 hover:text-brand-cyan transition-all h-12",
                                isCollapsed ? "w-12 mx-auto" : "w-full justify-start px-4 gap-4"
                            )}
                            onClick={onSettings}
                        >
                            <Settings className="w-5 h-5" />
                            {!isCollapsed && <span className="text-sm font-bold">Settings</span>}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all h-12",
                                isCollapsed ? "w-12 mx-auto" : "w-full justify-start px-4 gap-4"
                            )}
                            onClick={onLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
                        </Button>
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-cyan rounded-full items-center justify-center text-brand-midnight shadow-xl hover:scale-110 transition-all z-50 border-4 border-brand-midnight"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-tactical-bg md:rounded-l-[2.5rem] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-all duration-500 relative border-l border-tactical-border">
                {/* Header */}
                <header className={cn(
                    "px-8 md:px-16 py-8 transition-all duration-300 bg-tactical-bg/80 backdrop-blur-md sticky top-0 z-30 border-b border-tactical-border/50",
                    scrolled ? "py-6 shadow-sm shadow-black/20" : ""
                )}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button
                                className="md:hidden p-2 text-tactical-text hover:bg-tactical-surface rounded-lg transition-colors"
                                onClick={toggleMobileMenu}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
                                    {sectionTitle}
                                </h1>
                                {sectionSubtitle && (
                                    <p className="text-tactical-muted mt-1 text-sm font-medium tracking-wide uppercase italic">{sectionSubtitle}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center bg-tactical-surface border border-tactical-border rounded-xl px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-brand-cyan/20 transition-all">
                                <Search size={18} className="text-tactical-muted" />
                                <input
                                    type="text"
                                    placeholder="SEARCH SYSTEM..."
                                    className="bg-transparent border-none focus:outline-none text-xs font-bold ml-3 w-full text-white placeholder:text-tactical-muted uppercase tracking-wider"
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="relative w-11 h-11 rounded-xl bg-tactical-surface border border-tactical-border shadow-sm hover:shadow-md hover:border-brand-cyan/40 transition-all group">
                                <Bell size={20} className="text-tactical-muted group-hover:text-brand-cyan transition-colors" />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-brand-cyan rounded-full border-2 border-tactical-surface" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl bg-tactical-surface border border-tactical-border shadow-sm hover:shadow-md hover:border-brand-cyan/40 transition-all group">
                                <HelpCircle size={20} className="text-tactical-muted group-hover:text-brand-cyan transition-colors" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto px-8 md:px-16 pb-12 scrollbar-hide">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
