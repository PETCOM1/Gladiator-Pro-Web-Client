import type { User, Tenant, Site, PaymentRecord, SupportTicket, MaintenanceLog, OnboardingRequest, Officer, NFCCheckpoint, ShiftAssignment, SiteIncident, OBEntry } from '../types/user';

// ─── Mock Credentials ──────────────────────────────────────────────────────
//  GLOBAL COMMAND (Super Admin): admin@gladiator.pro / Gladiator@2025
//  TENANT ADMIN (Company Owner): ceo@securecorp.com / SecureCorp@2025
//  SITE MANAGER (Supervisor):    sarah@northsector.com / NorthSector@2025
// ───────────────────────────────────────────────────────────────────────────

export const mockCredentials: Record<string, { password: string; userId: string }> = {
    'admin@gladiator.pro': { password: 'Gladiator@2025', userId: '1' },
    'ceo@securecorp.com': { password: 'SecureCorp@2025', userId: '2' },
    'sarah@northsector.com': { password: 'NorthSector@2025', userId: '3' },
    'julius@gladiator.pro': { password: 'Gladiator@2025', userId: '4' },
};

export const mockUsers: Record<string, User> = {
    '1': { id: '1', name: 'Marcus Global', email: 'admin@gladiator.pro', role: 'super-admin' },
    '2': { id: '2', name: 'John Tenant', email: 'ceo@securecorp.com', role: 'tenant-admin', tenantId: 'tenant-1' },
    '3': { id: '3', name: 'Sarah Supervisor', email: 'sarah@northsector.com', role: 'site-manager', tenantId: 'tenant-1', siteId: 'site-1' },
    '4': { id: '4', name: 'Julius Ceasar', email: 'julius@gladiator.pro', role: 'global-admin' },
};

export const mockTenants: Tenant[] = [
    { id: 'tenant-1', name: 'SecureCorp Solutions', status: 'active', subscriptionPlan: 'enterprise', officers: 320, contactEmail: 'ceo@securecorp.com', location: 'Johannesburg, GP', createdAt: '2025-01-01', nextBillingDate: '2026-03-01', monthlyFee: 12999 },
    { id: 'tenant-2', name: 'Ironclad Security Ltd', status: 'active', subscriptionPlan: 'pro', officers: 148, contactEmail: 'ops@ironclad.co.za', location: 'Cape Town, WC', createdAt: '2025-02-15', nextBillingDate: '2026-03-15', monthlyFee: 5999 },
    { id: 'tenant-3', name: 'Vanguard Patrol Inc.', status: 'onboarding', subscriptionPlan: 'pro', officers: 96, contactEmail: 'admin@vanguard.co.za', location: 'Durban, KZN', createdAt: '2026-01-20', nextBillingDate: '2026-03-20', monthlyFee: 5999 },
    { id: 'tenant-4', name: 'Atlas Guard Services', status: 'active', subscriptionPlan: 'basic', officers: 44, contactEmail: 'info@atlasguard.co.za', location: 'Pretoria, GP', createdAt: '2025-06-10', nextBillingDate: '2026-03-10', monthlyFee: 1999 },
    { id: 'tenant-5', name: 'Fortress Security Group', status: 'suspended', subscriptionPlan: 'pro', officers: 75, contactEmail: 'finance@fortress.co.za', location: 'Port Elizabeth, EC', createdAt: '2025-03-01', nextBillingDate: '2026-02-01', monthlyFee: 5999 },
];

export const mockSites: Site[] = [
    { id: 'site-1', tenantId: 'tenant-1', name: 'North Sector Complex', location: '123 Defense Ave, High-Rise City', managerId: '3', managerName: 'Sarah Supervisor', totalOfficers: 28 },
    { id: 'site-2', tenantId: 'tenant-2', name: 'Harbor Freight Terminal', location: '7 Port Road, Cape Town', managerId: '3', managerName: 'James Officer', totalOfficers: 42 },
    { id: 'site-3', tenantId: 'tenant-1', name: 'Westside Data Center', location: '45 Tech Way, Johannesburg', managerId: '3', managerName: 'Thomas Miller', totalOfficers: 35 },
];

export const mockOfficers: Officer[] = [
    { id: 'off-1', tenantId: 'tenant-1', siteId: 'site-1', name: 'K. Mthembu', role: 'Gate A Supervisor', status: 'on-duty', shiftStart: '06:00', shiftEnd: '14:00' },
    { id: 'off-2', tenantId: 'tenant-1', siteId: 'site-1', name: 'B. Nkosi', role: 'Patrol Lead – North', status: 'off-duty', shiftStart: '14:00', shiftEnd: '22:00' },
    { id: 'off-3', tenantId: 'tenant-1', siteId: 'site-3', name: 'F. Dlamini', role: 'Control Room', status: 'off-duty', shiftStart: '22:00', shiftEnd: '06:00' },
    { id: 'off-4', tenantId: 'tenant-1', siteId: 'site-1', name: 'L. Zulu', role: 'Mobile Patrol', status: 'on-duty', shiftStart: '06:00', shiftEnd: '14:00' },
    { id: 'off-5', tenantId: 'tenant-1', siteId: 'site-3', name: 'S. Pillay', role: 'Response Unit', status: 'on-leave' },
    { id: 'off-6', tenantId: 'tenant-1', siteId: 'site-1', name: 'T. Ndlovu', role: 'Patrol Officer', status: 'on-duty', shiftStart: '06:00', shiftEnd: '14:00' },
];

export const mockCheckpoints: NFCCheckpoint[] = [
    { id: 'cp-1', siteId: 'site-1', name: 'Gate A – Main Entry', location: 'Ground Floor East', lastScanned: '2m ago', lastScannedBy: 'K. Mthembu', status: 'active', tagIds: Array.from({ length: 12 }, (_, i) => `NFC-G1-E${i + 1}`) },
    { id: 'cp-2', siteId: 'site-1', name: 'Perimeter – North Fence', location: 'North Boundary Wall', lastScanned: '8m ago', lastScannedBy: 'L. Zulu', status: 'active', tagIds: Array.from({ length: 15 }, (_, i) => `NFC-P1-N${i + 1}`) },
    { id: 'cp-3', siteId: 'site-1', name: 'Loading Bay B', location: 'South West Corner', lastScanned: '15m ago', lastScannedBy: 'T. Ndlovu', status: 'requires-maintenance', tagIds: Array.from({ length: 10 }, (_, i) => `NFC-L1-B${i + 1}`) },
    { id: 'cp-4', siteId: 'site-1', name: 'Server Room – Level 3', location: 'Internal High Security', lastScanned: '31m ago', lastScannedBy: 'K. Mthembu', status: 'active', tagIds: Array.from({ length: 11 }, (_, i) => `NFC-S1-R${i + 1}`) },
];

export const mockShifts: ShiftAssignment[] = [
    { id: 'sh-1', siteId: 'site-1', officerId: 'off-1', officerName: 'K. Mthembu', post: 'Gate A', startTime: '06:00', endTime: '14:00', status: 'active', radioChannel: '01' },
    { id: 'sh-2', siteId: 'site-1', officerId: 'off-4', officerName: 'L. Zulu', post: 'North Patrol', startTime: '06:00', endTime: '14:00', status: 'active', radioChannel: '02' },
    { id: 'sh-3', siteId: 'site-1', officerId: 'off-6', officerName: 'T. Ndlovu', post: 'Loading Bay', startTime: '06:00', endTime: '14:00', status: 'active', radioChannel: '03' },
];

export const mockSiteIncidents: SiteIncident[] = [
    { id: 'inc-s1', siteId: 'site-1', reference: 'INC-1094', description: 'Unauthorized vehicle — Gate B', timestamp: '09:12', severity: 'medium', status: 'open', reportedBy: 'K. Mthembu' },
    { id: 'inc-s2', siteId: 'site-1', reference: 'INC-1091', description: 'Fire alarm test — Level 2', timestamp: '07:45', severity: 'low', status: 'resolved', reportedBy: 'Sarah Supervisor' },
];

export const mockOBEntries: OBEntry[] = [
    // Main Gate - Day Shift
    { id: 'ob-mg-d1', siteId: 'site-1', postId: 'main-gate', obNo: 'MG-001/12/25', time: '06:00', date: '2025-12-29', officerName: 'Munzhadzi', natureOfOccurrence: 'Slo Munzhadzi Report on duty day shift at Main Gate after patrol find all in order', pageNo: '01' },
    { id: 'ob-mg-d2', siteId: 'site-1', postId: 'main-gate', obNo: 'MG-002/12/25', time: '07:00', date: '2025-12-29', officerName: 'Munzhadzi', natureOfOccurrence: 'Main Gate check complete - All visitors cleared' },
    { id: 'ob-mg-d3', siteId: 'site-1', postId: 'main-gate', obNo: 'MG-003/12/25', time: '08:00', date: '2025-12-29', officerName: 'Munzhadzi', natureOfOccurrence: 'Slo Report everything is looking good at Main Gate' },

    // Library - Day Shift
    { id: 'ob-lib-d1', siteId: 'site-1', postId: 'library', obNo: 'LIB-001/12/25', time: '06:30', date: '2025-12-29', officerName: 'K. Mthembu', natureOfOccurrence: 'S/O Mthembu checked Library perimeter - all secure' },
    { id: 'ob-lib-d2', siteId: 'site-1', postId: 'library', obNo: 'LIB-002/12/25', time: '08:00', date: '2025-12-29', officerName: 'K. Mthembu', natureOfOccurrence: 'Library opening procedures completed' },

    // Labs - Day Shift
    { id: 'ob-labs-d1', siteId: 'site-1', postId: 'labs', obNo: 'LAB-001/12/25', time: '06:45', date: '2025-12-29', officerName: 'L. Zulu', natureOfOccurrence: 'Patrol Lead Zulu reporting at Labs - biometric access functional' },
    { id: 'ob-labs-d2', siteId: 'site-1', postId: 'labs', obNo: 'LAB-002/12/25', time: '10:00', date: '2025-12-29', officerName: 'L. Zulu', natureOfOccurrence: 'Lab ventilation system check complete' },

    // Main Gate - Night Shift
    { id: 'ob-mg-n1', siteId: 'site-1', postId: 'main-gate', obNo: 'MG-004/12/25', time: '18:00', date: '2025-12-29', officerName: 'J. Phiri', natureOfOccurrence: 'S/O Phiri Report on duty night shift at Main Gate - handover complete', pageNo: '02' },
    { id: 'ob-mg-n2', siteId: 'site-1', postId: 'main-gate', obNo: 'MG-005/12/25', time: '20:00', date: '2025-12-29', officerName: 'J. Phiri', natureOfOccurrence: 'Perimeter lights activated - no blind spots detected' },
    { id: 'ob-mg-n3', siteId: 'site-1', postId: 'main-gate', obNo: 'MG-006/12/25', time: '00:00', date: '2025-12-30', officerName: 'J. Phiri', natureOfOccurrence: 'Midnight patrol complete - Main Gate silent' },

    // Labs - Night Shift
    { id: 'ob-labs-n1', siteId: 'site-1', postId: 'labs', obNo: 'LAB-003/12/25', time: '18:15', date: '2025-12-29', officerName: 'S. Nkosi', natureOfOccurrence: 'Night shift Labs occupation - high security mode engaged' },
    { id: 'ob-labs-n2', siteId: 'site-1', postId: 'labs', obNo: 'LAB-004/12/25', time: '03:00', date: '2025-12-30', officerName: 'S. Nkosi', natureOfOccurrence: 'Chemical storage vault check - all seals intact' },
];

export const mockPayments: PaymentRecord[] = [
    { id: 'pay-001', tenantId: 'tenant-1', tenantName: 'SecureCorp Solutions', plan: 'enterprise', amount: 12999, status: 'paid', dueDate: '2026-02-01', paidDate: '2026-01-28', invoiceId: 'INV-2026-001' },
    { id: 'pay-002', tenantId: 'tenant-2', tenantName: 'Ironclad Security Ltd', plan: 'pro', amount: 5999, status: 'paid', dueDate: '2026-02-15', paidDate: '2026-02-14', invoiceId: 'INV-2026-002' },
    { id: 'pay-003', tenantId: 'tenant-3', tenantName: 'Vanguard Patrol Inc.', plan: 'pro', amount: 5999, status: 'pending', dueDate: '2026-03-20', invoiceId: 'INV-2026-003' },
    { id: 'pay-004', tenantId: 'tenant-4', tenantName: 'Atlas Guard Services', plan: 'basic', amount: 1999, status: 'paid', dueDate: '2026-02-10', paidDate: '2026-02-09', invoiceId: 'INV-2026-004' },
    { id: 'pay-005', tenantId: 'tenant-5', tenantName: 'Fortress Security Group', plan: 'pro', amount: 5999, status: 'overdue', dueDate: '2026-02-01', invoiceId: 'INV-2026-005' },
    { id: 'pay-006', tenantId: 'tenant-1', tenantName: 'SecureCorp Solutions', plan: 'enterprise', amount: 12999, status: 'pending', dueDate: '2026-03-01', invoiceId: 'INV-2026-006' },
];

export const mockTickets: SupportTicket[] = [
    { id: 'TKT-001', tenantId: 'tenant-1', tenantName: 'SecureCorp Solutions', subject: 'NFC checkpoint not syncing', message: 'Our NFC patrol checkpoints at sites 3 and 5 stopped syncing to the dashboard 2 days ago. Officers complete patrols but logs show gaps.', severity: 'high', status: 'in-progress', createdAt: '2026-02-21T09:30:00Z', response: 'Our engineering team is investigating the NFC sync issue. A fix will be deployed within 24 hours.' },
    { id: 'TKT-002', tenantId: 'tenant-2', tenantName: 'Ironclad Security Ltd', subject: 'Invoice discrepancy – Feb 2026', message: 'The February invoice shows R6,499 but our agreed rate is R5,999. Please rectify and issue a corrected invoice.', severity: 'medium', status: 'open', createdAt: '2026-02-22T11:00:00Z' },
    { id: 'TKT-003', tenantId: 'tenant-4', tenantName: 'Atlas Guard Services', subject: 'Unable to add new site manager', message: 'When trying to add a new site manager user, we get an error: "Maximum managers reached". We are on the Basic plan and expected 3 managers.', severity: 'medium', status: 'open', createdAt: '2026-02-22T14:20:00Z' },
    { id: 'TKT-004', tenantId: 'tenant-1', tenantName: 'SecureCorp Solutions', subject: 'Request: Bulk officer import via CSV', message: 'We have 80+ new officers to onboard. Can the system support bulk CSV import to speed up the process?', severity: 'low', status: 'resolved', createdAt: '2026-02-18T08:00:00Z', response: 'CSV bulk import is on our Q2 2026 roadmap. In the meantime, we have created a batch invite link for your HR team.' },
    { id: 'TKT-005', tenantId: 'tenant-5', tenantName: 'Fortress Security Group', subject: 'Account suspended – urgent reactivation', message: 'Our account was suspended and we have 50+ officers unable to clock in. We have processed the outstanding payment. Please reactivate urgently.', severity: 'critical', status: 'in-progress', createdAt: '2026-02-23T07:00:00Z' },
    { id: 'TKT-006', tenantId: 'tenant-3', tenantName: 'Vanguard Patrol Inc.', subject: 'Onboarding training session request', message: 'Our team has completed setup. Can we schedule an online training session for our site managers on how to use the system?', severity: 'low', status: 'open', createdAt: '2026-02-23T10:00:00Z' },
];

export const mockMaintenanceLogs: MaintenanceLog[] = [
    { id: 'MNT-001', service: 'NFC Sync Engine', type: 'corrective', status: 'in-progress', reportedAt: '2026-02-21T09:00:00Z', note: 'Checkpoint sync failures reported by SecureCorp. Root cause: Redis cache TTL misconfiguration.', assignedTo: 'Dev Team – Backend' },
    { id: 'MNT-002', service: 'Alert Queue', type: 'corrective', status: 'resolved', reportedAt: '2026-02-15T14:00:00Z', resolvedAt: '2026-02-15T18:30:00Z', note: 'Alert notifications delayed by 8-12 minutes. Fixed by scaling RabbitMQ consumer workers.', assignedTo: 'Infra Team' },
    { id: 'MNT-003', service: 'Auth Service', type: 'preventive', status: 'resolved', reportedAt: '2026-02-10T08:00:00Z', resolvedAt: '2026-02-10T10:00:00Z', note: 'Scheduled JWT secret rotation and token refresh update. No downtime.', assignedTo: 'Security Team' },
    { id: 'MNT-004', service: 'API Gateway', type: 'emergency', status: 'pending', reportedAt: '2026-02-23T06:00:00Z', note: 'Rate limiting not enforcing correctly under load. High CPU spike during peak hours. Patch being prepared.', assignedTo: 'Dev Team – Backend' },
];

export const mockOnboarding: OnboardingRequest[] = [
    { id: 'ONB-001', companyName: 'Vanguard Patrol Inc.', contactName: 'Derek Vanguard', contactEmail: 'admin@vanguard.co.za', plan: 'pro', submittedAt: '2026-01-20T10:00:00Z', status: 'approved', notes: 'Verified business registration. Approved for Pro plan.' },
    { id: 'ONB-002', companyName: 'Apex Protection Services', contactName: 'Linda Apex', contactEmail: 'linda@apexprotection.co.za', plan: 'enterprise', submittedAt: '2026-02-20T09:00:00Z', status: 'pending' },
    { id: 'ONB-003', companyName: 'Nightwatch Guard Co.', contactName: 'James Nightwatch', contactEmail: 'james@nightwatch.co.za', plan: 'basic', submittedAt: '2026-02-21T11:00:00Z', status: 'pending' },
    { id: 'ONB-004', companyName: 'Phantom Security Ltd', contactName: 'Tom Phantom', contactEmail: 'tom@phantomsec.co.za', plan: 'pro', submittedAt: '2026-02-10T14:00:00Z', status: 'rejected', notes: 'Incomplete business documentation provided.' },
];
