import { ExperienceLogoSection } from "./components/ExperienceLogoSection";
import { AppCarousel } from "./components/AppCarousel";
import { ChecklistSections } from "./components/ChecklistSections";
import { ExperienceSections } from "./components/ExperienceSections";
import { JourneySlider } from "./components/JourneySlider";
import { SiteHeader } from "./components/SiteHeader";
import { SkillsSection } from "./components/SkillsSection";

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(13,148,136,.12),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(217,119,6,.12),transparent_26%),linear-gradient(160deg,#f8fbff,#eef8ff_45%,#f6fffb)] text-slate-900">
      <SiteHeader />

      <main>
        <JourneySlider />
        <AppCarousel />
      <ExperienceLogoSection />
        <ChecklistSections />
        <ExperienceSections />
        <SkillsSection />
      </main>

      <footer id="contact" className="mx-auto max-w-7xl scroll-mt-28 px-5 pb-10 pt-6">
      <div className="contact-glass-card">
        <div className="contact-main-grid">
          <div className="contact-info-area">
            <p className="contact-eyebrow">Contact & Social Channels</p>

            <h2 className="contact-name">
              Saifuddin Abdullah Rasyid
            </h2>

            <div className="contact-detail-grid">
              <a className="contact-detail-card" href="mailto:syehsaifuddin@gmai.com">
                <img src="/assets/sosmed/gmail.png" alt="" className="contact-detail-icon" />
                <span className="contact-detail-label">Email</span>
                <strong>syehsaifuddin@gmai.com</strong>
              </a>

              <a className="contact-detail-card" href="https://wa.me/628126989485" target="_blank" rel="noreferrer">
                <img src="/assets/sosmed/logo-wa.jpg" alt="" className="contact-detail-icon" />
                <span className="contact-detail-label">Phone / WhatsApp</span>
                <strong>+62 812-6989-485</strong>
              </a>

              <a className="contact-detail-card" href="https://share.google/UgnXaMPwzIIt9GgVz" target="_blank" rel="noreferrer">
                <img src="/assets/sosmed/shareloc.png" alt="" className="contact-detail-icon" />
                <span className="contact-detail-label">Address</span>
                <strong>Kota Serang, Banten</strong>
              </a>
            </div>
          </div>

          <div className="contact-social-area" aria-label="Social media links">
            <a className="sosmed-btn" href="https://discord.com/users/saifuddin_24044" target="_blank" rel="noreferrer" title="Discord: saifuddin_24044">
              <img src="/assets/sosmed/discord.png" alt="Discord" />
              <span>Discord</span>
            </a>

            <a className="sosmed-btn" href="mailto:syehsaifuddin@gmai.com" title="Gmail: syehsaifuddin@gmai.com">
              <img src="/assets/sosmed/gmail.png" alt="Gmail" />
              <span>Gmail</span>
            </a>

            <a className="sosmed-btn" href="https://www.facebook.com/syehs/" target="_blank" rel="noreferrer" title="Facebook">
              <img src="/assets/sosmed/logo-fb.jpg" alt="Facebook" />
              <span>Facebook</span>
            </a>

            <a className="sosmed-btn" href="https://www.instagram.com/syesyoh/" target="_blank" rel="noreferrer" title="Instagram">
              <img src="/assets/sosmed/logo-ig.jpg" alt="Instagram" />
              <span>Instagram</span>
            </a>

            <a className="sosmed-btn" href="https://line.me/ti/p/~Syehsyoh79" target="_blank" rel="noreferrer" title="LINE: Syehsyoh79">
              <img src="/assets/sosmed/logo-line.jpg" alt="LINE" />
              <span>LINE</span>
            </a>

            <a className="sosmed-btn" href="https://t.me/syehsyoh" target="_blank" rel="noreferrer" title="Telegram: @syehsyoh">
              <img src="/assets/sosmed/logo-telegram.jpg" alt="Telegram" />
              <span>Telegram</span>
            </a>

            <a className="sosmed-btn" href="https://www.tiktok.com/@syehsyoh60" target="_blank" rel="noreferrer" title="TikTok: @syehsyoh60">
              <img src="/assets/sosmed/logo-tictoc.jpg" alt="TikTok" />
              <span>TikTok</span>
            </a>

            <a className="sosmed-btn" href="https://www.threads.com/@syesyoh" target="_blank" rel="noreferrer" title="Threads">
              <img src="/assets/sosmed/logo-tread.jpg" alt="Threads" />
              <span>Threads</span>
            </a>

            <a className="sosmed-btn" href="https://wa.me/628126989485" target="_blank" rel="noreferrer" title="WhatsApp: +628126989485">
              <img src="/assets/sosmed/logo-wa.jpg" alt="WhatsApp" />
              <span>WhatsApp</span>
            </a>

            <a className="sosmed-btn" href="https://www.linkedin.com/in/saifuddin-abdullah-49ba2157/" target="_blank" rel="noreferrer" title="LinkedIn">
              <img
                src="/assets/sosmed/linkedin.png"
                alt="LinkedIn"
              />
              <span>LinkedIn</span>
            </a>

            <a className="sosmed-btn" href="mailto:syehsaifuddinsyoh@outlook.com" title="Outlook: syehsaifuddinsyoh@outlook.com">
              <img src="/assets/sosmed/outlook.jpg" alt="Outlook" />
              <span>Outlook</span>
            </a>

            <a className="sosmed-btn" href="https://pikiranku.binsaifuddin.it.com/" target="_blank" rel="noreferrer" title="Pikiranku">
              <img src="/assets/sosmed/pikiranku.png" alt="Pikiranku" />
              <span>Pikiranku</span>
            </a>

            <a className="sosmed-btn" href="https://share.google/UgnXaMPwzIIt9GgVz" target="_blank" rel="noreferrer" title="Share Location">
              <img src="/assets/sosmed/shareloc.png" alt="Share Location" />
              <span>Location</span>
            </a>

            <a className="sosmed-btn" href="https://slack.com/" target="_blank" rel="noreferrer" title="Slack: saifuddin">
              <img src="/assets/sosmed/slack.png" alt="Slack" />
              <span>Slack</span>
            </a>

            <a className="sosmed-btn" href="mailto:syehsyoh@yahoo.com" title="Yahoo: syehsyoh@yahoo.com">
              <img src="/assets/sosmed/yahoo.jpg" alt="Yahoo" />
              <span>Yahoo</span>
            </a>

            <a className="sosmed-btn" href="https://www.youtube.com/@syehsaifuddin28" target="_blank" rel="noreferrer" title="YouTube">
              <img src="/assets/sosmed/youtube.png" alt="YouTube" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .contact-glass-card {
          border-radius: 2.25rem;
          border: 1px solid rgba(255,255,255,0.82);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.76));
          box-shadow:
            0 24px 55px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.95);
          backdrop-filter: blur(18px) saturate(130%);
          -webkit-backdrop-filter: blur(18px) saturate(130%);
          padding: clamp(1.25rem, 2vw, 2rem);
        }

        .contact-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
          gap: clamp(1.2rem, 2vw, 2rem);
          align-items: center;
        }

        .contact-eyebrow {
          margin: 0 0 0.35rem;
          color: #0f766e;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .contact-name {
          margin: 0;
          color: #020617;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.55rem, 2.4vw, 2.4rem);
          font-weight: 950;
          line-height: 1.08;
        }

        .contact-detail-grid {
          margin-top: 1.15rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.7rem;
        }

        .contact-detail-card {
          min-width: 0;
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          grid-template-areas:
            "icon label"
            "icon value";
          column-gap: 0.7rem;
          align-items: center;
          border-radius: 1.35rem;
          border: 1px solid rgba(226, 232, 240, 0.86);
          background: rgba(248, 250, 252, 0.72);
          padding: 0.82rem 0.95rem;
          text-decoration: none;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease,
            border-color 180ms ease;
        }

        .contact-detail-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.92);
          border-color: rgba(20, 184, 166, 0.25);
          box-shadow: 0 12px 26px rgba(15, 118, 110, 0.10);
        }

        .contact-detail-icon {
          grid-area: icon;
          width: 30px;
          height: 30px;
          object-fit: contain;
          border-radius: 10px;
        }

        .contact-detail-label {
          grid-area: label;
          color: #0f766e;
          font-size: 0.66rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .contact-detail-card strong {
          grid-area: value;
          min-width: 0;
          overflow: hidden;
          color: #334155;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 0.78rem;
          font-weight: 850;
          line-height: 1.25;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .contact-social-area {
          display: grid;
          grid-template-columns: repeat(8, minmax(54px, 1fr));
          gap: 0.68rem;
          justify-content: end;
          align-items: center;
        }

        .sosmed-btn {
          position: relative;
          min-width: 0;
          height: 64px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0.25rem;
          border-radius: 1.25rem;
          border: 1px solid rgba(255,255,255,0.74);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.88), rgba(240,253,250,0.54));
          box-shadow:
            0 10px 22px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255,255,255,0.92);
          color: #0f766e;
          text-decoration: none;
          transition:
            transform 170ms ease,
            box-shadow 170ms ease,
            border-color 170ms ease,
            background 170ms ease;
          overflow: hidden;
        }

        .sosmed-btn:hover {
          transform: translateY(-3px);
          border-color: rgba(20, 184, 166, 0.34);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.96), rgba(204,251,241,0.66));
          box-shadow:
            0 16px 30px rgba(15, 118, 110, 0.13),
            inset 0 1px 0 rgba(255,255,255,0.96);
        }

        .sosmed-btn img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          border-radius: 9px;
          flex: 0 0 auto;
        }

        .sosmed-btn span {
          max-width: 92%;
          overflow: hidden;
          color: #0f766e;
          font-size: 0.58rem;
          font-weight: 950;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 1180px) {
          .contact-main-grid {
            grid-template-columns: 1fr;
          }

          .contact-social-area {
            grid-template-columns: repeat(8, minmax(54px, 1fr));
            justify-content: stretch;
          }
        }

        @media (max-width: 820px) {
          .contact-detail-grid {
            grid-template-columns: 1fr;
          }

          .contact-social-area {
            grid-template-columns: repeat(4, minmax(64px, 1fr));
          }

          .sosmed-btn {
            height: 62px;
          }
        }

        @media (max-width: 480px) {
          .contact-glass-card {
            padding: 1rem;
            border-radius: 1.75rem;
          }

          .contact-social-area {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.55rem;
          }

          .sosmed-btn {
            height: 58px;
            border-radius: 1rem;
          }

          .sosmed-btn img {
            width: 24px;
            height: 24px;
          }

          .sosmed-btn span {
            font-size: 0.53rem;
          }
        }
      `}</style>
    </footer>
    </div>
  );
}