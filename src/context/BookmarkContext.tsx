import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import bookmarksService from "../api/services/bookmarks";
import { useAuth } from "./AuthContext";
import type { BookmarkType, Bookmark } from "../api/types";

interface BookmarkContextType {
  bookmarks: Bookmark[];
  isBookmarked: (entityId: string, type: BookmarkType) => boolean;
  toggle: (entityId: string, type: BookmarkType) => void;
  getByType: (type: BookmarkType) => string[];
  count: number;
  loading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarkProvider");
  return ctx;
};

function entityId(bm: Bookmark): string {
  return bm.listingId || bm.productId || bm.vendorUserId || bm.id;
}

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { setBookmarks([]); return; }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await bookmarksService.list();
        if (!cancelled) setBookmarks(data);
      } catch { if (!cancelled) setBookmarks([]); }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const isBookmarked = useCallback(
    (eid: string, type: BookmarkType) =>
      bookmarks.some((b) => b.type === type && entityId(b) === eid),
    [bookmarks],
  );

  const toggle = useCallback(
    async (eid: string, type: BookmarkType) => {
      if (!isLoggedIn) return;
      try {
        const res = await bookmarksService.toggle(eid, type);
        if (res.bookmarked) {
          setBookmarks((prev) => [
            ...prev,
            { id: res.id, userId: "", type, listingId: type === "PROPERTY" ? eid : null, productId: type === "PRODUCT" ? eid : null, vendorUserId: type === "SERVICE" ? eid : null, createdAt: new Date().toISOString() },
          ]);
        } else {
          setBookmarks((prev) =>
            prev.filter((b) => !(b.type === type && entityId(b) === eid)),
          );
        }
      } catch { /* silent */ }
    },
    [isLoggedIn],
  );

  const getByType = useCallback(
    (type: BookmarkType) =>
      bookmarks.filter((b) => b.type === type).map(entityId),
    [bookmarks],
  );

  return (
    <BookmarkContext.Provider value={{ bookmarks, isBookmarked, toggle, getByType, count: bookmarks.length, loading }}>
      {children}
    </BookmarkContext.Provider>
  );
};
