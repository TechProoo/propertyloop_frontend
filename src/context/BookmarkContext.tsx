import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type BookmarkType = "property" | "service" | "product";

interface BookmarkItem {
  id: string;
  type: BookmarkType;
}

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  isBookmarked: (id: string, type: BookmarkType) => boolean;
  toggle: (id: string, type: BookmarkType) => void;
  getByType: (type: BookmarkType) => string[];
  count: number;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarkProvider");
  return ctx;
};

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pl_bookmarks");
    if (saved) {
      try { setBookmarks(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (items: BookmarkItem[]) => {
    setBookmarks(items);
    localStorage.setItem("pl_bookmarks", JSON.stringify(items));
  };

  const isBookmarked = useCallback((id: string, type: BookmarkType) => {
    return bookmarks.some((b) => b.id === id && b.type === type);
  }, [bookmarks]);

  const toggle = useCallback((id: string, type: BookmarkType) => {
    const exists = bookmarks.some((b) => b.id === id && b.type === type);
    if (exists) {
      persist(bookmarks.filter((b) => !(b.id === id && b.type === type)));
    } else {
      persist([...bookmarks, { id, type }]);
    }
  }, [bookmarks]);

  const getByType = useCallback((type: BookmarkType) => {
    return bookmarks.filter((b) => b.type === type).map((b) => b.id);
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, isBookmarked, toggle, getByType, count: bookmarks.length }}>
      {children}
    </BookmarkContext.Provider>
  );
};
