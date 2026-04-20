import { useState } from "react";
import { Upload, X } from "lucide-react";

interface ProfilePictureUploadProps {
  currentImage: string | null;
  onUpload: (file: File) => Promise<string>;
  disabled?: boolean;
  label?: string;
}

const ProfilePictureUpload = ({
  currentImage,
  onUpload,
  disabled = false,
  label = "Profile Picture",
}: ProfilePictureUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
      <h3 className="font-heading font-bold text-primary-dark text-base mb-6">
        {label}
      </h3>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Current/Preview Image */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/40 flex items-center justify-center bg-white/50 mb-3">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-subtle">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-text-secondary text-center">
            {preview ? "Preview" : "No image"}
          </p>
        </div>

        {/* Upload Section */}
        <div className="flex-1">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading || disabled}
              className="hidden"
            />
            <div
              className={`border-2 border-dashed border-white/40 rounded-2xl p-6 text-center cursor-pointer transition-all ${
                uploading || disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-primary hover:bg-primary/5"
              }`}
            >
              <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-dark">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-text-secondary mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </label>

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {uploading && (
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
              Uploading...
            </div>
          )}

          {preview && !uploading && (
            <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              ✓ Image uploaded successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
