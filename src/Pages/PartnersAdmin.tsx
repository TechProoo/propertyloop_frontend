import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Handshake,
  Plus,
  Trash2,
  Globe,
  X,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  sortOrder: number;
  active: boolean;
}

/* Seed data — persisted in localStorage, ready for backend swap */
const STORAGE_KEY = "pl_partners";

const defaultPartners: Partner[] = [
  {
    id: "1",
    name: "Access Bank",
    logoUrl:
      "https://ui-avatars.com/api/?name=Access+Bank&background=0D8050&color=fff&size=128",
    website: "https://accessbankplc.com",
    sortOrder: 0,
    active: true,
  },
  {
    id: "2",
    name: "Lagos State Government",
    logoUrl:
      "https://ui-avatars.com/api/?name=Lagos+State&background=1F6F43&color=fff&size=128",
    website: "https://lagosstate.gov.ng",
    sortOrder: 1,
    active: true,
  },
  {
    id: "3",
    name: "GTBank Mortgage",
    logoUrl:
      "https://ui-avatars.com/api/?name=GT+Mortgage&background=E67E22&color=fff&size=128",
    website: "https://gtbank.com",
    sortOrder: 2,
    active: true,
  },
  {
    id: "4",
    name: "Julius Berger Nigeria",
    logoUrl:
      "https://ui-avatars.com/api/?name=Julius+Berger&background=2C3E50&color=fff&size=128",
    website: "https://julius-berger.com",
    sortOrder: 3,
    active: false,
  },
];

const loadPartners = (): Partner[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultPartners;
  } catch {
    return defaultPartners;
  }
};

const savePartners = (partners: Partner[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
};

const PartnersAdmin = () => {
  const [partners, setPartners] = useState<Partner[]>(loadPartners);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formLogo, setFormLogo] = useState("");
  const [formWebsite, setFormWebsite] = useState("");

  const updatePartners = (updated: Partner[]) => {
    setPartners(updated);
    savePartners(updated);
  };

  const handleAdd = () => {
    if (!formName.trim()) return;
    const newPartner: Partner = {
      id: crypto.randomUUID(),
      name: formName.trim(),
      logoUrl:
        formLogo.trim() ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(formName.trim())}&background=1F6F43&color=fff&size=128`,
      website: formWebsite.trim(),
      sortOrder: partners.length,
      active: true,
    };
    updatePartners([...partners, newPartner]);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editId || !formName.trim()) return;
    updatePartners(
      partners.map((p) =>
        p.id === editId
          ? {
              ...p,
              name: formName.trim(),
              logoUrl: formLogo.trim() || p.logoUrl,
              website: formWebsite.trim(),
            }
          : p,
      ),
    );
    resetForm();
  };

  const handleDelete = (id: string) => {
    updatePartners(partners.filter((p) => p.id !== id));
  };

  const handleToggleActive = (id: string) => {
    updatePartners(
      partners.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  };

  const startEdit = (p: Partner) => {
    setEditId(p.id);
    setFormName(p.name);
    setFormLogo(p.logoUrl);
    setFormWebsite(p.website);
    setShowAdd(true);
  };

  const resetForm = () => {
    setShowAdd(false);
    setEditId(null);
    setFormName("");
    setFormLogo("");
    setFormWebsite("");
  };

  const activePartners = partners
    .filter((p) => p.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const inactivePartners = partners.filter((p) => !p.active);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Partners</span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-10 mb-6"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Handshake className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-primary-dark text-2xl sm:text-3xl tracking-tight">
                    Partners
                  </h1>
                  <p className="text-text-secondary text-sm mt-1">
                    Manage partner organizations that appear on the platform.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAdd(true);
                }}
                className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-lg shadow-glow/30"
              >
                <Plus className="w-4 h-4" /> Add Partner
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: "Total Partners", value: partners.length },
                { label: "Active", value: activePartners.length },
                { label: "Inactive", value: inactivePartners.length },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 text-center"
                >
                  <p className="font-heading font-bold text-primary-dark text-xl">
                    {s.value}
                  </p>
                  <p className="text-text-secondary text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Add/Edit Form */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-heading font-bold text-primary-dark text-lg">
                      {editId ? "Edit Partner" : "Add New Partner"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="w-8 h-8 rounded-full bg-white/60 border border-border-light flex items-center justify-center text-text-subtle hover:text-primary-dark transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Partner Name *
                      </label>
                      <input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g., Access Bank"
                        className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Logo URL
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          value={formLogo}
                          onChange={(e) => setFormLogo(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="flex-1 h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                        {formLogo && (
                          <img
                            src={formLogo}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover border border-border-light"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        )}
                      </div>
                      <p className="text-text-subtle text-[11px] mt-1">
                        Leave blank for auto-generated avatar
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Website
                      </label>
                      <input
                        value={formWebsite}
                        onChange={(e) => setFormWebsite(e.target.value)}
                        placeholder="https://partner-website.com"
                        className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <button
                      onClick={editId ? handleUpdate : handleAdd}
                      disabled={!formName.trim()}
                      className="h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-glow/30"
                    >
                      {editId ? "Update Partner" : "Add Partner"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Partner Grid */}
          <div className="mb-20">
            {activePartners.length > 0 && (
              <>
                <h3 className="font-heading font-semibold text-primary-dark text-sm mb-3">
                  Active Partners
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {activePartners.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col items-center text-center group hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-shadow"
                    >
                      <img
                        src={p.logoUrl}
                        alt={p.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm mb-3"
                        onError={(e) =>
                          (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1F6F43&color=fff&size=128`)
                        }
                      />
                      <p className="font-heading font-bold text-primary-dark text-sm">
                        {p.name}
                      </p>
                      {p.website && (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs mt-1 flex items-center gap-1 hover:underline"
                        >
                          <Globe className="w-3 h-3" /> Visit website
                        </a>
                      )}
                      <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(p)}
                          className="h-7 px-3 rounded-full bg-white/80 border border-border-light text-primary-dark text-[11px] font-medium hover:border-primary/40 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(p.id)}
                          className="h-7 px-3 rounded-full bg-white/80 border border-border-light text-amber-600 text-[11px] font-medium hover:border-amber-300 transition-colors"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="h-7 w-7 rounded-full bg-white/80 border border-border-light flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {inactivePartners.length > 0 && (
              <>
                <h3 className="font-heading font-semibold text-text-secondary text-sm mb-3">
                  Inactive Partners
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inactivePartners.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-5 flex flex-col items-center text-center opacity-60"
                    >
                      <img
                        src={p.logoUrl}
                        alt={p.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm mb-3 grayscale"
                        onError={(e) =>
                          (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=999&color=fff&size=128`)
                        }
                      />
                      <p className="font-heading font-bold text-primary-dark text-sm">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleToggleActive(p.id)}
                          className="h-7 px-3 rounded-full bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="h-7 w-7 rounded-full bg-white/80 border border-border-light flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {partners.length === 0 && (
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-7 h-7 text-text-subtle" />
                </div>
                <h3 className="font-heading font-bold text-primary-dark text-lg">
                  No partners yet
                </h3>
                <p className="text-text-secondary text-sm mt-1 max-w-sm mx-auto">
                  Add your first partner organization to showcase on the
                  platform.
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowAdd(true);
                  }}
                  className="mt-5 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Add first partner
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartnersAdmin;
