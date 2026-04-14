import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../../context/BookmarkContext";
import { useAuth } from "../../context/AuthContext";

const typeMap = {
  property: "PROPERTY",
  service: "SERVICE",
  product: "PRODUCT",
} as const;

interface Props {
  id: string;
  type: "property" | "service" | "product";
  className?: string;
  size?: "sm" | "md";
}

const BookmarkButton = ({ id, type, className = "", size = "md" }: Props) => {
  const { isLoggedIn } = useAuth();
  const { isBookmarked, toggle } = useBookmarks();
  const navigate = useNavigate();

  const apiType = typeMap[type];
  const active = isLoggedIn && isBookmarked(id, apiType);
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
          navigate("/login");
          return;
        }
        toggle(id, apiType);
      }}
      className={`${sizeClass} rounded-full flex items-center justify-center transition-all duration-200 ${
        active
          ? "bg-red-500 text-white shadow-lg"
          : "bg-white/80 backdrop-blur-sm border border-white/50 text-text-subtle hover:text-red-400 hover:border-red-200"
      } ${className}`}
      title={
        !isLoggedIn ? "Log in to save" : active ? "Remove bookmark" : "Save"
      }
    >
      <Heart className={`${iconSize} ${active ? "fill-white" : ""}`} />
    </button>
  );
};

export default BookmarkButton;
