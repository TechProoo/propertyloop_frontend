import { WifiOff, RefreshCcw, ArrowLeft } from "lucide-react";

type Props = {
  onRetry?: () => void;
};

const NetworkError = ({ onRetry }: Props) => {
  const handleRetry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex flex-col">
      <main className="flex-1 w-full px-6 md:px-12 lg:px-20 flex items-center justify-center">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-7">
            <WifiOff className="w-9 h-9 text-primary" />
          </div>

          <h1 className="font-heading font-bold text-primary-dark text-2xl sm:text-3xl mb-3">
            You're offline
          </h1>

          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            We can't reach PropertyLoop right now. This usually means your
            internet connection dropped — it's not us. Check your Wi-Fi or
            mobile data and try again.
          </p>

          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-5 mb-8 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-primary mb-3">
              Try this
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>Turn airplane mode off, or toggle Wi-Fi off and on.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>Move to a spot with better signal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>Tap retry once you're back online.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="h-11 px-5 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
              onClick={handleRetry}
              className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
            >
              <RefreshCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NetworkError;
