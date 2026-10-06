import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store as StoreIcon,
  Package,
  ShoppingBag,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ImagePlus,
  ExternalLink,
  Check,
  X,
  Star,
  TrendingUp,
  Percent,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import { toast } from "../lib/toast";
import uploadService from "../api/services/upload";
import marketplaceService, {
  type UpsertStorePayload,
  type UpsertProductPayload,
  type ProductWithStore,
  type MarketplaceOrder,
  type VendorEarningsSummary,
} from "../api/services/marketplace";
import type { Storefront } from "../data/storefronts";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

type Tab = "storefront" | "products" | "orders" | "earnings";

const STORE_CATEGORIES = [
  "Furniture & Interiors",
  "Building Materials",
  "Lighting & Decor",
  "Smart Home",
  "Tools & Hardware",
  "Landscaping",
  "Kitchen & Bath",
  "Appliances",
  "Other",
];

/* ─── Small image-upload button ─────────────────────────────────────────── */

function ImageField({
  label,
  value,
  onChange,
  aspect = "aspect-video",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("That file is not an image.");
      return;
    }
    setBusy(true);
    try {
      const { url } = await uploadService.uploadProfilePicture(file);
      onChange(url);
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold text-primary-dark mb-1.5">{label}</p>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className={`relative ${aspect} w-full rounded-2xl border-2 border-dashed border-border-light bg-white/60 overflow-hidden flex items-center justify-center text-text-subtle hover:border-primary transition-colors disabled:opacity-60`}
      >
        {value ? (
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <span className="inline-flex items-center gap-2 text-xs font-medium">
            <ImagePlus className="h-4 w-4" />
            Upload
          </span>
        )}
        {value && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
            <ImagePlus className="h-3 w-3" />
            Change
          </span>
        )}
      </button>
    </div>
  );
}

const field =
  "w-full h-11 px-3.5 rounded-xl border border-border-light bg-white text-sm text-primary-dark focus:outline-none focus:border-primary";

/* ─── Storefront editor ─────────────────────────────────────────────────── */

function StorefrontTab({
  store,
  onSaved,
}: {
  store: Storefront | null;
  onSaved: (s: Storefront) => void;
}) {
  const [form, setForm] = useState<UpsertStorePayload>({
    name: store?.name ?? "",
    tagline: store?.tagline ?? "",
    bio: store?.bio ?? "",
    logo: store?.logo ?? "",
    banner: store?.banner ?? "",
    accent: store?.accent ?? "#2b4e3b",
    category: store?.category ?? STORE_CATEGORIES[0],
    location: store?.location ?? "",
    phone: store?.phone ?? "",
    email: store?.email ?? "",
    established: store?.established ?? "",
    responseTime: store?.responseTime ?? "within a day",
    deliveryAreas: store?.deliveryAreas ?? [],
  });
  const [areasText, setAreasText] = useState(
    (store?.deliveryAreas ?? []).join(", "),
  );
  const [promo, setPromo] = useState({
    title: (store?.promo as any)?.title ?? "",
    subtitle: (store?.promo as any)?.subtitle ?? "",
    code: (store?.promo as any)?.code ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof UpsertStorePayload>(
    k: K,
    v: UpsertStorePayload[K],
  ) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim() || !form.tagline.trim() || !form.category) {
      toast.error("Store name, tagline and category are required.");
      return;
    }
    if (!form.logo || !form.banner) {
      toast.error("Please upload both a logo and a banner.");
      return;
    }
    setSaving(true);
    try {
      const payload: UpsertStorePayload = {
        ...form,
        bio: form.bio.trim() || form.tagline,
        location: form.location.trim() || "Lagos",
        phone: form.phone.trim() || "",
        email: form.email.trim(),
        deliveryAreas: areasText
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        promo:
          promo.title.trim() && promo.code.trim()
            ? {
                title: promo.title.trim(),
                subtitle: promo.subtitle.trim(),
                code: promo.code.trim().toUpperCase(),
              }
            : undefined,
      };
      const saved = await marketplaceService.upsertMyStore(payload);
      onSaved(saved);
      toast.success("Storefront saved.");
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Couldn't save."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!store && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          <p className="font-semibold">Let's open your storefront</p>
          <p className="text-amber-700 text-xs mt-0.5">
            Fill this in and save — then you can add products and start selling.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <ImageField
          label="Banner (wide hero image)"
          value={form.banner}
          onChange={(v) => set("banner", v)}
        />
        <ImageField
          label="Logo (square)"
          value={form.logo}
          onChange={(v) => set("logo", v)}
          aspect="aspect-square"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Store name
          </span>
          <input
            className={field}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Casa Nova Interiors"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Category
          </span>
          <select
            className={field}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {STORE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
          Tagline
        </span>
        <input
          className={field}
          value={form.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          placeholder="One line that sells your store"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
          About your store
        </span>
        <textarea
          className="w-full px-3.5 py-3 rounded-xl border border-border-light bg-white text-sm text-primary-dark focus:outline-none focus:border-primary resize-none"
          rows={4}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="Tell buyers who you are, what you sell, and how you deliver."
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Location
          </span>
          <input
            className={field}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Lekki Phase 1, Lagos"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Established (year)
          </span>
          <input
            className={field}
            value={form.established}
            onChange={(e) => set("established", e.target.value)}
            placeholder="e.g. 2021"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Phone
          </span>
          <input
            className={field}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+234 800 000 0000"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Public email
          </span>
          <input
            className={field}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="orders@yourstore.ng"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Delivery areas (comma separated)
          </span>
          <input
            className={field}
            value={areasText}
            onChange={(e) => setAreasText(e.target.value)}
            placeholder="Lekki, Ikoyi, VI, Nationwide"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
            Brand colour
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.accent}
              onChange={(e) => set("accent", e.target.value)}
              className="h-11 w-14 rounded-xl border border-border-light bg-white cursor-pointer"
            />
            <input
              className={field}
              value={form.accent}
              onChange={(e) => set("accent", e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Promo (optional) */}
      <div className="rounded-2xl border border-border-light bg-white/60 p-4">
        <p className="text-sm font-heading font-bold text-primary-dark mb-3">
          Promotion (optional)
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            className={field}
            value={promo.title}
            onChange={(e) => setPromo((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title (e.g. Move-in Season)"
          />
          <input
            className={field}
            value={promo.subtitle}
            onChange={(e) =>
              setPromo((p) => ({ ...p, subtitle: e.target.value }))
            }
            placeholder="Subtitle"
          />
          <input
            className={field}
            value={promo.code}
            onChange={(e) => setPromo((p) => ({ ...p, code: e.target.value }))}
            placeholder="Code (e.g. MOVEIN25)"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {store && (
          <Link
            to={`/store/${store.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View my storefront
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="ml-auto h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Check className="h-4 w-4" /> Save storefront
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Product form (inline modal) ───────────────────────────────────────── */

function ProductForm({
  initial,
  onClose,
  onSaved,
}: {
  initial?: ProductWithStore;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<UpsertProductPayload>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    priceNaira: initial?.priceNaira ?? 0,
    compareAtNaira: initial?.compareAtNaira,
    category: initial?.category ?? "",
    coverImage: initial?.image ?? "",
    gallery: initial?.gallery ?? [],
    tag: initial?.tag,
    bulkEligible: initial?.bulkEligible ?? false,
    inStock: initial?.inStock ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof UpsertProductPayload>(
    k: K,
    v: UpsertProductPayload[K],
  ) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim() || !form.category.trim() || form.priceNaira <= 0) {
      toast.error("Name, category and a price above zero are required.");
      return;
    }
    if (!form.coverImage) {
      toast.error("Please upload a product image.");
      return;
    }
    setSaving(true);
    try {
      if (initial) {
        await marketplaceService.updateProduct(initial.id, form);
        toast.success("Product updated.");
      } else {
        await marketplaceService.createProduct(form);
        toast.success("Product added.");
      }
      onSaved();
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Couldn't save."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6">
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white border border-border-light shadow-xl">
        <div className="sticky top-0 bg-white border-b border-border-light px-6 py-4 flex items-center justify-between">
          <h3 className="font-heading font-bold text-primary-dark">
            {initial ? "Edit product" : "Add product"}
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-black/5 inline-flex items-center justify-center text-text-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <ImageField
            label="Product image"
            value={form.coverImage}
            onChange={(v) => set("coverImage", v)}
            aspect="aspect-square"
          />
          <label className="block">
            <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
              Product name
            </span>
            <input
              className={field}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                Price (₦)
              </span>
              <input
                type="number"
                className={field}
                value={form.priceNaira || ""}
                onChange={(e) => set("priceNaira", Number(e.target.value) || 0)}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                Compare-at (₦, optional)
              </span>
              <input
                type="number"
                className={field}
                value={form.compareAtNaira || ""}
                onChange={(e) =>
                  set(
                    "compareAtNaira",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
              Category
            </span>
            <input
              className={field}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Living Room, Cement & Concrete"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
              Description
            </span>
            <textarea
              rows={3}
              className="w-full px-3.5 py-3 rounded-xl border border-border-light bg-white text-sm text-primary-dark focus:outline-none focus:border-primary resize-none"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                Badge
              </span>
              <select
                className={field}
                value={form.tag ?? ""}
                onChange={(e) =>
                  set("tag", (e.target.value || undefined) as any)
                }
              >
                <option value="">None</option>
                <option value="new">New</option>
                <option value="bestseller">Bestseller</option>
                <option value="sale">Sale</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                Stock quantity (optional)
              </span>
              <input
                type="number"
                className={field}
                value={form.stockQty ?? ""}
                onChange={(e) =>
                  set(
                    "stockQty",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </label>
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-primary-dark cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => set("inStock", e.target.checked)}
                className="h-4 w-4 accent-[#1f6f43]"
              />
              In stock
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-primary-dark cursor-pointer">
              <input
                type="checkbox"
                checked={form.bulkEligible}
                onChange={(e) => set("bulkEligible", e.target.checked)}
                className="h-4 w-4 accent-[#1f6f43]"
              />
              Bulk pricing
            </label>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-border-light px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-full border border-border-light text-sm font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {initial ? "Save changes" : "Add product"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const MarketplaceVendorDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("storefront");
  const [store, setStore] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [editing, setEditing] = useState<ProductWithStore | null>(null);
  const [adding, setAdding] = useState(false);

  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const [earnings, setEarnings] = useState<VendorEarningsSummary | null>(null);

  useEffect(() => {
    marketplaceService
      .getMyStore()
      .then((s) => setStore(s))
      .catch(() => setStore(null))
      .finally(() => setLoading(false));
  }, []);

  const loadProducts = () => {
    marketplaceService
      .myProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setProductsLoaded(true));
  };

  useEffect(() => {
    if (tab === "products" && store && !productsLoaded) loadProducts();
    if (tab === "orders" && !ordersLoaded) {
      marketplaceService
        .vendorOrders()
        .then((r) => setOrders(r.items))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoaded(true));
    }
    if (tab === "earnings" && !earnings) {
      marketplaceService.vendorEarnings().then(setEarnings).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, store]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = useMemo(
    () => [
      { id: "storefront", label: "Storefront", icon: <StoreIcon className="h-4 w-4" /> },
      { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
      { id: "orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
      { id: "earnings", label: "Earnings", icon: <Wallet className="h-4 w-4" /> },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="Vendor dashboard · PropertyLoop Marketplace"
        description="Manage your storefront, products, orders and earnings."
        path="/marketplace/vendor"
      />
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-text-secondary text-xs hover:text-primary transition-colors mb-5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Marketplace
        </Link>

        <header className="flex items-center gap-4 mb-8">
          {store?.logo ? (
            <img
              src={store.logo}
              alt=""
              className="h-14 w-14 rounded-2xl object-cover border border-border-light"
            />
          ) : (
            <span className="h-14 w-14 rounded-2xl bg-primary/10 text-primary inline-flex items-center justify-center">
              <StoreIcon className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight truncate">
              {store?.name || `${user?.name ?? "Your"}'s store`}
            </h1>
            <p className="text-text-secondary text-sm">
              {store ? store.category : "Set up your storefront to start selling"}
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto mb-6 border-b border-border-light">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-primary-dark"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Storefront ───────────────────────────────────────────── */}
        {tab === "storefront" && (
          <StorefrontTab store={store} onSaved={(s) => setStore(s)} />
        )}

        {/* ─── Products ─────────────────────────────────────────────── */}
        {tab === "products" && (
          <div>
            {!store ? (
              <EmptyNeedsStore onGo={() => setTab("storefront")} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-secondary text-sm">
                    {productsLoaded ? products.length : "…"} products
                  </p>
                  <button
                    onClick={() => setAdding(true)}
                    className="h-10 px-4 rounded-full bg-primary-dark text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-black transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add product
                  </button>
                </div>

                {!productsLoaded ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16 bg-white/60 rounded-3xl border border-border-light">
                    <Package className="h-8 w-8 text-text-subtle mx-auto mb-2" />
                    <p className="font-heading font-bold text-primary-dark">
                      No products yet
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                      Add your first product to appear in the marketplace.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex gap-3 rounded-2xl border border-border-light bg-white p-3"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-20 w-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-primary-dark text-sm line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-text-subtle text-xs">{p.category}</p>
                          <p className="font-heading font-bold text-primary-dark text-sm mt-1">
                            {naira(p.priceNaira)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            {!p.inStock && (
                              <span className="text-[10px] font-bold text-red-600">
                                Out of stock
                              </span>
                            )}
                            <button
                              onClick={() => setEditing(p)}
                              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                              <Pencil className="h-3 w-3" /> Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Remove "${p.name}"?`)) return;
                                try {
                                  await marketplaceService.deleteProduct(p.id);
                                  setProducts((prev) =>
                                    prev.filter((x) => x.id !== p.id),
                                  );
                                  toast.success("Product removed.");
                                } catch {
                                  toast.error("Couldn't remove.");
                                }
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── Orders ───────────────────────────────────────────────── */}
        {tab === "orders" && (
          <div>
            {!ordersLoaded ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white/60 rounded-3xl border border-border-light">
                <ShoppingBag className="h-8 w-8 text-text-subtle mx-auto mb-2" />
                <p className="font-heading font-bold text-primary-dark">
                  No orders yet
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  Paid orders containing your products will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-2xl border border-border-light bg-white p-4"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          {o.orderNumber}
                        </p>
                        <p className="text-text-subtle text-xs">
                          {o.buyerName} · {o.city}, {o.state} ·{" "}
                          {new Date(o.placedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 px-2.5 py-0.5 text-[11px] font-semibold">
                        <Check className="h-3 w-3" />
                        {o.status}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {o.items.map((it) => (
                        <li
                          key={it.productId}
                          className="flex items-center gap-2 text-xs text-text-secondary"
                        >
                          <img
                            src={it.image}
                            alt=""
                            className="h-7 w-7 rounded-md object-cover"
                          />
                          <span className="text-primary-dark font-medium">
                            {it.name}
                          </span>
                          <span>× {it.quantity}</span>
                          <span className="ml-auto font-semibold text-primary-dark">
                            {naira(it.lineTotal)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-text-secondary">
                      Deliver to:{" "}
                      <span className="text-primary-dark font-medium">
                        {o.address}, {o.city}
                      </span>{" "}
                      · {o.buyerPhone}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Earnings ─────────────────────────────────────────────── */}
        {tab === "earnings" && (
          <div>
            {!earnings ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Net earnings",
                      value: naira(earnings.netNaira),
                      icon: <Wallet className="h-5 w-5" />,
                      hint: "After commission",
                    },
                    {
                      label: "Gross sales",
                      value: naira(earnings.grossNaira),
                      icon: <TrendingUp className="h-5 w-5" />,
                      hint: `${earnings.lineItems} items sold`,
                    },
                    {
                      label: "Commission",
                      value: naira(earnings.commissionNaira),
                      icon: <Percent className="h-5 w-5" />,
                      hint: "PropertyLoop's share",
                    },
                    {
                      label: "Paid orders",
                      value: String(earnings.orders),
                      icon: <ShoppingBag className="h-5 w-5" />,
                      hint: "Lifetime",
                    },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="rounded-2xl border border-border-light bg-white p-5"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                        {c.icon}
                      </span>
                      <p className="font-heading font-bold text-primary-dark text-xl">
                        {c.value}
                      </p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        {c.label}
                      </p>
                      <p className="text-text-subtle text-[11px] mt-1 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {c.hint}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/15 p-4 text-sm text-text-secondary">
                  Payouts are settled by the PropertyLoop team to your registered
                  bank account. Keep your bank details current in Settings.
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {(adding || editing) && (
        <ProductForm
          initial={editing ?? undefined}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSaved={loadProducts}
        />
      )}

      <Footer />
    </div>
  );
};

function EmptyNeedsStore({ onGo }: { onGo: () => void }) {
  return (
    <div className="text-center py-16 bg-white/60 rounded-3xl border border-border-light">
      <StoreIcon className="h-8 w-8 text-text-subtle mx-auto mb-2" />
      <p className="font-heading font-bold text-primary-dark">
        Set up your storefront first
      </p>
      <p className="text-text-secondary text-sm mt-1">
        You need a storefront before you can add products.
      </p>
      <button
        onClick={onGo}
        className="mt-4 h-10 px-5 rounded-full bg-primary-dark text-white text-xs font-bold hover:bg-black transition-colors"
      >
        Go to storefront setup
      </button>
    </div>
  );
}

export default MarketplaceVendorDashboard;
