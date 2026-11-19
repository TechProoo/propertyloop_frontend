import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import savedSearchesService, {
  savedSearchQuery,
  type SavedSearchFilters,
} from "../../api/services/savedSearches";

export default function SaveSearchButton({
  filters,
}: {
  filters: SavedSearchFilters;
}) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const key = savedSearchQuery(filters);
  const saved = savedKey === key;
  const narrowed = Object.entries(filters).some(
    ([field, value]) =>
      !["sort", "page", "limit"].includes(field) &&
      value !== undefined &&
      value !== null &&
      value !== "",
  );

  async function save() {
    if (!isLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent(`/search?${key}`)}`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await savedSearchesService.create(filters);
      setSavedKey(key);
    } catch {
      setError("Could not save this search. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={save}
        disabled={saving || saved || !narrowed}
        className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-4 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/5 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <Check className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        {saving ? "Saving…" : saved ? "Search saved" : "Save this search"}
      </button>
      <Link
        to="/saved-searches"
        className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
      >
        Saved searches
      </Link>
      {error && (
        <span role="alert" className="w-full text-xs text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
