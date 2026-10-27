import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Droplets,
  MessageSquare,
  Calendar,
  Mail,
  Flag,
  History,
  Building2,
  Bell,
  BarChart3,
  Terminal,
  FileSpreadsheet,
  Settings,
  Database,
  Copy,
  Check,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  Download,
  AlertCircle,
  HeartHandshake,
  Search,
  Eye,
  Phone,
  MapPin,
  Bot,
  Sparkles,
  Cpu,
  Zap,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { authFetch } from '../services/api.js';
import {
  RECOMMENDED_AI_AGENTS,
  LIFELINK_247_AI_AGENT_WORKFLOW_JSON,
  LIFELINK_UNIFIED_DONOR_LIFECYCLE_WORKFLOW_JSON
} from '../data/aiAgentWorkflowData.js';
import {
  SystemStats,
  User,
  BloodRequest,
  DonationAppointment,
  ContactMessage,
  Campaign,
  NotificationOutbox,
  AutomationDeliveryLog,
  AuditLog,
  DonationHistory
} from '../types/index.js';
import { SRI_LANKA_HOSPITALS, SRI_LANKA_DISTRICTS } from '../data/sriLankaData.js';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'donors' | 'requesters' | 'users' | 'requests' | 'contacts' | 'appointments' | 'messages' | 'campaigns' | 'history' | 'hospitals' | 'notifications' | 'reports' | 'automation' | 'audit' | 'settings' | 'database'
  >('overview');

  // Requester Management State
  const [requesterSearchQuery, setRequesterSearchQuery] = useState('');
  const [requesterDistrictFilter, setRequesterDistrictFilter] = useState('');
  const [selectedRequesterForModal, setSelectedRequesterForModal] = useState<any | null>(null);

  // Admin Data
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [requestsList, setRequestsList] = useState<BloodRequest[]>([]);
  const [appointmentsList, setAppointmentsList] = useState<DonationAppointment[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [historyList, setHistoryList] = useState<DonationHistory[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [outbox, setOutbox] = useState<NotificationOutbox[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<AutomationDeliveryLog[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [supabaseInputUrl, setSupabaseInputUrl] = useState('');
  const [supabaseInputKey, setSupabaseInputKey] = useState('');
  const [savingSupabaseConfig, setSavingSupabaseConfig] = useState(false);
  const [testingSupabaseConn, setTestingSupabaseConn] = useState(false);
  const [supabaseConfigNotice, setSupabaseConfigNotice] = useState<{ type: 'success' | 'error' | 'warning'; message: string; tamil?: string } | null>(null);
  const [cloudSqlData, setCloudSqlData] = useState<any>(null);
  const [cloudSqlTableTab, setCloudSqlTableTab] = useState<'users' | 'donorProfiles' | 'bloodRequests' | 'campaigns'>('users');
  const [loadingCloudSql, setLoadingCloudSql] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userActionMessage, setUserActionMessage] = useState<string | null>(null);

  // System Settings state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('lifelink-secret-key-jaffna');
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<string | null>(null);
  const [workerRunning, setWorkerRunning] = useState(false);
  const [workerResult, setWorkerResult] = useState<any>(null);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testWebhookResult, setTestWebhookResult] = useState<string | null>(null);
  const [testingBrowserDirect, setTestingBrowserDirect] = useState(false);

  // 24/7 AI Agent Hub state
  const [copiedAiWorkflow, setCopiedAiWorkflow] = useState(false);
  const [aiSimulationBloodGroup, setAiSimulationBloodGroup] = useState('B+');
  const [aiSimulationDistrict, setAiSimulationDistrict] = useState('Jaffna');
  const [aiSimulationUrgency, setAiSimulationUrgency] = useState('CRITICAL');
  const [aiSimulationNote, setAiSimulationNote] = useState('Urgent transfusion required for emergency trauma surgery at Teaching Hospital Jaffna');
  const [aiSimulationRunning, setAiSimulationRunning] = useState(false);
  const [aiSimulationResult, setAiSimulationResult] = useState<any | null>(null);

  const handleCopyAiWorkflow = () => {
    navigator.clipboard.writeText(LIFELINK_247_AI_AGENT_WORKFLOW_JSON);
    setCopiedAiWorkflow(true);
    setTimeout(() => setCopiedAiWorkflow(false), 3500);
  };

  const handleDownloadAiWorkflow = () => {
    const blob = new Blob([LIFELINK_247_AI_AGENT_WORKFLOW_JSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifelink_247_ai_agent_emergency_triage.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Single Unified Lifecycle Workflow State (Requester -> Donor with Nearby Hospitals, Donor -> Requester Acceptance)
  const [copiedUnifiedWorkflow, setCopiedUnifiedWorkflow] = useState(false);
  const [unifiedScenario, setUnifiedScenario] = useState<'REQUEST' | 'ACCEPT'>('REQUEST');
  const [unifiedTestDistrict, setUnifiedTestDistrict] = useState('Jaffna');
  const [unifiedTestEmail, setUnifiedTestEmail] = useState('');
  const [unifiedTestLoading, setUnifiedTestLoading] = useState(false);
  const [unifiedTestResult, setUnifiedTestResult] = useState<any | null>(null);

  const handleCopyUnifiedWorkflow = () => {
    navigator.clipboard.writeText(LIFELINK_UNIFIED_DONOR_LIFECYCLE_WORKFLOW_JSON);
    setCopiedUnifiedWorkflow(true);
    setTimeout(() => setCopiedUnifiedWorkflow(false), 3500);
  };

  const handleDownloadUnifiedWorkflow = () => {
    const blob = new Blob([LIFELINK_UNIFIED_DONOR_LIFECYCLE_WORKFLOW_JSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifelink_unified_donor_lifecycle_ai_agent.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunUnifiedTest = async () => {
    setUnifiedTestLoading(true);
    setUnifiedTestResult(null);
    try {
      const res = await authFetch('/api/admin/automation/test-unified-workflow', {
        method: 'POST',
        body: JSON.stringify({
          scenario: unifiedScenario,
          customEmail: unifiedTestEmail || user?.email,
          district: unifiedTestDistrict
        })
      });
      const data = await res.json();
      setUnifiedTestResult(data);
      // Refresh outbox & delivery logs
      loadAllAdminData();
    } catch (err: any) {
      setUnifiedTestResult({ success: false, message: err.message || 'Error executing test' });
    } finally {
      setUnifiedTestLoading(false);
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseInputUrl || !supabaseInputKey) {
      setSupabaseConfigNotice({
        type: 'error',
        message: 'Please provide both the Supabase Project URL and API Key.',
        tamil: 'தயவுசெய்து Supabase Project URL மற்றும் API Key இரண்டையும் உள்ளிடவும்.'
      });
      return;
    }
    setSavingSupabaseConfig(true);
    setSupabaseConfigNotice(null);
    try {
      const res = await authFetch('/api/admin/database/configure', {
        method: 'POST',
        body: JSON.stringify({
          supabaseUrl: supabaseInputUrl.trim(),
          supabaseKey: supabaseInputKey.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSupabaseConfigNotice({
          type: 'success',
          message: data.testResult?.message || 'Supabase connected and synchronized successfully!',
          tamil: data.testResult?.tamilMessage || 'Supabase வெற்றிகரமாக இணைக்கப்பட்டு தரவுகள் ஒருங்கிணைக்கப்பட்டன!'
        });
        loadAllAdminData();
      } else {
        setSupabaseConfigNotice({
          type: data.testResult?.tablesInitialized === false ? 'warning' : 'error',
          message: data.testResult?.message || data.error || 'Failed to connect to Supabase.',
          tamil: data.testResult?.tamilMessage || data.tamilMessage
        });
      }
    } catch (err: any) {
      setSupabaseConfigNotice({
        type: 'error',
        message: err.message || 'Error configuring Supabase.'
      });
    } finally {
      setSavingSupabaseConfig(false);
    }
  };

  const handleTestSupabaseConn = async () => {
    if (!supabaseInputUrl) {
      setSupabaseConfigNotice({
        type: 'error',
        message: 'Please enter a Supabase Project URL to test.',
        tamil: 'சோதனை செய்வதற்கு Supabase Project URL-ஐ உள்ளிடவும்.'
      });
      return;
    }
    setTestingSupabaseConn(true);
    setSupabaseConfigNotice(null);
    try {
      const res = await authFetch('/api/admin/database/test-connection', {
        method: 'POST',
        body: JSON.stringify({
          supabaseUrl: supabaseInputUrl.trim(),
          supabaseKey: supabaseInputKey.trim()
        })
      });
      const data = await res.json();
      setSupabaseConfigNotice({
        type: data.connected ? (data.tablesInitialized ? 'success' : 'warning') : 'error',
        message: data.message,
        tamil: data.tamilMessage
      });
    } catch (err: any) {
      setSupabaseConfigNotice({
        type: 'error',
        message: err.message || 'Connection test request failed.'
      });
    } finally {
      setTestingSupabaseConn(false);
    }
  };

  const handleRunAiSimulation = () => {
    setAiSimulationRunning(true);
    setTimeout(() => {
      const compatMap: Record<string, string[]> = {
        'O-': ['O-'],
        'O+': ['O+', 'O-'],
        'A-': ['A-', 'O-'],
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'AB-': ['AB-', 'A-', 'B-', 'O-'],
        'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-']
      };
      const compatibleGroups = compatMap[aiSimulationBloodGroup] || [aiSimulationBloodGroup];
      const matchedHospitals = SRI_LANKA_HOSPITALS.filter(h => h.district === aiSimulationDistrict);
      const govtHosp = matchedHospitals.find(h => h.sector !== 'PRIVATE') || matchedHospitals[0] || { name: 'Teaching Hospital Jaffna', phone: '+94 21 222 2261', lat: 9.6644, lng: 80.0177 };
      const pvtHosp = matchedHospitals.find(h => h.sector === 'PRIVATE') || { name: 'Northern Central Hospital, Jaffna', phone: '+94 21 221 2222', lat: 9.6748, lng: 80.0210 };

      setAiSimulationResult({
        timestamp: new Date().toISOString(),
        urgency: aiSimulationUrgency,
        bloodGroup: aiSimulationBloodGroup,
        district: aiSimulationDistrict,
        compatibleGroups,
        matchedDonorsCount: Math.floor(Math.random() * 4) + 3,
        primaryGovtHospital: govtHosp,
        primaryPrivateHospital: pvtHosp,
        triageSummaryTa: `🚨 அவசர இரத்தப் பகுப்பாய்வு முடிவு: ${aiSimulationDistrict} மாவட்டத்தில் ${aiSimulationBloodGroup} இரத்த தேவைக்காக ${compatibleGroups.join(', ')} வகை பொருத்தமான கொடையாளர்கள் அடையாளம் காணப்பட்டுள்ளனர். அரசு இரத்த வங்கி (${govtHosp.name}) மற்றும் தனியார் அவசர பிரிவு (${pvtHosp.name}) உடன் ஒருங்கிணைக்கப்பட்டு நேரடி வரைபட வழிகாட்டல் அனுப்பப்படுகிறது.`,
        triageSummaryEn: `CRITICAL TRIAGE CONFIRMED: For ${aiSimulationBloodGroup} requirement in ${aiSimulationDistrict}, compatible donor pool includes [${compatibleGroups.join(', ')}]. Emergency dispatch routed to ${govtHosp.name} (Govt Blood Bank) and ${pvtHosp.name} (Private Facility). Turn-by-turn navigation dispatched.`
      });
      setAiSimulationRunning(false);
    }, 800);
  };

  // New Campaign state
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampLoc, setNewCampLoc] = useState('');
  const [newCampDist, setNewCampDist] = useState('Jaffna');
  const [newCampDate, setNewCampDate] = useState('2026-11-20T09:00:00');
  const [newCampTarget, setNewCampTarget] = useState(150);

  const loadAllAdminData = async () => {
    try {
      const [resStats, resUsers, resReq, resApt, resMsg, resCamp, resHist, resAud, resAuto, resDb, resCloudSql] = await Promise.all([
        authFetch('/api/stats').then(r => r.json()),
        authFetch('/api/admin/users').then(r => r.json()),
        authFetch('/api/requests').then(r => r.json()),
        authFetch('/api/appointments').then(r => r.json()),
        authFetch('/api/contact-messages').then(r => r.json()),
        authFetch('/api/campaigns').then(r => r.json()),
        authFetch('/api/donation-history').then(r => r.json()),
        authFetch('/api/admin/audit-logs').then(r => r.json()),
        authFetch('/api/admin/automation-logs').then(r => r.json()),
        authFetch('/api/database/status').then(r => r.json()).catch(() => null),
        authFetch('/api/admin/database/cloudsql-tables').then(r => r.json()).catch(() => null)
      ]);

      if (resStats?.success) setStats(resStats);
      if (resUsers?.success) setUsersList(resUsers.users);
      if (resReq?.success) setRequestsList(resReq.requests);
      if (resApt?.success) setAppointmentsList(resApt.appointments);
      if (resMsg?.success) setMessagesList(resMsg.messages);
      if (resCamp?.success) setCampaignsList(resCamp.campaigns);
      if (resHist?.success) setHistoryList(resHist.history);
      if (resCloudSql?.success && resCloudSql.data) setCloudSqlData(resCloudSql.data);
      if (resDb) {
        setDbStatus(resDb);
        if (resDb.fullUrl) {
          setSupabaseInputUrl(prev => prev || resDb.fullUrl);
        }
      }
      if (resAuto?.success) {
        setOutbox(resAuto.outbox);
        setDeliveryLogs(resAuto.deliveryLogs);
        if (resAuto.settings) {
          setWebhookUrl(resAuto.settings.N8N_WEBHOOK_URL || '');
          setAutomationEnabled(resAuto.settings.AUTOMATION_ENABLED === 'true');
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleVerifyDonor = async (userId: string, isVerified: boolean) => {
    try {
      const res = await authFetch(`/api/admin/users/${userId}/verify-donor`, {
        method: 'PATCH',
        body: JSON.stringify({ isVerified })
      });
      if (res.ok) loadAllAdminData();
    } catch {
      // ignore
    }
  };

  const handleVerifyRequester = async (userId: string, isVerified: boolean) => {
    try {
      const res = await authFetch(`/api/admin/users/${userId}/verify-requester`, {
        method: 'PATCH',
        body: JSON.stringify({ isVerified })
      });
      if (res.ok) loadAllAdminData();
    } catch {
      // ignore
    }
  };

  const handleToggleUserStatus = async (userId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    try {
      const res = await authFetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.ok) loadAllAdminData();
    } catch {
      // ignore
    }
  };

  const handleConfirmDeleteSingleUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setUserActionMessage(null);
    try {
      const res = await authFetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUserActionMessage(`User "${userToDelete.name}" was permanently deleted from database.`);
        loadAllAdminData();
      } else {
        setUserActionMessage(data.error || 'Failed to delete user.');
      }
    } catch (err: any) {
      setUserActionMessage(err.message || 'Error deleting user.');
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
      setTimeout(() => setUserActionMessage(null), 4000);
    }
  };

  const handleConfirmDeleteAllUsers = async () => {
    setIsDeleting(true);
    setUserActionMessage(null);
    try {
      const res = await authFetch('/api/admin/users/all/non-admin', {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUserActionMessage(`Successfully deleted all ${data.deletedCount} non-admin users from Supabase and database.`);
        loadAllAdminData();
      } else {
        setUserActionMessage(data.error || 'Failed to delete users.');
      }
    } catch (err: any) {
      setUserActionMessage(err.message || 'Error deleting all users.');
    } finally {
      setIsDeleting(false);
      setShowDeleteAllModal(false);
      setTimeout(() => setUserActionMessage(null), 5000);
    }
  };

  const handleVerifyBloodRequest = async (requestId: string, status: 'ACTIVE' | 'REJECTED' | 'FULFILLED') => {
    try {
      const res = await authFetch(`/api/admin/requests/${requestId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.ok) loadAllAdminData();
    } catch {
      // ignore
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      const res = await authFetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'COMPLETED',
          completedNotes: 'Medically confirmed blood donation procedure'
        })
      });
      if (res.ok) loadAllAdminData();
    } catch {
      // ignore
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus(null);
    try {
      const res = await authFetch('/api/admin/system-settings', {
        method: 'POST',
        body: JSON.stringify({
          N8N_WEBHOOK_URL: webhookUrl,
          N8N_WEBHOOK_SECRET: webhookSecret,
          AUTOMATION_ENABLED: String(automationEnabled)
        })
      });
      if (res.ok) {
        setSettingsStatus('Settings updated successfully.');
      }
    } catch {
      setSettingsStatus('Failed to update system settings.');
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setTestWebhookResult(null);
    try {
      const res = await authFetch('/api/admin/automation/test-webhook', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTestWebhookResult(`Test event delivered! n8n response code: HTTP ${data.status || 200}`);
      } else {
        setTestWebhookResult(`Test not delivered: ${data.message || 'Check your n8n Webhook URL'}`);
      }
      loadAllAdminData();
    } catch {
      setTestWebhookResult('Network error communicating with test endpoint');
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleBrowserDirectTest = async () => {
    if (!webhookUrl) return;
    setTestingBrowserDirect(true);
    setTestWebhookResult(null);
    try {
      const payload = {
        event: 'DONOR_CONTACT_REQUEST',
        eventType: 'DONOR_CONTACT_REQUEST',
        timestamp: new Date().toISOString(),
        recipientEmail: user?.email || 'donor@lifelink.lk',
        recipientName: 'Kandeeban Shanmugam',
        subject: 'LifeLink Test: Urgent Blood Donation Request from Browser',
        payload: {
          test: true,
          donor: {
            fullName: 'Kandeeban Shanmugam',
            email: user?.email || 'donor@lifelink.lk',
            bloodGroup: 'B-',
            district: 'Jaffna'
          },
          requester: {
            fullName: user?.fullName || 'Sara (Requester)',
            phone: user?.phone || '+94771234567'
          },
          message: 'Urgent B- blood needed at Jaffna Teaching Hospital.'
        },
        source: 'LifeLink Sri Lanka Blood Donation System (Browser Direct Test)'
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lifelink-secret': 'lifelink-secret-key-jaffna'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setTestWebhookResult(`Browser successfully sent test payload to local n8n! HTTP ${res.status}. Check your n8n workflow canvas!`);
      } else {
        const text = await res.text();
        setTestWebhookResult(`n8n responded HTTP ${res.status}: ${text.slice(0, 100)}`);
      }
    } catch (err: any) {
      setTestWebhookResult(`Browser fetch error: ${err.message}. Make sure n8n is running and "Listen for test event" is active.`);
    } finally {
      setTestingBrowserDirect(false);
    }
  };

  const handleTriggerEditorTest = async () => {
    if (!webhookUrl) return;
    setTestingBrowserDirect(true);
    setTestWebhookResult(null);
    const testUrl = webhookUrl.includes('/webhook-test/') ? webhookUrl : webhookUrl.replace('/webhook/', '/webhook-test/');
    try {
      const payload = {
        event: 'TEST_EVENT_FOR_CANVAS',
        eventType: 'DONOR_CONTACT_REQUEST',
        timestamp: new Date().toISOString(),
        recipientEmail: user?.email || 'admin@lifelink.lk',
        recipientName: user?.fullName || 'System Administrator',
        subject: 'LifeLink Test Event (Canvas Live Listener)',
        payload: {
          test: true,
          message: 'Hello from LifeLink! This test event feeds your active n8n editor canvas listener.',
          donor: {
            fullName: 'Kandeeban Shanmugam',
            email: 'donor@lifelink.lk',
            bloodGroup: 'B+',
            district: 'Jaffna'
          },
          requester: {
            fullName: user?.fullName || 'Emergency Requester',
            phone: '+94 77 123 4567'
          }
        },
        source: 'LifeLink Sri Lanka (Canvas Test Trigger)'
      };

      const res = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lifelink-secret': webhookSecret || 'lifelink-secret-key-jaffna'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setTestWebhookResult(`🎉 Success! Test event sent to n8n Canvas Test URL. Check your n8n editor; the spinning loader should now show green!`);
      } else {
        const txt = await res.text();
        setTestWebhookResult(`n8n response (HTTP ${res.status}): ${txt.slice(0, 150)}`);
      }
    } catch (err: any) {
      setTestWebhookResult(`Test fetch error: ${err.message}. Make sure "Listen for test event" is active in n8n.`);
    } finally {
      setTestingBrowserDirect(false);
    }
  };

  const handleTriggerAutomationWorker = async () => {
    setWorkerRunning(true);
    setWorkerResult(null);
    try {
      const res = await authFetch('/api/admin/automation/trigger-worker', {
        method: 'POST'
      });
      const data = await res.json();
      setWorkerResult(data);
      loadAllAdminData();
    } catch {
      setWorkerResult({ error: 'Worker dispatch error' });
    } finally {
      setWorkerRunning(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          title: newCampTitle,
          description: newCampDesc,
          location: newCampLoc,
          district: newCampDist,
          startDate: new Date(newCampDate).toISOString(),
          targetUnits: Number(newCampTarget)
        })
      });
      if (res.ok) {
        setNewCampTitle('');
        setNewCampDesc('');
        setNewCampLoc('');
        loadAllAdminData();
        setActiveTab('campaigns');
      }
    } catch {
      // ignore
    }
  };

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const donorsOnly = usersList.filter(u => u.role === 'DONOR');
  const pendingDonors = donorsOnly.filter(u => !u.isVerified);
  const requestersOnly = usersList.filter(u => u.role === 'REQUESTER');
  const pendingRequesters = requestersOnly.filter(u => !u.isVerified);
  const pendingRequests = requestsList.filter(r => r.status === 'PENDING_VERIFICATION');

  const filteredRequesters = requestersOnly.filter(r => {
    const matchesSearch = !requesterSearchQuery ||
      r.fullName.toLowerCase().includes(requesterSearchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(requesterSearchQuery.toLowerCase()) ||
      r.phone.includes(requesterSearchQuery);
    const matchesDistrict = !requesterDistrictFilter ||
      r.requesterProfile?.district === requesterDistrictFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#DC0A20] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white block">LifeLink</span>
            <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">Central Admin Console</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto text-xs font-medium">
          {[
            { id: 'overview', label: '1. Dashboard Overview', icon: LayoutDashboard },
            { id: 'donors', label: '2. Donor Management', icon: UserCheck, badge: pendingDonors.length },
            { id: 'requesters', label: '3. Requester Management', icon: HeartHandshake, badge: requestersOnly.length },
            { id: 'users', label: '4. All Users Directory', icon: Users, badge: usersList.length },
            { id: 'requests', label: '5. Blood Requests', icon: Droplets, badge: pendingRequests.length },
            { id: 'appointments', label: '6. Appointments', icon: Calendar },
            { id: 'messages', label: '7. Contact Messages', icon: Mail, badge: messagesList.filter(m => !m.isRead).length },
            { id: 'campaigns', label: '8. Campaign Management', icon: Flag },
            { id: 'history', label: '9. Donation History', icon: History },
            { id: 'hospitals', label: '10. Hospitals & Locations', icon: Building2 },
            { id: 'reports', label: '11. Reports & Analytics', icon: BarChart3 },
            { id: 'automation', label: '12. AI Agents & Automation', icon: Bot, badge: '24/7 AI' },
            { id: 'audit', label: '13. Audit Logs', icon: FileSpreadsheet },
            { id: 'settings', label: '14. System Settings', icon: Settings },
            { id: 'database', label: '15. Supabase Database', icon: Database, badge: dbStatus?.isSupabaseConfigured ? 'Live' : undefined },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#DC0A20] text-white font-bold'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (typeof item.badge === 'number' ? item.badge > 0 : Boolean(item.badge)) && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-white text-neutral-900">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>16. Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900">Administrative Overview</h1>
              <p className="text-xs text-neutral-500 mt-1">Real-time system health and clinical verification status.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Total Registered Users</span>
                <span className="text-3xl font-extrabold text-neutral-900 font-mono mt-1 block">
                  {stats ? stats.totalUsers : 0}
                </span>
                <span className="text-[11px] text-neutral-400">All authenticated roles</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Active Donors</span>
                <span className="text-3xl font-extrabold text-emerald-700 font-mono mt-1 block">
                  {donorsOnly.length}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {pendingDonors.length} pending verification
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200 cursor-pointer hover:border-[#DC0A20] transition-colors" onClick={() => setActiveTab('requesters')}>
                <span className="text-xs text-neutral-500 block">Registered Requesters</span>
                <span className="text-3xl font-extrabold text-blue-600 font-mono mt-1 block">
                  {requestersOnly.length}
                </span>
                <span className="text-[11px] text-blue-500 font-medium">Click to manage &rarr;</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Pending Blood Requests</span>
                <span className="text-3xl font-extrabold text-amber-600 font-mono mt-1 block">
                  {stats ? stats.pendingRequests : 0}
                </span>
                <span className="text-[11px] text-neutral-400">Awaiting hospital check</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Notification Outbox</span>
                <span className="text-3xl font-extrabold text-[#DC0A20] font-mono mt-1 block">
                  {outbox.filter(o => o.status === 'QUEUED').length}
                </span>
                <span className="text-[11px] text-neutral-400">Ready for worker dispatch</span>
              </div>
            </div>

            {/* Priority Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pending Donors Review */}
              <div className="p-6 bg-white rounded-2xl border border-neutral-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-neutral-900">Pending Donor Verifications</h3>
                  <span className="text-xs text-amber-700 font-bold font-mono">{pendingDonors.length} Pending</span>
                </div>

                {pendingDonors.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">All registered donors have been verified.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingDonors.slice(0, 4).map((d) => (
                      <div key={d.id} className="p-3.5 bg-neutral-50 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-neutral-900 block">{d.fullName}</span>
                          <span className="text-neutral-500">{d.email} &middot; {d.donorProfile?.bloodGroup} &middot; {d.donorProfile?.district}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVerifyDonor(d.id, true)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 text-xs"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Requests Review */}
              <div className="p-6 bg-white rounded-2xl border border-neutral-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-neutral-900">Pending Blood Requests</h3>
                  <span className="text-xs text-[#DC0A20] font-bold font-mono">{pendingRequests.length} Pending</span>
                </div>

                {pendingRequests.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">No blood requests waiting for verification.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.slice(0, 4).map((req) => (
                      <div key={req.id} className="p-3.5 bg-neutral-50 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-neutral-900 block">{req.hospital} ({req.district})</span>
                          <span className="text-neutral-500">
                            Ref: {req.patientReference} &middot; {req.unitsRequired} units {req.bloodGroup} &middot; {req.urgency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVerifyBloodRequest(req.id, 'ACTIVE')}
                            className="px-3 py-1 bg-[#DC0A20] text-white rounded-lg font-semibold hover:bg-[#B80020] text-xs"
                          >
                            Activate
                          </button>
                          <button
                            onClick={() => handleVerifyBloodRequest(req.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-neutral-200 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-300 text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DONOR MANAGEMENT */}
        {activeTab === 'donors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Donor Management</h2>
                <p className="text-xs text-neutral-500 mt-1">Review, approve, or suspend voluntary blood donor records.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Donor Name</th>
                    <th className="py-3 px-4 font-semibold">Email & Phone</th>
                    <th className="py-3 px-4 font-semibold">Blood Group</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {donorsOnly.map((d) => (
                    <tr key={d.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-bold text-neutral-900">{d.fullName}</td>
                      <td className="py-3 px-4 text-neutral-600">{d.email}<br/><span className="font-mono text-[11px]">{d.phone}</span></td>
                      <td className="py-3 px-4 font-bold text-[#DC0A20]">{d.donorProfile?.bloodGroup}</td>
                      <td className="py-3 px-4 text-neutral-600">{d.donorProfile?.city}, {d.donorProfile?.district}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          d.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleVerifyDonor(d.id, !d.isVerified)}
                          className="px-2.5 py-1 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium"
                        >
                          {d.isVerified ? 'Revoke' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(d.id, d.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                          className={`px-2.5 py-1 rounded font-medium ${
                            d.status === 'ACTIVE'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {d.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REQUESTER MANAGEMENT */}
        {activeTab === 'requesters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Requester Management</h2>
                <p className="text-xs text-neutral-500 mt-1">Manage patient families, hospitals, and voluntary blood requesters.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportCSV(requestersOnly.map(r => ({
                    id: r.id,
                    name: r.fullName,
                    email: r.email,
                    phone: r.phone,
                    district: r.requesterProfile?.district || 'Jaffna',
                    city: r.requesterProfile?.city || 'Jaffna Town',
                    organization: r.requesterProfile?.organizationName || 'Individual',
                    verified: r.isVerified ? 'VERIFIED' : 'PENDING',
                    status: r.status,
                    registeredAt: r.createdAt
                  })), 'requesters_export')}
                  className="px-3.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Total Requesters</span>
                <span className="text-2xl font-extrabold text-neutral-900 font-mono mt-1 block">
                  {requestersOnly.length}
                </span>
                <span className="text-[11px] text-neutral-400">Registered accounts</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Active Requesters</span>
                <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
                  {requestersOnly.filter(r => r.status === 'ACTIVE').length}
                </span>
                <span className="text-[11px] text-neutral-400">In good standing</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Verified Requesters</span>
                <span className="text-2xl font-extrabold text-blue-600 font-mono mt-1 block">
                  {requestersOnly.filter(r => r.isVerified).length}
                </span>
                <span className="text-[11px] text-neutral-400">Identity verified</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Pending Review</span>
                <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
                  {pendingRequesters.length}
                </span>
                <span className="text-[11px] text-neutral-400">Verification needed</span>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 flex flex-wrap items-center gap-3 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search requesters by name, email, or phone..."
                  value={requesterSearchQuery}
                  onChange={(e) => setRequesterSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:bg-white"
                />
              </div>

              <div className="w-48">
                <select
                  value={requesterDistrictFilter}
                  onChange={(e) => setRequesterDistrictFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50"
                >
                  <option value="">All Districts</option>
                  {Object.keys(SRI_LANKA_DISTRICTS).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {(requesterSearchQuery || requesterDistrictFilter) && (
                <button
                  onClick={() => { setRequesterSearchQuery(''); setRequesterDistrictFilter(''); }}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Requester Name</th>
                    <th className="py-3 px-4 font-semibold">Email & Phone</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Organization</th>
                    <th className="py-3 px-4 font-semibold">Blood Requests</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredRequesters.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-500">
                        No requesters found matching the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequesters.map((r) => {
                      const reqsSubmitted = requestsList.filter(req => req.requesterId === r.id);
                      return (
                        <tr key={r.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-neutral-900 block">{r.fullName}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">ID: {r.id}</span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600">
                            <span>{r.email}</span>
                            <br />
                            <span className="font-mono text-[11px] text-neutral-500">{r.phone}</span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600">
                            <span>{r.requesterProfile?.city || 'Jaffna Town'}</span>
                            <br />
                            <span className="text-neutral-400 text-[11px]">{r.requesterProfile?.district || 'Jaffna'}</span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600">
                            {r.requesterProfile?.organizationName ? (
                              <span className="px-2 py-0.5 rounded bg-neutral-100 font-medium text-neutral-700">
                                {r.requesterProfile.organizationName}
                              </span>
                            ) : (
                              <span className="text-neutral-400">Individual</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-red-50 text-[#DC0A20]">
                              {reqsSubmitted.length} Request(s)
                            </span>
                          </td>
                          <td className="py-3 px-4 space-y-1">
                            <div>
                              <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                                r.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {r.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                                r.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {r.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRequesterForModal(r)}
                              title="View Details & Blood Requests"
                              className="px-2.5 py-1 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleVerifyRequester(r.id, !r.isVerified)}
                              className="px-2.5 py-1 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium cursor-pointer"
                            >
                              {r.isVerified ? 'Revoke' : 'Verify'}
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(r.id, r.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                                r.status === 'ACTIVE'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {r.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Requester Detail Modal */}
            {selectedRequesterForModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
                  <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#DC0A20] uppercase tracking-wider">Requester Account Profile</span>
                      <h3 className="text-xl font-bold text-neutral-900 mt-0.5">{selectedRequesterForModal.fullName}</h3>
                      <p className="text-xs text-neutral-500 font-mono">User ID: {selectedRequesterForModal.id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedRequesterForModal(null)}
                      className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <div>
                      <span className="text-neutral-500 block">Email Address:</span>
                      <span className="font-semibold text-neutral-800">{selectedRequesterForModal.email}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Phone Number:</span>
                      <span className="font-semibold text-neutral-800">{selectedRequesterForModal.phone}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">District & City:</span>
                      <span className="font-semibold text-neutral-800">
                        {selectedRequesterForModal.requesterProfile?.city || 'Jaffna Town'}, {selectedRequesterForModal.requesterProfile?.district || 'Jaffna'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Organization:</span>
                      <span className="font-semibold text-neutral-800">
                        {selectedRequesterForModal.requesterProfile?.organizationName || 'None (Individual)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Registered On:</span>
                      <span className="font-semibold text-neutral-800 font-mono text-[11px]">
                        {new Date(selectedRequesterForModal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Account Status:</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedRequesterForModal.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedRequesterForModal.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 mb-2">
                      Blood Requests Submitted by {selectedRequesterForModal.fullName}:
                    </h4>
                    {requestsList.filter(req => req.requesterId === selectedRequesterForModal.id).length === 0 ? (
                      <p className="text-xs text-neutral-500 py-3 text-center bg-neutral-50 rounded-xl">
                        No blood requests submitted yet by this requester.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {requestsList.filter(req => req.requesterId === selectedRequesterForModal.id).map(req => (
                          <div key={req.id} className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs border border-neutral-200">
                            <div>
                              <span className="font-bold text-neutral-900 block">{req.hospital}</span>
                              <span className="text-neutral-500 text-[11px]">
                                {req.bloodGroup} &middot; {req.unitsRequired} Units &middot; Ref: {req.patientReference}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-800">
                              {req.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => setSelectedRequesterForModal(null)}
                      className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ALL USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {userActionMessage && (
              <div className="p-4 bg-neutral-900 text-white rounded-xl text-xs flex items-center justify-between shadow-lg animate-fade-in border border-neutral-700">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{userActionMessage}</span>
                </div>
                <button
                  onClick={() => setUserActionMessage(null)}
                  className="text-neutral-400 hover:text-white text-xs ml-4 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">User Directory</h2>
                <p className="text-xs text-neutral-500 mt-1">Full registry of system administrators, registered donors, and requesters.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportCSV(usersList.map(u => ({
                    id: u.id,
                    name: u.fullName,
                    email: u.email,
                    phone: u.phone,
                    role: u.role,
                    status: u.status,
                    verified: u.isVerified ? 'YES' : 'NO',
                    registeredAt: u.createdAt
                  })), 'users_directory')}
                  className="px-3.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setShowDeleteAllModal(true)}
                  disabled={usersList.filter(u => u.role !== 'ADMIN').length === 0}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
                  title="Permanently delete all donors and requesters from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete All Users ({usersList.filter(u => u.role !== 'ADMIN').length})</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Verified</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 block">{u.fullName}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{u.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'DONOR' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        <span>{u.email}</span>
                        <br />
                        <span className="text-neutral-500 font-mono text-[11px]">{u.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {u.isVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'ADMIN' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                              className={`px-2.5 py-1 rounded font-medium cursor-pointer text-[11px] ${
                                u.status === 'ACTIVE'
                                  ? 'text-neutral-600 hover:bg-neutral-100'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => setUserToDelete({ id: u.id, name: u.fullName })}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                              title={`Delete ${u.fullName}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">Protected Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Confirm Delete Single User */}
            {userToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-fade-in">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-neutral-200">
                  <div className="flex items-center gap-3 text-red-600">
                    <div className="p-2.5 bg-red-100 rounded-xl">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">Delete User Account</h3>
                      <p className="text-xs text-neutral-500">This action is permanent and cannot be undone.</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-red-50/70 rounded-xl border border-red-100 text-xs text-neutral-700 space-y-2">
                    <p>
                      Are you sure you want to permanently delete user <span className="font-bold text-red-700">{userToDelete.name}</span> (ID: <code className="font-mono text-[11px]">{userToDelete.id}</code>)?
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      This user will be removed from memory, Supabase database, and Cloud SQL, along with their related records.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setUserToDelete(null)}
                      className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleConfirmDeleteSingleUser}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Permanently Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Confirm Delete ALL Users */}
            {showDeleteAllModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-fade-in">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-neutral-200">
                  <div className="flex items-center gap-3 text-red-600">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">Delete All Registered Users</h3>
                      <p className="text-xs text-neutral-500">Purge all donors and requesters from the system</p>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-2.5">
                    <p className="font-bold text-red-800">
                      WARNING: You are about to permanently delete {usersList.filter(u => u.role !== 'ADMIN').length} registered user(s).
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-neutral-700 text-[11px]">
                      <li>All non-admin donor and requester profiles will be wiped from Supabase.</li>
                      <li>All user records in Cloud SQL PostgreSQL will be removed.</li>
                      <li>In-memory database records will be reset.</li>
                      <li><strong>Your admin account ({user?.email}) is strictly protected and will NOT be deleted.</strong></li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setShowDeleteAllModal(false)}
                      className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleConfirmDeleteAllUsers}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Deleting all users...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Confirm & Delete All Users</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BLOOD REQUEST MANAGEMENT */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Blood Request Management</h2>
              <p className="text-xs text-neutral-500 mt-1">Verify hospital authenticity and update fulfillment statuses.</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Hospital & District</th>
                    <th className="py-3 px-4 font-semibold">Blood Group & Units</th>
                    <th className="py-3 px-4 font-semibold">Patient Ref</th>
                    <th className="py-3 px-4 font-semibold">Urgency</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {requestsList.map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-bold text-neutral-900">{req.hospital}<br/><span className="text-neutral-500 font-normal">{req.district}</span></td>
                      <td className="py-3 px-4 font-bold text-[#DC0A20] font-mono">{req.bloodGroup} &middot; {req.unitsRequired} Units</td>
                      <td className="py-3 px-4 text-neutral-600 font-mono">{req.patientReference}</td>
                      <td className="py-3 px-4 font-semibold">{req.urgency}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          req.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'PENDING_VERIFICATION' ? 'bg-amber-100 text-amber-800' :
                          req.status === 'FULFILLED' ? 'bg-blue-100 text-blue-800' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {req.status === 'PENDING_VERIFICATION' && (
                          <button
                            onClick={() => handleVerifyBloodRequest(req.id, 'ACTIVE')}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded font-medium"
                          >
                            Approve
                          </button>
                        )}
                        {req.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleVerifyBloodRequest(req.id, 'FULFILLED')}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded font-medium"
                          >
                            Mark Fulfilled
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Donation Appointments</h2>
              <p className="text-xs text-neutral-500 mt-1">Review appointments and certify completed hospital donations.</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 p-4 text-xs">
              {appointmentsList.map((a) => (
                <div key={a.id} className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900 block">{a.hospitalName}</span>
                    <span className="text-neutral-500 font-mono">
                      Scheduled: {new Date(a.scheduledAt).toLocaleString()} &middot; Status: <strong>{a.status}</strong>
                    </span>
                  </div>
                  {a.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleCompleteAppointment(a.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                    >
                      Certify Hospital Donation Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: CAMPAIGN MANAGEMENT */}
        {activeTab === 'campaigns' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Campaign Management</h2>
              <p className="text-xs text-neutral-500 mt-1">Create and schedule regional community blood drives.</p>
            </div>

            {/* Create Campaign Form */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 max-w-2xl">
              <h3 className="text-sm font-bold text-neutral-900 mb-4">Create New Blood Drive Campaign</h3>
              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Campaign Title</label>
                  <input
                    type="text"
                    required
                    value={newCampTitle}
                    onChange={(e) => setNewCampTitle(e.target.value)}
                    placeholder="e.g. Tellippalai Community Blood Drive"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">District</label>
                    <select
                      value={newCampDist}
                      onChange={(e) => setNewCampDist(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                    >
                      {Object.keys(SRI_LANKA_DISTRICTS).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Target Units</label>
                    <input
                      type="number"
                      required
                      value={newCampTarget}
                      onChange={(e) => setNewCampTarget(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Location Details</label>
                  <input
                    type="text"
                    required
                    value={newCampLoc}
                    onChange={(e) => setNewCampLoc(e.target.value)}
                    placeholder="e.g. Tellippalai Base Hospital Grounds"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newCampDate}
                    onChange={(e) => setNewCampDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newCampDesc}
                    onChange={(e) => setNewCampDesc(e.target.value)}
                    placeholder="Campaign medical requirements and organizers..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#DC0A20] text-white font-semibold rounded-lg hover:bg-[#B80020]"
                >
                  Publish Campaign
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 12: REPORTS & ANALYTICS (CSV EXPORT) */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Reports and Data Export</h2>
              <p className="text-xs text-neutral-500 mt-1">Export database records directly to CSV for administrative filing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900">Donors Registry Report</h3>
                <p className="text-xs text-neutral-500">Full audit list of registered voluntary blood donors, blood groups, and verification status.</p>
                <button
                  onClick={() => exportCSV(donorsOnly, 'lifelink_donors_report')}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Donors CSV</span>
                </button>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900">Blood Requests Report</h3>
                <p className="text-xs text-neutral-500">Historical log of all hospital requests, units required, urgency, and fulfillment dates.</p>
                <button
                  onClick={() => exportCSV(requestsList, 'lifelink_blood_requests_report')}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Requests CSV</span>
                </button>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900">Certified Donations Report</h3>
                <p className="text-xs text-neutral-500">Official hospital certificates issued for completed blood transfusions.</p>
                <button
                  onClick={() => exportCSV(historyList, 'lifelink_donation_certificates_report')}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export History CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: 24/7 AI AGENTS & AUTOMATION HUB */}
        {activeTab === 'automation' && (
          <div className="space-y-8">
            {/* ⭐ FEATURED: ALL-IN-ONE UNIFIED DONOR LIFECYCLE AI AGENT WORKFLOW */}
            <div className="bg-gradient-to-br from-neutral-900 via-[#1a0f12] to-[#2b0007] text-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ஒரே ஒரு ஒருங்கிணைந்த பணிப்பாய்வு • All-in-One Master Workflow</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    File: lifelink_unified_donor_lifecycle_ai_agent.json
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    LifeLink Unified AI Agent: Donor Request, Nearby Hospitals & Acceptance
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed max-w-4xl">
                    தனித்தனி பணிப்பாய்வுகள் இன்றி, <strong>ஒரே ஒரு n8n Workflow-இல்</strong> முழு இரத்ததான சுழற்சியும் தானியங்கி முறையில் இயங்குகிறது:
                  </p>
                </div>

                {/* Dual-Branch Architecture Visualizer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Branch 1 Card */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-xs space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs">1</span>
                      <span>Branch A: Requester &rarr; Donor (கோரிக்கை + அருகிலுள்ள வைத்தியசாலைகள்)</span>
                    </div>
                    <div className="text-xs text-neutral-200 leading-relaxed">
                      Requester இரத்தக் கோரிக்கையை அனுப்பியவுடன், AI முகவர் கொடையாளரின் மாவட்டத்தை ஆராய்ந்து <strong>அருகிலுள்ள இரத்த வங்கிகள் (Nearby Certified Blood Banks)</strong>, தொடர்பு எண்கள் மற்றும் <strong>Google Maps வழிகாட்டலுடன்</strong> கொடையாளரின் மின்னஞ்சலுக்கு அவசர அறிவிப்பை அனுப்புகிறது.
                    </div>
                    <div className="text-[11px] p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 font-mono">
                      Event: <strong className="text-white">DONOR_CONTACT_REQUEST</strong> &bull; Includes: Nearby Hospitals List & Dashboard Action Link
                    </div>
                  </div>

                  {/* Branch 2 Card */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
                      <span>Branch B: Donor Accepts &rarr; Requester (ஏற்றுக்கொள்ளப்பட்டது & கொடையாளர் எண்)</span>
                    </div>
                    <div className="text-xs text-neutral-200 leading-relaxed">
                      கொடையாளர் தனது Donor Portal-இல் 'Accept' செய்தவுடன், உடனடியாக Requester-இன் மின்னஞ்சலுக்கு <strong>கொடையாளரின் சரிபார்க்கப்பட்ட தொலைபேசி எண்</strong>, இரத்ததான வழிகாட்டல்கள் மற்றும் வைத்தியசாலை தகவல்களுடன் கூடிய மகிழ்ச்சிகரமான உறுதிப்படுத்தல் செய்தி செல்கிறது.
                    </div>
                    <div className="text-[11px] p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 font-mono">
                      Event: <strong className="text-white">DONOR_RESPONSE (ACCEPTED)</strong> &bull; Unlocks: Donor Phone, Map Link & Safety Checklist
                    </div>
                  </div>
                </div>

                {/* Workflow Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleCopyUnifiedWorkflow}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    {copiedUnifiedWorkflow ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUnifiedWorkflow ? 'ஒற்றை JSON நகலெடுக்கப்பட்டது! (Copied)' : 'Copy Unified Master Workflow JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadUnifiedWorkflow}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Download lifelink_unified_donor_lifecycle_ai_agent.json</span>
                  </button>
                </div>
              </div>

              {/* Decorative Red Background Glow */}
              <div className="absolute right-[-100px] bottom-[-100px] w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* LIVE UNIFIED WORKFLOW TESTER & EMAIL PREVIEW */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#DC0A20]" />
                  <h3 className="text-base font-bold text-neutral-900">
                    Live Test Unified AI Agent Workflow (நேரடி பணிப்பாய்வு சோதனை)
                  </h3>
                </div>
                <span className="text-[11px] text-neutral-500">Test both branches of the single workflow directly</span>
              </div>

              {/* Scenario Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">Choose Scenario to Test (சோதிக்க வேண்டிய நிலை):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setUnifiedScenario('REQUEST')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      unifiedScenario === 'REQUEST'
                        ? 'border-[#DC0A20] bg-red-50/60 text-neutral-900 font-bold shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#DC0A20]">Scenario 1: Requester Sends Request</span>
                      {unifiedScenario === 'REQUEST' && <CheckCircle2 className="w-4 h-4 text-[#DC0A20]" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 font-normal mt-1">
                      கோரிக்கை அனுப்பும்போது Nearby Hospitals உடன் Donor-க்கு செல்லும் மின்னஞ்சல்
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUnifiedScenario('ACCEPT')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      unifiedScenario === 'ACCEPT'
                        ? 'border-emerald-600 bg-emerald-50/60 text-neutral-900 font-bold shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700">Scenario 2: Donor Accepts Request</span>
                      {unifiedScenario === 'ACCEPT' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 font-normal mt-1">
                      Donor 'Accept' செய்ததும் Donor Contact எண்ணுடன் Requester-க்கு செல்லும் உறுதிப்படுத்தல்
                    </p>
                  </button>
                </div>
              </div>

              {/* Test Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Target District (மாவட்டம்):</label>
                  <select
                    value={unifiedTestDistrict}
                    onChange={(e) => setUnifiedTestDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-800 bg-white"
                  >
                    {['Jaffna', 'Kilinochchi', 'Vavuniya', 'Mannar', 'Mullaitivu', 'Colombo', 'Kandy', 'Galle', 'Batticaloa'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Recipient Test Email (பெறுநர் மின்னஞ்சல்):</label>
                  <input
                    type="email"
                    value={unifiedTestEmail}
                    onChange={(e) => setUnifiedTestEmail(e.target.value)}
                    placeholder={user?.email || 'admin@lifelink.lk'}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-800 bg-white"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">Defaults to your logged-in administrator email</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleRunUnifiedTest}
                  disabled={unifiedTestLoading}
                  className="px-6 py-2.5 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>{unifiedTestLoading ? 'Executing Unified Workflow...' : `Trigger Unified Test (${unifiedScenario === 'REQUEST' ? 'Scenario 1: Request' : 'Scenario 2: Accept'})`}</span>
                </button>
              </div>

              {/* Test Output & Realistic Email Preview */}
              {unifiedTestResult && (
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-4 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                    <span className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Unified Workflow Dispatched (பணிப்பாய்வு இயக்கப்பட்டது)</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      unifiedTestResult.dispatched ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {unifiedTestResult.message || 'Processed'}
                    </span>
                  </div>

                  {/* Email Mock Preview Card */}
                  <div className="bg-white rounded-xl border border-neutral-300 overflow-hidden shadow-xs">
                    <div className="bg-neutral-800 text-white px-4 py-2.5 flex items-center justify-between text-[11px]">
                      <span className="font-mono">To: <strong>{unifiedTestResult.recipientEmail}</strong></span>
                      <span className="text-neutral-400">Subject: {unifiedTestResult.subject}</span>
                    </div>

                    <div className="p-5 space-y-4">
                      {unifiedTestResult.scenario === 'REQUEST' ? (
                        /* Scenario 1 Preview */
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 border-l-4 border-[#DC0A20] rounded-r-lg">
                            <span className="font-bold text-[#DC0A20] text-xs block">🩸 Urgent Blood Donation Request (இரத்த தானக் கோரிக்கை)</span>
                            <p className="text-neutral-700 text-[11px] mt-1">
                              <strong>Sivanesan K.</strong> has requested your blood donation for an urgent patient in <strong>{unifiedTestDistrict}</strong>.
                            </p>
                            <p className="text-neutral-600 italic text-[11px] mt-1 bg-white p-2 rounded border border-red-100">
                              "{unifiedTestResult.payload?.message}"
                            </p>
                          </div>

                          <div>
                            <span className="font-bold text-neutral-800 text-xs block mb-1.5">
                              🏥 Nearby Certified Blood Banks & Hospitals (அருகிலுள்ள இரத்த வங்கிகள்):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              {unifiedTestResult.payload?.nearbyHospitals?.map((h: any) => (
                                <div key={h.id} className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-1">
                                  <strong className="text-neutral-900 block font-semibold">{h.name}</strong>
                                  <div className="text-neutral-500 text-[10px]">{h.type} &bull; {h.district}</div>
                                  <div className="text-neutral-700 font-mono text-[10px]">📞 {h.phone}</div>
                                  <a href={h.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px] block font-semibold">
                                    📍 Open Google Maps Directions
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2">
                            <span className="inline-block px-3 py-1.5 bg-[#DC0A20] text-white rounded-lg font-bold text-[11px]">
                              Action Link Included: Review & Respond in Donor Dashboard
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Scenario 2 Preview */
                        <div className="space-y-3">
                          <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg">
                            <span className="font-bold text-emerald-800 text-xs block">
                              🎉 Great News! Blood Donation Request ACCEPTED! (கோரிக்கை ஏற்கப்பட்டது)
                            </span>
                            <p className="text-neutral-700 text-[11px] mt-1">
                              Donor <strong>{unifiedTestResult.payload?.donor?.fullName}</strong> ({unifiedTestResult.payload?.donor?.bloodGroup}) has accepted your request!
                            </p>
                          </div>

                          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                              Unlocked Donor Contact (கொடையாளரின் நேரடி தொலைபேசி எண்):
                            </span>
                            <div className="text-base font-extrabold text-emerald-700 font-mono">
                              📞 {unifiedTestResult.payload?.donorContact}
                            </div>
                            <span className="text-[11px] text-neutral-600 block">
                              Email: {unifiedTestResult.payload?.donor?.email} &bull; Location: {unifiedTestResult.payload?.donor?.city}, {unifiedTestResult.payload?.donor?.district}
                            </span>
                            <p className="text-[11px] text-neutral-700 italic bg-white p-2 rounded border border-emerald-100 mt-1">
                              "{unifiedTestResult.payload?.responseNote}"
                            </p>
                          </div>

                          <div>
                            <span className="font-bold text-neutral-800 text-xs block mb-1.5">
                              🏥 Recommended Hospital for Donation (தானம் செய்வதற்கான வைத்தியசாலைகள்):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              {unifiedTestResult.payload?.nearbyHospitals?.map((h: any) => (
                                <div key={h.id} className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-1">
                                  <strong className="text-neutral-900 block font-semibold">{h.name}</strong>
                                  <div className="text-neutral-700 font-mono text-[10px]">📞 Hotline: {h.phone}</div>
                                  <a href={h.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px] block font-semibold">
                                    📍 Navigation Directions
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Top Hero Banner */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 border border-neutral-700 shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>24/7 Autonomous Blood Logistics AI</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  LifeLink 24/7 AI Agent & Automation Hub
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                  நவீன <strong>LangChain AI Agent</strong> மற்றும் <strong>Google Gemini 2.0 Flash</strong> மூலம் இயங்கும் புதிய தானியங்கி பணிப்பாய்வு. அவசர இரத்தத் தேவைகளை நொடிப்பொழுதில் பகுப்பாய்வு செய்து, பொருத்தமான இரத்த வகைகளைக் கணக்கிட்டு, அருகிலுள்ள அரச மற்றும் தனியார் வைத்தியசாலைகளுக்கு வழிகாட்டுகிறது.
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-neutral-700/80">
                  <button
                    onClick={handleCopyAiWorkflow}
                    className="px-4 py-2.5 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {copiedAiWorkflow ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAiWorkflow ? 'Workflow JSON Copied!' : 'Copy n8n AI Agent Workflow JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadAiWorkflow}
                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-neutral-300" />
                    <span>Download Workflow File (.json)</span>
                  </button>

                  <button
                    onClick={handleTriggerAutomationWorker}
                    disabled={workerRunning}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span>{workerRunning ? 'Processing Queue...' : 'Trigger Outbox Worker'}</span>
                  </button>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#DC0A20]/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Architecture Visualizer Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#DC0A20]" />
                  <h3 className="text-base font-bold text-neutral-900">How the 24/7 LifeLink AI Agent Pipeline Works</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  Zero Human Latency
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-[#DC0A20] font-bold flex items-center justify-center mb-2.5">
                    1
                  </div>
                  <strong className="text-neutral-900 block font-bold text-xs">24/7 Multi-Triggers</strong>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    Webhook listener, 15-min autonomous health-check cron, or WhatsApp/Telegram live SOS messages.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center mb-2.5">
                    2
                  </div>
                  <strong className="text-neutral-900 block font-bold text-xs">LangChain Agent Core</strong>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    Powered by Google Gemini 2.0 Flash with clinical prompt, 10-turn conversation buffer memory, and medical triage rules.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-2.5">
                    3
                  </div>
                  <strong className="text-neutral-900 block font-bold text-xs">4 Autonomous Tools</strong>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    Compatible donors search, Sri Lanka Govt & Private hospital directory, urgency validator, and alert dispatcher.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-2.5">
                    4
                  </div>
                  <strong className="text-neutral-900 block font-bold text-xs">Multi-Channel Delivery</strong>
                  <p className="text-neutral-600 text-[11px] mt-1 leading-relaxed">
                    Sends trilingual emergency notification (Tamil, Sinhala, English) with 1-click turn-by-turn hospital navigation.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Simulation Widget */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-base font-bold text-neutral-900">
                    Live AI Agent Triage Simulation (தானியங்கி சோதனை கருவி)
                  </h3>
                </div>
                <span className="text-[11px] text-neutral-500">Test autonomous biological matching in browser</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Blood Group Needed</label>
                  <select
                    value={aiSimulationBloodGroup}
                    onChange={(e) => setAiSimulationBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-bold text-neutral-800 bg-white"
                  >
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">District</label>
                  <select
                    value={aiSimulationDistrict}
                    onChange={(e) => setAiSimulationDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-800 bg-white"
                  >
                    {['Jaffna', 'Kilinochchi', 'Vavuniya', 'Mannar', 'Mullaitivu', 'Colombo', 'Kandy', 'Galle', 'Batticaloa'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Clinical Urgency</label>
                  <select
                    value={aiSimulationUrgency}
                    onChange={(e) => setAiSimulationUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-medium text-neutral-800 bg-white"
                  >
                    <option value="CRITICAL">🚨 CRITICAL (Emergency Trauma / Surgery)</option>
                    <option value="HIGH">⚠️ HIGH (Transfusion Needed within 6 Hrs)</option>
                    <option value="ROUTINE">ℹ️ ROUTINE (Scheduled Procedure)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1 text-xs">Emergency Request Description</label>
                <input
                  type="text"
                  value={aiSimulationNote}
                  onChange={(e) => setAiSimulationNote(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-xs text-neutral-800"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRunAiSimulation}
                  disabled={aiSimulationRunning}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>{aiSimulationRunning ? 'AI Agent Analyzing...' : 'Run 24/7 AI Agent Triage Test'}</span>
                </button>
              </div>

              {/* Simulation Result Output */}
              {aiSimulationResult && (
                <div className="mt-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      AI Agent Execution Trace (வெற்றிகரமான பகுப்பாய்வு)
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">{aiSimulationResult.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block text-[11px]">Biological Match Pool</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiSimulationResult.compatibleGroups.map((g: string) => (
                          <span key={g} className="px-1.5 py-0.2 bg-red-50 text-[#DC0A20] font-bold rounded border border-red-200 text-[11px]">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block text-[11px]">Nearest Govt Blood Bank</span>
                      <strong className="text-neutral-900 block font-bold text-xs mt-0.5">
                        🏛️ {aiSimulationResult.primaryGovtHospital.name}
                      </strong>
                      <span className="text-[10px] text-neutral-500 font-mono">{aiSimulationResult.primaryGovtHospital.phone}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block text-[11px]">Nearest Private Hospital</span>
                      <strong className="text-purple-900 block font-bold text-xs mt-0.5">
                        🏢 {aiSimulationResult.primaryPrivateHospital.name}
                      </strong>
                      <span className="text-[10px] text-neutral-500 font-mono">{aiSimulationResult.primaryPrivateHospital.phone}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-red-50/70 rounded-xl border border-red-200 space-y-2">
                    <div className="font-bold text-[#DC0A20] text-xs">
                      தமிழ் அறிக்கை (Tamil AI Decision Summary):
                    </div>
                    <p className="text-neutral-800 leading-relaxed text-[11px]">
                      {aiSimulationResult.triageSummaryTa}
                    </p>
                    <div className="font-bold text-neutral-700 text-[11px] pt-1">
                      English Summary:
                    </div>
                    <p className="text-neutral-600 leading-relaxed text-[11px]">
                      {aiSimulationResult.triageSummaryEn}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Top 5 Recommended AI Agents Guide */}
            <div className="space-y-4">
              <div className="border-b border-neutral-200 pb-2">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#DC0A20]" />
                  <span>Top 5 LifeLink AI Agent Automations (பரிந்துரைக்கப்பட்ட AI ஆட்டோமேஷன்கள்)</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  உயிர்காக்கும் தானியங்கி சேவைகளுக்காக உங்கள் n8n இல் இணைக்கக்கூடிய 5 முக்கிய AI முகவர்கள்:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RECOMMENDED_AI_AGENTS.map((agent) => (
                  <div key={agent.id} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm leading-snug">{agent.titleEn}</h4>
                        <div className="text-xs font-semibold text-[#DC0A20] mt-0.5">{agent.titleTa}</div>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 shrink-0"
                        dangerouslySetInnerHTML={{ __html: agent.badge }}
                      />
                    </div>

                    <div className="text-[11px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-150 space-y-1">
                      <span className="font-bold text-neutral-700 block">Trigger:</span>
                      <span className="text-neutral-600 font-mono">{agent.triggers}</span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {agent.descEn}
                    </p>
                    <p className="text-[11px] text-neutral-700 leading-relaxed bg-amber-50/50 p-2 rounded-lg border border-amber-200/50">
                      <strong>தமிழ் விளக்கம்:</strong> {agent.descTa}
                    </p>

                    <div className="pt-2 border-t border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Key Impact:</span>
                      <ul className="space-y-1 text-[11px] text-neutral-600">
                        {agent.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">&check;</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbox Queue Section */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Notification Outbox Queue ({outbox.length} Events)</h3>
                  <p className="text-xs text-neutral-500">Live events queued for n8n delivery and verified delivery logs</p>
                </div>
                <button
                  onClick={handleTriggerAutomationWorker}
                  disabled={workerRunning}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Dispatch All</span>
                </button>
              </div>

              {outbox.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-4">Outbox is empty.</p>
              ) : (
                <div className="divide-y divide-neutral-100 text-xs">
                  {outbox.slice(0, 10).map((item) => (
                    <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-neutral-900 block">{item.eventType} &rarr; {item.recipientEmail}</span>
                        <span className="text-neutral-500 text-[11px] font-mono">{item.subject}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          item.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'QUEUED' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status} (Retries: {item.retries})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 14: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Audit Logs</h2>
              <p className="text-xs text-neutral-500 mt-1">Immutable chronological records of all administrative and clinical actions.</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Actor Email</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                    <th className="py-3 px-4 font-semibold">Target</th>
                    <th className="py-3 px-4 font-semibold">Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                  {auditLogs.slice(0, 25).map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 px-4 text-neutral-500">{new Date(log.createdAt).toLocaleTimeString()}</td>
                      <td className="py-2.5 px-4 font-medium text-neutral-800">{log.actorEmail}</td>
                      <td className="py-2.5 px-4 font-bold text-[#DC0A20]">{log.action}</td>
                      <td className="py-2.5 px-4 text-neutral-600">{log.targetType}:{log.targetId}</td>
                      <td className="py-2.5 px-4 text-neutral-500 truncate max-w-xs">{log.metadata}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 15: SYSTEM SETTINGS (n8n CONFIGURATION) */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">System & Automation Settings</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Configure backend-to-n8n webhook triggers and SMTP provider credentials.
              </p>
            </div>

            {settingsStatus && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{settingsStatus}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  n8n Webhook URL
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="http://localhost:5678/webhook/lifelink-events"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                />
                <span className="text-[11px] text-neutral-400 mt-0.5 block">
                  Backend worker dispatches JSON payloads to this endpoint. The frontend NEVER calls n8n directly.
                </span>
                {webhookUrl.includes('/webhook-test/') && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Test Webhook URL Detected (/webhook-test/...)</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      ⚠️ n8n-ல் <code>webhook-test</code> கொடுத்தால், நீங்கள் n8n-ல் "Execute" கொடுத்தால் மட்டுமே கேட்கும். <strong>24/7 தானாகவே (Automatic-ஆக) இயங்க</strong> Production URL (<code>/webhook/...</code>) தேவை.
                    </p>
                    <button
                      type="button"
                      onClick={() => setWebhookUrl(webhookUrl.replace('/webhook-test/', '/webhook/'))}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] cursor-pointer"
                    >
                      Convert to Production URL (/webhook/...)
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Webhook Secret Header (X-LifeLink-Secret)
                </label>
                <input
                  type="text"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoToggle"
                  checked={automationEnabled}
                  onChange={(e) => setAutomationEnabled(e.target.checked)}
                  className="rounded border-neutral-300 text-[#DC0A20] focus:ring-[#DC0A20]"
                />
                <label htmlFor="autoToggle" className="font-semibold text-neutral-800 cursor-pointer">
                  Enable Backend-to-n8n Outbox Worker
                </label>
              </div>

              {(webhookUrl.includes('localhost') || webhookUrl.includes('127.0.0.1')) && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Localhost Detected (ஏன் "fetch failed" வந்தது?)</span>
                  </div>
                  <p>
                    LifeLink backend கிளவுடில் (Cloud Run) இயங்குகிறது; ஆனால் <code>localhost:5678</code> உங்கள் தனிப்பட்ட கணினியில் (Local PC) உள்ளது. கிளவுட் சர்வரால் உங்கள் கணினியின் பிரைவேட் localhost-ஐ நேரடியாக அணுக முடியாது.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-amber-200 font-mono text-[11px] text-neutral-800 space-y-1">
                    <span className="font-bold block text-neutral-900">கிளவுடிற்கு இணைக்க உங்கள் Terminal-ல் n8n tunnel இயக்கவும்:</span>
                    <span className="text-[#DC0A20] font-bold block">n8n start --tunnel</span>
                    <span className="text-neutral-500 block">(அப்போது n8n வழங்கும் public URL-ஐ இங்கே Paste செய்யவும்)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-semibold">
                    ⚡ <strong>உடனடி சோதனைக்கு:</strong> கீழே உள்ள <strong>"Send Test Directly from Browser"</strong> பொத்தானை அழுத்தவும்! உங்கள் பிரவுசர் உங்கள் கணினியிலேயே இயங்குவதால், அது நேரடியாக உங்கள் n8n-ஐ தூண்டும்!
                  </p>
                </div>
              )}

              {testWebhookResult && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                  testWebhookResult.includes('successfully') || testWebhookResult.includes('delivered!') || testWebhookResult.includes('200')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <span>{testWebhookResult}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Save System Settings
                </button>

                {/* Direct browser test: Works directly with localhost on user's machine */}
                <button
                  type="button"
                  onClick={handleBrowserDirectTest}
                  disabled={testingBrowserDirect || !webhookUrl}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{testingBrowserDirect ? 'Sending from Browser...' : 'Send Test Directly from Browser (Localhost)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={testingWebhook || !webhookUrl}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>{testingWebhook ? 'Sending from Server...' : 'Send Test from Server (Public URL)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerEditorTest}
                  disabled={testingBrowserDirect || !webhookUrl}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Send to n8n Editor (Stop Canvas Spinner)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 16: SUPABASE CLOUD DATABASE INTEGRATION */}
        {activeTab === 'database' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#DC0A20]" />
                    <h2 className="text-xl font-bold text-neutral-900">Supabase (PostgreSQL) Cloud Database</h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Real persistent cloud storage for users, blood requests, donors, campaigns, appointments, and contact requests.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto border">
                  {dbStatus?.isSupabaseConfigured ? (
                    <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Supabase Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border-amber-200 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      In-Memory Mode (Supabase Ready)
                    </span>
                  )}
                </div>
              </div>

              {/* Notice for KEY_IS_URL or INVALID_KEY_FORMAT */}
              {(dbStatus?.status === 'KEY_IS_URL' || dbStatus?.status === 'INVALID_KEY_FORMAT') && (
                <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Supabase Key Configuration Notice / சுபாபேஸ் கீ அமைத்தல் தகவல்</span>
                  </div>
                  <p className="leading-relaxed">
                    <strong>English:</strong> {dbStatus?.message}
                  </p>
                  <p className="leading-relaxed text-amber-800">
                    <strong>தமிழ்:</strong> {dbStatus?.tamilMessage}
                  </p>
                </div>
              )}

              {/* Status Details */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500 block mb-1">Database Engine</span>
                  <span className="font-bold text-neutral-800 text-sm">{dbStatus?.provider || 'Supabase (PostgreSQL)'}</span>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500 block mb-1">Configured Project Endpoint</span>
                  <span className="font-mono text-neutral-800 text-xs truncate block">
                    {dbStatus?.supabaseUrl || 'Pending configuration in .env'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500 block mb-1">Auto-Bootstrap Seed Status</span>
                  <span className="font-bold text-emerald-600 text-sm">Active & Resilient</span>
                </div>
              </div>

              {/* Counts in Database */}
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Synchronized Records</h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-lg font-black text-[#DC0A20]">{dbStatus?.stats?.users ?? usersList.length}</span>
                    <span className="block text-[11px] text-neutral-600 font-medium">Users</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-lg font-black text-[#DC0A20]">{dbStatus?.stats?.donors ?? donorsOnly.length}</span>
                    <span className="block text-[11px] text-neutral-600 font-medium">Donors</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-lg font-black text-[#DC0A20]">{dbStatus?.stats?.bloodRequests ?? requestsList.length}</span>
                    <span className="block text-[11px] text-neutral-600 font-medium">Requests</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-lg font-black text-[#DC0A20]">{dbStatus?.stats?.appointments ?? appointmentsList.length}</span>
                    <span className="block text-[11px] text-neutral-600 font-medium">Appointments</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-lg font-black text-[#DC0A20]">{dbStatus?.stats?.campaigns ?? campaignsList.length}</span>
                    <span className="block text-[11px] text-neutral-600 font-medium">Campaigns</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-lg font-black text-[#DC0A20]">{dbStatus?.stats?.contactRequests ?? 0}</span>
                    <span className="block text-[11px] text-neutral-600 font-medium">Contacts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Cloud SQL PostgreSQL Tables Inspector */}
            {cloudSqlData?.connected && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-bold text-neutral-900">
                        Live Cloud SQL PostgreSQL Tables (நேரடி டேட்டாபேஸ் அட்டவணைகள்)
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Instance: <span className="font-mono text-neutral-700 font-semibold">ai-studio-3ba393a6</span> (asia-southeast1). Every registered user & profile is permanently saved here.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={loadAllAdminData}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Refresh Live Rows</span>
                  </button>
                </div>

                {/* Table Tab Selector */}
                <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCloudSqlTableTab('users')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      cloudSqlTableTab === 'users'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    users ({cloudSqlData.counts?.users ?? 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCloudSqlTableTab('donorProfiles')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      cloudSqlTableTab === 'donorProfiles'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    donor_profiles ({cloudSqlData.counts?.donors ?? 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCloudSqlTableTab('bloodRequests')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      cloudSqlTableTab === 'bloodRequests'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    blood_requests ({cloudSqlData.counts?.bloodRequests ?? 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCloudSqlTableTab('campaigns')}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      cloudSqlTableTab === 'campaigns'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    campaigns ({cloudSqlData.counts?.campaigns ?? 0})
                  </button>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto rounded-xl border border-neutral-200 text-xs">
                  {cloudSqlTableTab === 'users' && (
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-2.5 px-3">ID</th>
                          <th className="py-2.5 px-3">Email</th>
                          <th className="py-2.5 px-3">Full Name</th>
                          <th className="py-2.5 px-3">Role</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                        {cloudSqlData.tables?.users?.map((u: any) => (
                          <tr key={u.id} className="hover:bg-neutral-50/60 font-sans">
                            <td className="py-2 px-3 font-mono text-neutral-500">{u.id}</td>
                            <td className="py-2 px-3 font-semibold text-neutral-900">{u.email}</td>
                            <td className="py-2 px-3 text-neutral-800">{u.fullName}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                u.role === 'DONOR' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                              }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-neutral-400 text-[10px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {cloudSqlTableTab === 'donorProfiles' && (
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-2.5 px-3">User ID</th>
                          <th className="py-2.5 px-3">Blood Group</th>
                          <th className="py-2.5 px-3">District</th>
                          <th className="py-2.5 px-3">City</th>
                          <th className="py-2.5 px-3">Available</th>
                          <th className="py-2.5 px-3">Last Donated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-[11px]">
                        {cloudSqlData.tables?.donorProfiles?.map((d: any) => (
                          <tr key={d.id} className="hover:bg-neutral-50/60">
                            <td className="py-2 px-3 font-mono text-neutral-500">{d.userId}</td>
                            <td className="py-2 px-3 font-black text-[#DC0A20] font-mono text-xs">{d.bloodGroup}</td>
                            <td className="py-2 px-3 font-medium text-neutral-800">{d.district}</td>
                            <td className="py-2 px-3 text-neutral-600">{d.city}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                d.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                              }`}>
                                {d.isAvailable ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-neutral-400">{d.lastDonationDate || 'First time donor'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {cloudSqlTableTab === 'bloodRequests' && (
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-2.5 px-3">ID</th>
                          <th className="py-2.5 px-3">Hospital</th>
                          <th className="py-2.5 px-3">Blood Group</th>
                          <th className="py-2.5 px-3">Units</th>
                          <th className="py-2.5 px-3">Urgency</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-[11px]">
                        {cloudSqlData.tables?.bloodRequests?.map((r: any) => (
                          <tr key={r.id} className="hover:bg-neutral-50/60">
                            <td className="py-2 px-3 font-mono text-neutral-500">{r.id}</td>
                            <td className="py-2 px-3 font-bold text-neutral-800">{r.hospital} ({r.district})</td>
                            <td className="py-2 px-3 font-mono font-bold text-[#DC0A20]">{r.bloodGroup}</td>
                            <td className="py-2 px-3 font-semibold">{r.unitsRequired}</td>
                            <td className="py-2 px-3 font-semibold text-amber-700">{r.urgency}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {cloudSqlTableTab === 'campaigns' && (
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-2.5 px-3">Title</th>
                          <th className="py-2.5 px-3">Organizer</th>
                          <th className="py-2.5 px-3">District</th>
                          <th className="py-2.5 px-3">Target Units</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-[11px]">
                        {cloudSqlData.tables?.campaigns?.map((c: any) => (
                          <tr key={c.id} className="hover:bg-neutral-50/60">
                            <td className="py-2 px-3 font-bold text-neutral-800">{c.title}</td>
                            <td className="py-2 px-3 text-neutral-600">{c.organizer}</td>
                            <td className="py-2 px-3 font-medium text-neutral-700">{c.district}</td>
                            <td className="py-2 px-3 font-mono font-bold">{c.targetUnits}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Direct Supabase Connection & Configuration Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#DC0A20]" />
                  <h3 className="text-base font-bold text-neutral-900">
                    Connect New Supabase Cloud Project (புதிய Supabase திட்டத்தை இணைக்கவும்)
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Enter your Supabase Project URL and API Key below to instantly connect and persist all LifeLink users, blood requests, donors, and appointments in PostgreSQL cloud storage.
                </p>
              </div>

              {supabaseConfigNotice && (
                <div className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                  supabaseConfigNotice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                  supabaseConfigNotice.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-red-50 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    {supabaseConfigNotice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span>{supabaseConfigNotice.message}</span>
                  </div>
                  {supabaseConfigNotice.tamil && (
                    <p className="text-[11px] opacity-90 pl-6">
                      <strong>தமிழ்:</strong> {supabaseConfigNotice.tamil}
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseInputUrl}
                    onChange={(e) => setSupabaseInputUrl(e.target.value)}
                    placeholder="https://xyzabcdefghijklmn.supabase.co"
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Find this in your Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Supabase API Key (anon public key or service_role key)
                  </label>
                  <input
                    type="password"
                    value={supabaseInputKey}
                    onChange={(e) => setSupabaseInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Find this in Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project API keys (JWT token starting with "eyJ...")
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={savingSupabaseConfig || !supabaseInputUrl}
                    className="px-6 py-2.5 bg-[#DC0A20] hover:bg-[#B80020] disabled:opacity-50 text-white rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {savingSupabaseConfig ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting & Syncing...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Save & Connect Supabase</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTestSupabaseConn}
                    disabled={testingSupabaseConn || !supabaseInputUrl}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {testingSupabaseConn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Testing Connection...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Test Supabase Connection</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Tamil & English Setup Guide */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="text-base font-bold text-neutral-900">
                Supabase இணைக்கும் வழிகாட்டி (How to connect to your real Supabase account)
              </h3>
              
              <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-150">
                  <span className="w-5 h-5 rounded-full bg-[#DC0A20] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-neutral-900">புதிய Supabase Project உருவாக்கவும்:</strong>
                    <p className="mt-0.5">
                      <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#DC0A20] underline font-semibold">https://supabase.com</a> இல் Sign In செய்து புதிய Project ஒன்றை உருவாக்கவும் (Region: Singapore அல்லது Southeast Asia பரிந்துரைக்கப்படுகிறது).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-150">
                  <span className="w-5 h-5 rounded-full bg-[#DC0A20] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-neutral-900">SQL Schema-வை Run செய்யவும்:</strong>
                    <p className="mt-0.5">
                      Supabase Dashboard-ல் உள்ள <strong>SQL Editor</strong>-க்கு சென்று கீழே உள்ள Schema-வை Paste செய்து <strong>Run</strong> செய்யவும். இது 10 முக்கிய டேபிள்களையும் (users, blood_requests, appointments, etc.) உடனடியாக உருவாக்கும்.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-150">
                  <span className="w-5 h-5 rounded-full bg-[#DC0A20] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-neutral-900">Project API Keys-ஐ சேர்க்கவும்:</strong>
                    <p className="mt-0.5">
                      Project Settings &gt; API சென்று <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-900">Project URL</code> மற்றும் <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-900">anon key / service role key</code> ஆகியவற்றை <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-900">.env</code> கோப்பில் <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-900">SUPABASE_URL</code> மற்றும் <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-900">SUPABASE_KEY</code> என சேமிக்கவும்.
                    </p>
                  </div>
                </div>
              </div>

              {/* Schema SQL Box with Copy Button */}
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-800">
                    Supabase Schema SQL Script (supabase_schema.sql)
                  </span>
                  <button
                    onClick={() => {
                      const schemaSql = `-- LifeLink Sri Lanka Supabase Schema
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'DONOR', 'REQUESTER')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.donor_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blood_group TEXT NOT NULL,
  dob TEXT,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL,
  last_donation_date TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  contact_preferences TEXT DEFAULT 'CALL_AND_SMS',
  consent_given BOOLEAN NOT NULL DEFAULT true,
  verified_at TEXT,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.blood_requests (
  id TEXT PRIMARY KEY,
  patient_reference TEXT,
  requester_id TEXT,
  requester_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  units_required INTEGER NOT NULL DEFAULT 1,
  hospital TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL,
  required_date TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'URGENT',
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  verified_at TEXT,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.donor_contact_requests (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_phone TEXT NOT NULL,
  donor_id TEXT NOT NULL,
  blood_request_id TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  response_note TEXT,
  responded_at TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.donation_appointments (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  donor_id TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'REQUESTED',
  reschedule_notes TEXT,
  completed_at TEXT,
  completed_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  province TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  target_units INTEGER NOT NULL DEFAULT 100,
  collected_units INTEGER NOT NULL DEFAULT 0,
  banner_url TEXT,
  organizer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UPCOMING',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.campaign_registrations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  email TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);`;
                      navigator.clipboard.writeText(schemaSql);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 3000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL Script</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-neutral-900 text-emerald-400 p-4 rounded-xl text-xs font-mono max-h-48 overflow-y-auto leading-relaxed border border-neutral-800">
                  <pre>
{`-- Execute in Supabase SQL Editor:
-- File is saved in your project root as: supabase_schema.sql
-- Covers: users, donor_profiles, blood_requests, appointments, campaigns, etc.`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
