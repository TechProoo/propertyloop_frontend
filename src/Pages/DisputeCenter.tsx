import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Flag,
  User,
  Store,
  Home,
  Plus,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import vendorJobsService from "../api/services/vendorJobs";
import api from "../api/client";
import type { VendorJob } from "../api/types";

const ease = [0.23, 1, 0.32, 1] as const;

type Tab = "active" | "resolved" | "reports" | "file";

interface Report {
  id: string;
  targetType: "AGENT" | "VENDOR" | "LISTING";
  targetId: string;
  reason: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  adminNote?: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  DISPUTED:  { color: "text-amber-600",  bg: "bg-amber-50 border-amber-100",   label: "Under Review" },
  REFUNDED:  { color: "text-blue-600",   bg: "bg-blue-50 border-blue-100",     label: "Refunded"     },
  RELEASED:  { color: "text-green-600",  bg: "bg-green-50 border-green-100",   label: "Released"     },
  NONE:      { color: "text-gray-500",   bg: "bg-gray-50 border-gray-100",     label: "No Escrow"    },
  LOCKED:    { color: "text-primary",    bg: "bg-primary/5 border-primary/10", label: "In Escrow"    },
};

const reportStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
  PENDING:   { color: "text-amber-600",  bg: "bg-amber-50 border-amber-200",   label: "Pending Review" },
  REVIEWED:  { color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",     label: "Being Reviewed" },
  RESOLVED:  { color: "text-green-600",  bg: "bg-green-50 border-green-200",   label: "Resolved"       },
  DISMISSED: { color: "text-gray-500",   bg: "bg-gray-50 border-gray-200",     label: "Dismissed"      },
};

const targetTypeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  AGENT:   { icon: <User size={13} />,   label: "Agent Report",   color: "bg-purple-100 text-purple-700 border-purple-200" },
  VENDOR:  { icon: <Store size={13} />,  label: "Vendor Report",  color: "bg-orange-100 text-orange-700 border-orange-200"  },
  LISTING: { icon: <Home size={13} />,   label: "Listing Report", color: "bg-blue-100 text-blue-700 border-blue-200"        },
};

const DisputeCenter = () => {
  const [tab, setTab] = useState<Tab>("active");
  const [jobs, setJobs] = useState<VendorJob[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // File escrow dispute
  const [disputeJobId, setDisputeJobId] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeCategory, setDisputeCategory] = useState("");
  const [filing, setFiling] = useState(false);
  const [filed, setFiled] = useState(false);

  // Submit new report
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportTargetType, setReportTargetType] = useState<"AGENT" | "VENDOR" | "LISTING">("AGENT");
  const [reportTargetId, setReportTargetId] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    Promise.all([
      vendorJobsService.listMine({ limit: 100 }),
      api.get<Report[]>("/reports/mine").catch(() => ({ data: [] as Report[] })),
    ])
      .then(([jobsRes, reportsRes]) => {
        setJobs(jobsRes.items);
        setReports(reportsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const disputedJobs = jobs.filter((j) => j.escrowStatus === "DISPUTED");
  const resolvedJobs  = jobs.filter((j) => j.escrowStatus === "REFUNDED" || j.escrowStatus === "RELEASED");
  const eligibleJobs  = jobs.filter((j) => j.escrowStatus === "LOCKED" && j.status !== "PENDING" && j.status !== "COMPLETED");

  const handleFileDispute = async () => {
    if (!disputeJobId || !disputeReason.trim()) return;
    setFiling(true);
    try {
      await vendorJobsService.dispute(disputeJobId, { disputeReason: disputeReason.trim() });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === disputeJobId
            ? { ...j, escrowStatus: "DISPUTED" as const, disputeReason: disputeReason.trim() }
            : j,
        ),
      );
      setFiled(true);
      setTimeout(() => { setTab("active"); setFiled(false); setDisputeJobId(""); setDisputeReason(""); setDisputeCategory(""); }, 2500);
    } catch { /* ignore */ }
    setFiling(false);
  };

  const handleSubmitReport = async () => {
    if (!reportTargetId.trim() || !reportReason.trim()) return;
    setSubmittingReport(true);
    setReportError("");
    try {
      const { data } = await api.post<Report>("/reports", {
        targetType: reportTargetType,
        targetId: reportTargetId.trim(),
        reason: reportReason.trim(),
      });
      setReports((prev) => [data, ...prev]);
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReportForm(false);
        setReportSubmitted(false);
        setReportTargetId("");
        setReportReason("");
      }, 2500);
    } catch {
      setReportError("Could not submit report. Please try again.");
    } finally {
      setSubmittingReport(false);
    }
  };

  const activeList = tab === "active" ? disputedJobs : tab === "resolved" ? resolvedJobs : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-4 sm:px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Dispute Center</span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-primary-dark text-2xl sm:text-3xl tracking-tight">
                  Dispute Center
                </h1>
                <p className="text-text-secondary text-sm mt-1 max-w-lg">
                  Manage escrow disputes and reports against agents, vendors, or listings. All cases are reviewed within 48 hours.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { label: "Active Disputes", value: disputedJobs.length, icon: <AlertTriangle className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Resolved",        value: resolvedJobs.length, icon: <CheckCircle  className="w-4 h-4" />, color: "text-green-600",  bg: "bg-green-50"  },
                { label: "In Escrow",       value: eligibleJobs.length, icon: <Shield       className="w-4 h-4" />, color: "text-primary",    bg: "bg-primary/10"},
                { label: "Reports Filed",   value: reports.length,      icon: <Flag         className="w-4 h-4" />, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((s) => (
                <div key={s.label} className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 text-center">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mx-auto mb-2`}>{s.icon}</div>
                  <p className="font-heading font-bold text-primary-dark text-xl">{s.value}</p>
                  <p className="text-text-secondary text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {[
              { key: "active"   as const, label: "Active Disputes", count: disputedJobs.length },
              { key: "resolved" as const, label: "Resolved",         count: resolvedJobs.length },
              { key: "reports"  as const, label: "Reports",          count: reports.length       },
              { key: "file"     as const, label: "File New",          count: null                },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`h-10 px-5 rounded-full text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-primary text-white shadow-lg shadow-glow/30"
                    : "bg-white/60 backdrop-blur-sm border border-white/40 text-text-secondary hover:bg-white/80"
                }`}
              >
                {t.label}{t.count !== null ? ` (${t.count})` : ""}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease }}
              className="mb-20"
            >

              {/* ── Active / Resolved escrow disputes ───────────── */}
              {(tab === "active" || tab === "resolved") && (
                <div className="flex flex-col gap-4">
                  {activeList.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-16 text-center">
                      <div className="w-14 h-14 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                        {tab === "active" ? <Shield className="w-7 h-7 text-text-subtle" /> : <CheckCircle className="w-7 h-7 text-text-subtle" />}
                      </div>
                      <h3 className="font-heading font-bold text-primary-dark text-lg">
                        {tab === "active" ? "No active disputes" : "No resolved disputes yet"}
                      </h3>
                      <p className="text-text-secondary text-sm mt-1 max-w-sm mx-auto">
                        {tab === "active" ? "Great news — you have no ongoing disputes." : "Resolved disputes will appear here for your records."}
                      </p>
                    </div>
                  ) : (
                    activeList.map((job) => {
                      const config = statusConfig[job.escrowStatus] ?? statusConfig.NONE;
                      const isExpanded = expandedId === job.id;
                      return (
                        <div key={job.id} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : job.id)}
                            className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-white/30 transition-colors"
                          >
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-heading font-bold text-primary-dark text-sm">{job.title}</p>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${config.bg} ${config.color}`}>
                                  {config.label}
                                </span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                  Escrow Dispute
                                </span>
                              </div>
                              <p className="text-text-secondary text-xs mt-0.5">
                                {job.vendor?.name ?? "Vendor"} · ₦{(job.escrowAmount ?? 0).toLocaleString()} in escrow
                              </p>
                            </div>
                            <span className="text-text-subtle text-xs shrink-0 hidden sm:block">
                              {job.disputedAt ? new Date(job.disputedAt).toLocaleDateString() : ""}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-text-subtle" /> : <ChevronDown className="w-4 h-4 text-text-subtle" />}
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease }} className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 pt-0 border-t border-white/30">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-white/50 rounded-2xl border border-border-light p-4">
                                      <p className="text-xs font-heading font-semibold text-primary-dark mb-2">Dispute Details</p>
                                      <div className="flex flex-col gap-2 text-xs">
                                        {[
                                          ["Filed", job.disputedAt ? new Date(job.disputedAt).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" }) : "—"],
                                          ["Job Amount", `₦${(job.vendorFee ?? 0).toLocaleString()}`],
                                          ["Escrow Held", `₦${(job.escrowAmount ?? 0).toLocaleString()}`],
                                          ["Status", config.label],
                                        ].map(([k, v]) => (
                                          <div key={k} className="flex justify-between">
                                            <span className="text-text-secondary">{k}</span>
                                            <span className={`font-medium ${k === "Status" ? config.color : "text-primary-dark"}`}>{v}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-2xl border border-border-light p-4">
                                      <p className="text-xs font-heading font-semibold text-primary-dark mb-2">Reason</p>
                                      <p className="text-text-secondary text-xs leading-relaxed">{job.disputeReason ?? "No reason provided."}</p>
                                      <div className="h-px bg-border-light my-3" />
                                      <p className="text-xs font-heading font-semibold text-primary-dark mb-2">Resolution</p>
                                      <p className="text-text-secondary text-xs leading-relaxed">
                                        {job.escrowStatus === "REFUNDED"
                                          ? "Escrow amount has been refunded to your account."
                                          : job.escrowStatus === "RELEASED"
                                            ? "Escrow amount has been released to the vendor."
                                            : "Our team is reviewing this dispute. You'll be notified when a decision is made."}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-4 bg-white/50 rounded-2xl border border-border-light p-4">
                                    <p className="text-xs font-heading font-semibold text-primary-dark mb-3">Timeline</p>
                                    <div className="flex flex-col gap-3 relative pl-6">
                                      <div className="absolute left-2 top-1 bottom-1 w-px bg-border-light" />
                                      {[
                                        { icon: <FileText className="w-3 h-3" />, text: "Job created", date: new Date(job.createdAt).toLocaleDateString() },
                                        ...(job.disputedAt ? [{ icon: <AlertTriangle className="w-3 h-3" />, text: "Dispute filed", date: new Date(job.disputedAt).toLocaleDateString() }] : []),
                                        ...(job.escrowStatus === "REFUNDED" ? [{ icon: <RefreshCw className="w-3 h-3" />, text: "Escrow refunded", date: "Resolved" }] : []),
                                        ...(job.escrowStatus === "RELEASED" ? [{ icon: <CheckCircle className="w-3 h-3" />, text: "Escrow released to vendor", date: "Resolved" }] : []),
                                      ].map((evt, i) => (
                                        <div key={i} className="flex items-center gap-3 relative">
                                          <div className="absolute -left-6 w-4 h-4 rounded-full bg-white border border-border-light flex items-center justify-center text-primary">{evt.icon}</div>
                                          <p className="text-text-secondary text-xs">{evt.text}</p>
                                          <span className="text-text-subtle text-[11px] ml-auto">{evt.date}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ── Reports tab ──────────────────────────────────── */}
              {tab === "reports" && (
                <div className="flex flex-col gap-4">
                  {/* Submit new report button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => { setShowReportForm((v) => !v); setReportSubmitted(false); setReportError(""); }}
                      className="flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-white text-sm font-medium shadow-lg shadow-glow/30 hover:bg-primary-dark transition-colors"
                    >
                      <Plus size={15} /> Report an Agent / Vendor / Listing
                    </button>
                  </div>

                  {/* New report form */}
                  <AnimatePresence>
                    {showReportForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease }} className="overflow-hidden"
                      >
                        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                          {reportSubmitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-glow/40">
                                <CheckCircle className="w-7 h-7 text-white" />
                              </div>
                              <h3 className="font-heading font-bold text-primary-dark text-lg">Report Submitted</h3>
                              <p className="text-text-secondary text-sm mt-1 max-w-sm mx-auto">
                                Our team will review your report within 24–48 hours.
                              </p>
                            </motion.div>
                          ) : (
                            <>
                              <h2 className="font-heading font-bold text-primary-dark text-base mb-4">Submit a Report</h2>
                              <div className="flex flex-col gap-4">
                                {/* Target type */}
                                <div>
                                  <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Who are you reporting?</label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {(["AGENT", "VENDOR", "LISTING"] as const).map((t) => {
                                      const cfg = targetTypeConfig[t];
                                      return (
                                        <button
                                          key={t}
                                          onClick={() => setReportTargetType(t)}
                                          className={`h-10 rounded-2xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                                            reportTargetType === t
                                              ? "bg-primary text-white border-primary shadow-lg shadow-glow/30"
                                              : "bg-white/60 border-border-light text-primary-dark hover:border-primary/40"
                                          }`}
                                        >
                                          {cfg.icon} {cfg.label.replace(" Report", "")}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Target ID */}
                                <div>
                                  <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                                    {reportTargetType === "AGENT" ? "Agent name or profile URL" : reportTargetType === "VENDOR" ? "Vendor name or profile URL" : "Property title or URL"}
                                  </label>
                                  <input
                                    value={reportTargetId}
                                    onChange={(e) => setReportTargetId(e.target.value)}
                                    placeholder={`Enter ${reportTargetType.toLowerCase()} ID or name…`}
                                    className="w-full h-10 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                                  />
                                </div>

                                {/* Reason */}
                                <div>
                                  <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Describe the issue</label>
                                  <textarea
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    placeholder="Explain what happened in detail. Include dates, what was agreed, and what went wrong…"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                                  />
                                </div>

                                {reportError && (
                                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{reportError}</p>
                                )}

                                <button
                                  onClick={handleSubmitReport}
                                  disabled={submittingReport || !reportTargetId.trim() || !reportReason.trim()}
                                  className="h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg shadow-glow/30"
                                >
                                  {submittingReport ? <><Clock className="w-4 h-4 animate-spin" /> Submitting…</> : <><Flag className="w-4 h-4" /> Submit Report</>}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reports list */}
                  {reports.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-16 text-center">
                      <div className="w-14 h-14 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                        <Flag className="w-7 h-7 text-text-subtle" />
                      </div>
                      <h3 className="font-heading font-bold text-primary-dark text-lg">No reports yet</h3>
                      <p className="text-text-secondary text-sm mt-1 max-w-sm mx-auto">
                        Reports you submit against agents, vendors, or listings will appear here.
                      </p>
                    </div>
                  ) : (
                    reports.map((r) => {
                      const tCfg  = targetTypeConfig[r.targetType] ?? targetTypeConfig.AGENT;
                      const sCfg  = reportStatusConfig[r.status]    ?? reportStatusConfig.PENDING;
                      const isExp = expandedId === r.id;
                      return (
                        <div key={r.id} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                          <button
                            onClick={() => setExpandedId(isExp ? null : r.id)}
                            className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-white/30 transition-colors"
                          >
                            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                              <Flag className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${tCfg.color}`}>
                                  {tCfg.icon} {tCfg.label}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${sCfg.bg} ${sCfg.color}`}>
                                  {sCfg.label}
                                </span>
                              </div>
                              <p className="text-text-secondary text-xs mt-1 line-clamp-1">{r.reason}</p>
                            </div>
                            <span className="text-text-subtle text-xs shrink-0 hidden sm:block">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                            {isExp ? <ChevronUp className="w-4 h-4 text-text-subtle" /> : <ChevronDown className="w-4 h-4 text-text-subtle" />}
                          </button>

                          <AnimatePresence>
                            {isExp && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease }} className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 pt-0 border-t border-white/30">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-white/50 rounded-2xl border border-border-light p-4">
                                      <p className="text-xs font-heading font-semibold text-primary-dark mb-2">Report Details</p>
                                      <div className="flex flex-col gap-2 text-xs">
                                        {[
                                          ["Type",       tCfg.label],
                                          ["Target ID",  r.targetId],
                                          ["Filed",      new Date(r.createdAt).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })],
                                          ["Status",     sCfg.label],
                                        ].map(([k, v]) => (
                                          <div key={k} className="flex justify-between gap-2">
                                            <span className="text-text-secondary shrink-0">{k}</span>
                                            <span className={`font-medium text-right truncate ${k === "Status" ? sCfg.color : "text-primary-dark"}`}>{v}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="bg-white/50 rounded-2xl border border-border-light p-4">
                                      <p className="text-xs font-heading font-semibold text-primary-dark mb-2">Reason</p>
                                      <p className="text-text-secondary text-xs leading-relaxed">{r.reason}</p>
                                      {r.adminNote && (
                                        <>
                                          <div className="h-px bg-border-light my-3" />
                                          <p className="text-xs font-heading font-semibold text-primary-dark mb-1">Admin Note</p>
                                          <p className="text-text-secondary text-xs leading-relaxed">{r.adminNote}</p>
                                        </>
                                      )}
                                      {!r.adminNote && r.status === "PENDING" && (
                                        <>
                                          <div className="h-px bg-border-light my-3" />
                                          <p className="text-text-secondary text-xs">Our team will review and respond within 24–48 hours.</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ── File new escrow dispute ──────────────────────── */}
              {tab === "file" && (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                  {filed ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-glow/40">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-primary-dark text-xl">Dispute Filed</h3>
                      <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                        Your dispute has been submitted. Our team will review it and respond within 48 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-1">File an Escrow Dispute</h2>
                      <p className="text-text-secondary text-sm mb-6">Select the job and describe the issue with the vendor's work.</p>

                      <div className="flex flex-col gap-5">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Select Job</label>
                          {eligibleJobs.length === 0 ? (
                            <div className="bg-bg-accent rounded-2xl border border-border-light p-5 text-center">
                              <p className="text-text-secondary text-sm">No jobs eligible for dispute right now.</p>
                              <p className="text-text-subtle text-xs mt-1">Only active jobs with locked escrow can be disputed.</p>
                            </div>
                          ) : (
                            <select
                              value={disputeJobId}
                              onChange={(e) => setDisputeJobId(e.target.value)}
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                              <option value="">Choose a job…</option>
                              {eligibleJobs.map((j) => (
                                <option key={j.id} value={j.id}>{j.title} — {j.vendor?.name ?? "Vendor"} — ₦{(j.vendorFee ?? 0).toLocaleString()}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Category</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { value: "incomplete", label: "Incomplete Work" },
                              { value: "quality",    label: "Poor Quality"    },
                              { value: "noshow",     label: "No-Show"         },
                              { value: "other",      label: "Other Issue"     },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setDisputeCategory(opt.value)}
                                className={`h-10 rounded-2xl border text-xs font-medium transition-all ${
                                  disputeCategory === opt.value
                                    ? "bg-primary text-white border-primary shadow-lg shadow-glow/30"
                                    : "bg-white/60 border-border-light text-primary-dark hover:border-primary/40"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Describe the Issue</label>
                          <textarea
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            placeholder="Explain what went wrong in detail. Include dates, what was agreed, and what actually happened…"
                            rows={5}
                            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>

                        <div className="bg-bg-accent rounded-2xl border border-border-light p-4 flex items-start gap-3">
                          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-xs">Escrow Protection</p>
                            <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
                              When you file a dispute, the escrow funds are frozen until our team resolves it. You'll be contacted within 48 hours.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleFileDispute}
                          disabled={filing || !disputeJobId || !disputeReason.trim()}
                          className="h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg shadow-glow/30"
                        >
                          {filing ? <><Clock className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> File Dispute</>}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DisputeCenter;
