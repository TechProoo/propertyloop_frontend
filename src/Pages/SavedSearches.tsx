import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import savedSearchesService, {
  describeSavedSearch,
  savedSearchQuery,
  type SavedSearch,
} from "../api/services/savedSearches";

export default function SavedSearches() {
  const [items, setItems] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    savedSearchesService
      .list()
      .then((rows) => {
        if (active) {
          setItems(rows);
          setError("");
        }
      })
      .catch(() => {
        if (active)
          setError("Could not load your saved searches. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);

  async function remove(item: SavedSearch) {
    if (!window.confirm("Remove this saved search?")) return;
    setRemoving(item.id);
    setError("");
    try {
      await savedSearchesService.remove(item.id);
      setItems((rows) => rows.filter((row) => row.id !== item.id));
    } catch {
      setError("Could not remove this search. Please try again.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="Saved searches"
        description="Reopen your saved PropertyLoop property searches."
        path="/saved-searches"
      />
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Your property search
        </span>
        <h1 className="mt-3 font-heading text-3xl font-bold text-primary-dark sm:text-4xl">
          Saved searches
        </h1>
        <p className="mt-3 text-sm text-text-secondary">
          Keep your location, budget and preferences, then pick up where you
          left off on any device.
        </p>
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800"
          >
            {error}{" "}
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setRetry((n) => n + 1);
              }}
              className="ml-2 font-bold underline"
            >
              Try again
            </button>
          </div>
        )}
        {loading ? (
          <p role="status" className="py-12 text-sm text-text-secondary">
            Loading your searches…
          </p>
        ) : items.length === 0 && !error ? (
          <div className="mt-8 rounded-3xl border border-border-light bg-white p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 font-heading text-xl font-bold text-primary-dark">
              Your next home starts with a search
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Choose an area and your filters, then tap “Save this search”.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                to="/rent"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white"
              >
                Find a rental
              </Link>
              <Link
                to="/buy"
                className="rounded-full border border-primary/25 px-5 py-2.5 text-sm font-bold text-primary"
              >
                Find a home to buy
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-border-light bg-white p-5 sm:p-6"
              >
                <h2 className="font-heading text-xl font-bold text-primary-dark">
                  {item.location || item.search || "All locations"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {describeSavedSearch(item)}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Link
                    to={`/search?${savedSearchQuery(item)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white"
                  >
                    View results <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    disabled={removing === item.id}
                    aria-label={`Remove saved search: ${item.location || item.search || "All locations"}`}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {removing === item.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
