import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import appStoreBadge from "../../assets/appstore.png";
import playStoreBadge from "../../assets/playstore.png";
import preview from "../../assets/app_ss1.jpg";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../lib/appLinks";

export { APP_STORE_URL, PLAY_STORE_URL };

export default function CtaBanner() {
  return (
    <section className="landing-app">
      <div className="landing-app-inner">
        <div>
          <p className="chapter-label">The PropertyLoop app</p>
          <h2>
            Your shortlist,
            <br />
            <em>wherever you go.</em>
          </h2>
          <p>
            Save homes you love, book a viewing and keep your property search
            close at hand.
          </p>
          <div className="landing-app-links">
            <a href={APP_STORE_URL}>
              <img
                loading="lazy"
                src={appStoreBadge}
                alt="Download on the App Store"
              />
            </a>
            <a href={PLAY_STORE_URL}>
              <img
                loading="lazy"
                src={playStoreBadge}
                alt="Get it on Google Play"
              />
            </a>
          </div>
          <Link className="web-link" to="/onboarding">
            Create an account on the web <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="landing-app-preview">
          <img src={preview} alt="PropertyLoop mobile app" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
