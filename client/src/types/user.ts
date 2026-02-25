export type UserRole = 'super-admin' | 'global-admin' | 'tenant-admin' | 'site-manager';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    tenantId?: string;
    siteId?: string;
}

export interface Tenant {
    id: string;
    name: string;
    status: 'active' | 'suspended' | 'onboarding';
    subscriptionPlan: 'basic' | 'pro' | 'enterprise';
    officers: number;
    contactEmail: string;
    location: string;
    createdAt: string;
    nextBillingDate: string;
    monthlyFee: number;
}

export interface Site {
    id: string;
    tenantId: string;
    name: string;
    location: string;
    managerId: string;
    managerName?: string;
    totalOfficers?: number;
}

export interface Officer {
    id: string;
    tenantId: string;
    siteId: string;
    name: string;
    role: string;
    status: 'on-duty' | 'off-duty' | 'on-leave';
    shiftStart?: string;
    shiftEnd?: string;
}

export interface NFCCheckpoint {
    id: string;
    siteId: string;
    name: string;
    location: string;
    lastScanned?: string;
    lastScannedBy?: string;
    status: 'active' | 'inactive' | 'requires-maintenance';
    tagIds?: string[]; // Array of unique NFC Tag IDs within this node
}

export interface ShiftAssignment {
    id: string;
    siteId: string;
    officerId: string;
    officerName: string;
    post: string;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'active' | 'completed';
    radioChannel?: string;
}

export interface SiteIncident {
    id: string;
    siteId: string;
    reference: string;
    description: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    reportedBy: string;
}

export interface OBEntry {
    id: string;
    siteId: string;
    postId: string; // e.g., 'main-gate', 'library'
    obNo: string;
    time: string;
    date: string;
    officerName: string;
    natureOfOccurrence: string;
    pageNo?: string;
}

export interface SystemHealth {
    status: 'operational' | 'degraded' | 'maintenance';
    uptime: string;
    activeTenants: number;
}

export interface PaymentRecord {
    id: string;
    tenantId: string;
    tenantName: string;
    plan: 'basic' | 'pro' | 'enterprise';
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'failed';
    dueDate: string;
    paidDate?: string;
    invoiceId: string;
}

export interface SupportTicket {
    id: string;
    tenantId: string;
    tenantName: string;
    subject: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    createdAt: string;
    response?: string;
}

export interface MaintenanceLog {
    id: string;
    service: string;
    type: 'corrective' | 'preventive' | 'emergency';
    status: 'pending' | 'in-progress' | 'resolved';
    reportedAt: string;
    resolvedAt?: string;
    note: string;
    assignedTo: string;
}

export interface OnboardingRequest {
    id: string;
    companyName: string;
    contactName: string;
    contactEmail: string;
    plan: 'basic' | 'pro' | 'enterprise';
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
}
