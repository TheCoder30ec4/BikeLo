import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, Twitter, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const companyLinks = [
    { label: "Bike-Lo Assured", href: "/assured" },
    { label: "Who we are", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Customer reviews", href: "/reviews" },
    { label: "Hub locations", href: "/locations" },
    { label: "Popular bikes", href: "/bikes" },
    { label: "FAQ", href: "/faq" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  const offeringsLinks = [
    { label: "Buy bike", href: "/buy" },
    { label: "Sell bike", href: "/sell" },
    { label: "Used bike loan", href: "/loan" },
    { label: "Bike service", href: "/service" },
    { label: "Bike insurance", href: "/insurance" },
    { label: "Challan", href: "/challan" },
    { label: "Bike-Lo Partners", href: "/partners" },
  ];

  const servicingLinks = [
    { label: "Periodic service", href: "/service/periodic" },
    { label: "Clutch & suspension", href: "/service/clutch" },
    { label: "Health check services", href: "/service/health" },
    { label: "Wheel care", href: "/service/wheel" },
    { label: "Washing & cleaning", href: "/service/washing" },
  ];

  const processLinks = [
    { label: "How buying works", href: "/process/buying" },
    { label: "Inspection process", href: "/process/inspection" },
  ];

  const financeLinks = [
    { label: "Service cost calculator", href: "/tools/calculator" },
    { label: "EMI calculator", href: "/tools/emi" },
  ];

  const policyLinks = [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms & conditions", href: "/terms" },
  ];

  const contactLinks = [
    { label: "Trade with us", href: "/trade" },
    { label: "Connect with us", href: "/contact" },
  ];

  const buyLocations = [
    "Delhi NCR", "Bangalore", "Hyderabad", "Mumbai", "Pune", "Delhi",
    "Gurgaon", "Noida", "Ahmedabad", "Chennai", "Kolkata", "Lucknow",
    "Jaipur", "Agra", "Ambala", "Chandigarh", "Coimbatore", "Faridabad",
    "Ghaziabad", "Kanpur", "Karnal", "Kochi", "Mysuru", "Sonipat", "Visakhapatnam"
  ];

  const serviceLocations = [
    "Delhi NCR", "Bangalore", "Hyderabad", "Mumbai", "Pune", "Delhi",
    "Gurgaon", "Noida", "Ahmedabad", "Chennai", "Kolkata", "Lucknow",
    "Jaipur", "Chandigarh", "Coimbatore", "Faridabad", "Ghaziabad"
  ];

  return (
    <footer className="footer-container">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-grid">
          {/* Left Column - Brand Info */}
          <div className="footer-brand">
            {/* Logo */}
            <Link to="/" className="footer-logo">
              <span className="footer-logo-text">
                <span className="text-[#DC2626]">Bike</span>
                <span className="text-black dark:text-white">-Lo</span>
              </span>
            </Link>

            {/* Description */}
            <p className="footer-description">
              Bike-Lo is the most trusted way of buying and selling used bikes. Select online and book a test ride at
              your home or at a Bike-Lo Hub near you. Get a free one-year comprehensive service warranty with
              Assured Resale Value on every Bike-Lo bike.
            </p>

            <p className="footer-disclaimer">
              (*)subject to certain terms and conditions.
            </p>

            {/* Social Icons */}
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <Instagram size={22} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <Linkedin size={22} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <Facebook size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X (Twitter)">
                <Twitter size={22} />
              </a>
            </div>

            {/* Copyright */}
            <div className="footer-copyright">
              <p>© 2024 BIKEZLO MOTORRAD INDIA LLP.</p>
              <p>All rights reserved.</p>
            </div>

            <p className="footer-cin">
              CIN: U74999HR2019PTC077781
            </p>

            {/* CTA Buttons */}
            <div className="footer-cta">
              <Button className="cta-call">
                <Phone size={18} />
                727-727-7275
              </Button>
              <Button variant="outline" className="cta-outline">
                Get Instant Quotes
              </Button>
              <Button variant="outline" className="cta-outline">
                Browse Bikes
              </Button>
            </div>
          </div>

          {/* Right Columns - Links */}
          <div className="footer-links-grid">
            {/* Company */}
            <div className="footer-links-column">
              <h4 className="footer-heading">COMPANY</h4>
              <ul className="footer-links">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Offerings */}
            <div className="footer-links-column">
              <h4 className="footer-heading">OFFERINGS</h4>
              <ul className="footer-links">
                {offeringsLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bike Servicing */}
            <div className="footer-links-column">
              <h4 className="footer-heading">BIKE SERVICING</h4>
              <ul className="footer-links">
                {servicingLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Processes */}
            <div className="footer-links-column">
              <h4 className="footer-heading">PROCESSES</h4>
              <ul className="footer-links">
                {processLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>

              <h4 className="footer-heading mt-6">FINANCE & TOOLS</h4>
              <ul className="footer-links">
                {financeLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>

              <h4 className="footer-heading mt-6">POLICIES & TERMS</h4>
              <ul className="footer-links">
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="footer-links-column">
              <h4 className="footer-heading">CONTACT US</h4>
              <ul className="footer-links">
                {contactLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Locations */}
        <div className="footer-locations">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div className="location-section flex-1 mb-0">
              <h5 className="location-heading">BUY USED BIKE IN</h5>
              <p className="location-list">
                {buyLocations.join(" | ")}
              </p>
            </div>

            <div className="location-section flex-1 mb-0">
              <h5 className="location-heading">BIKE REPAIR & SERVICING IN</h5>
              <p className="location-list">
                {serviceLocations.join(" | ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* City Skyline SVG */}
      <div className="footer-skyline">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="skyline-svg">
          {/* Buildings */}
          <path d="M0 120 L0 90 L20 90 L20 70 L40 70 L40 90 L60 90 L60 50 L80 50 L80 90 L100 90 L100 60 L120 60 L120 90 L140 90 L140 40 L160 40 L160 90 L180 90 L180 75 L200 75 L200 90 L220 90 L220 55 L240 55 L240 90 L260 90 L260 80 L280 80 L280 90 L300 90 L300 45 L320 45 L320 90 L340 90 L340 65 L360 65 L360 90 L380 90 L380 85 L400 85 L400 90 L420 90 L420 50 L440 50 L440 90 L460 90 L460 70 L480 70 L480 90 L500 90 L500 55 L520 55 L520 90 L540 90 L540 75 L560 75 L560 90 L580 90 L580 40 L600 40 L600 90 L620 90 L620 60 L640 60 L640 90 L660 90 L660 80 L680 80 L680 90 L700 90 L700 50 L720 50 L720 90 L740 90 L740 65 L760 65 L760 90 L780 90 L780 45 L800 45 L800 90 L820 90 L820 70 L840 70 L840 90 L860 90 L860 55 L880 55 L880 90 L900 90 L900 75 L920 75 L920 90 L940 90 L940 60 L960 60 L960 90 L980 90 L980 85 L1000 85 L1000 90 L1020 90 L1020 50 L1040 50 L1040 90 L1060 90 L1060 70 L1080 70 L1080 90 L1100 90 L1100 40 L1120 40 L1120 90 L1140 90 L1140 65 L1160 65 L1160 90 L1180 90 L1180 55 L1200 55 L1200 90 L1220 90 L1220 75 L1240 75 L1240 90 L1260 90 L1260 80 L1280 80 L1280 90 L1300 90 L1300 45 L1320 45 L1320 90 L1340 90 L1340 60 L1360 60 L1360 90 L1380 90 L1380 70 L1400 70 L1400 90 L1420 90 L1420 50 L1440 50 L1440 120 Z" 
            fill="none" 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="1"
          />
          {/* Windows - dots pattern */}
          <g fill="rgba(255,255,255,0.1)">
            <rect x="65" y="60" width="3" height="3" />
            <rect x="72" y="60" width="3" height="3" />
            <rect x="65" y="70" width="3" height="3" />
            <rect x="72" y="70" width="3" height="3" />
            <rect x="145" y="50" width="3" height="3" />
            <rect x="152" y="50" width="3" height="3" />
            <rect x="145" y="60" width="3" height="3" />
            <rect x="152" y="60" width="3" height="3" />
            <rect x="145" y="70" width="3" height="3" />
            <rect x="152" y="70" width="3" height="3" />
            <rect x="305" y="55" width="3" height="3" />
            <rect x="312" y="55" width="3" height="3" />
            <rect x="305" y="65" width="3" height="3" />
            <rect x="312" y="65" width="3" height="3" />
            <rect x="425" y="60" width="3" height="3" />
            <rect x="432" y="60" width="3" height="3" />
            <rect x="425" y="70" width="3" height="3" />
            <rect x="432" y="70" width="3" height="3" />
            <rect x="585" y="50" width="3" height="3" />
            <rect x="592" y="50" width="3" height="3" />
            <rect x="585" y="60" width="3" height="3" />
            <rect x="592" y="60" width="3" height="3" />
            <rect x="585" y="70" width="3" height="3" />
            <rect x="592" y="70" width="3" height="3" />
            <rect x="705" y="60" width="3" height="3" />
            <rect x="712" y="60" width="3" height="3" />
            <rect x="705" y="70" width="3" height="3" />
            <rect x="712" y="70" width="3" height="3" />
            <rect x="785" y="55" width="3" height="3" />
            <rect x="792" y="55" width="3" height="3" />
            <rect x="785" y="65" width="3" height="3" />
            <rect x="792" y="65" width="3" height="3" />
            <rect x="1025" y="60" width="3" height="3" />
            <rect x="1032" y="60" width="3" height="3" />
            <rect x="1025" y="70" width="3" height="3" />
            <rect x="1032" y="70" width="3" height="3" />
            <rect x="1105" y="50" width="3" height="3" />
            <rect x="1112" y="50" width="3" height="3" />
            <rect x="1105" y="60" width="3" height="3" />
            <rect x="1112" y="60" width="3" height="3" />
            <rect x="1105" y="70" width="3" height="3" />
            <rect x="1112" y="70" width="3" height="3" />
            <rect x="1305" y="55" width="3" height="3" />
            <rect x="1312" y="55" width="3" height="3" />
            <rect x="1305" y="65" width="3" height="3" />
            <rect x="1312" y="65" width="3" height="3" />
          </g>
        </svg>
      </div>

      <style>{`
        .footer-container {
          position: relative;
          background: transparent;
          color: #000000;
          overflow: hidden;
          border-top: 1px solid rgba(247, 147, 30, 0.2);
        }

        .dark .footer-container {
          color: #ffffff;
          border-top: 1px solid rgba(247, 147, 30, 0.3);
        }

        .footer-content {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 24px 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
        }

        /* Left Brand Column */
        .footer-brand {
          max-width: 420px;
        }

        .footer-logo {
          display: inline-block;
          text-decoration: none;
          margin-bottom: 20px;
        }

        .footer-logo-text {
          font-family: 'Noto Serif', serif;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .footer-description {
          font-family: 'Noto Serif', serif;
          font-size: 0.875rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin-bottom: 16px;
        }

        .dark .footer-description {
          color: #d1d5db;
        }

        .footer-disclaimer {
          font-size: 0.75rem;
          color: #888888;
          margin-bottom: 24px;
        }

        .dark .footer-disclaimer {
          color: #9ca3af;
        }

        .footer-social {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(247, 147, 30, 0.1);
          color: #f7931e;
          border: 1px solid rgba(247, 147, 30, 0.3);
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: #f7931e;
          color: white;
          transform: translateY(-2px);
        }

        .footer-copyright {
          font-size: 0.8rem;
          color: #666666;
          margin-bottom: 8px;
        }

        .dark .footer-copyright {
          color: #9ca3af;
        }

        .footer-copyright p {
          color: #666666 !important;
        }

        .dark .footer-copyright p {
          color: #9ca3af !important;
        }

        .footer-cin {
          font-size: 0.75rem;
          color: #888888;
          margin-bottom: 24px;
        }

        .dark .footer-cin {
          color: #9ca3af;
        }

        .footer-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .cta-call {
          background: #f7931e !important;
          color: white !important;
          border: none !important;
          padding: 12px 20px !important;
          border-radius: 25px !important;
          font-family: 'Noto Serif', serif !important;
          font-weight: 600 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .cta-call:hover {
          background: #e6851a !important;
        }

        .cta-outline {
          background: transparent !important;
          color: #333333 !important;
          border: 1px solid rgba(247, 147, 30, 0.5) !important;
          padding: 12px 20px !important;
          border-radius: 25px !important;
          font-family: 'Noto Serif', serif !important;
          font-weight: 500 !important;
        }

        .dark .cta-outline {
          color: #e5e7eb !important;
          border: 1px solid rgba(247, 147, 30, 0.6) !important;
        }

        .cta-outline:hover {
          border-color: #f7931e !important;
          background: rgba(247, 147, 30, 0.1) !important;
          color: #f7931e !important;
        }

        .dark .cta-outline:hover {
          background: rgba(247, 147, 30, 0.2) !important;
        }

        /* Right Links Grid */
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
        }

        .footer-links-column {
          min-width: 0;
        }

        .footer-heading {
          font-family: 'Noto Serif', serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #000000;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .dark .footer-heading {
          color: #ffffff;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-link {
          font-size: 0.85rem;
          color: #555555;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .dark .footer-link {
          color: #d1d5db;
        }

        .footer-link:hover {
          color: #f7931e;
        }

        /* Locations Section */
        .footer-locations {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 1px solid rgba(247, 147, 30, 0.2);
        }

        .location-section {
          margin-bottom: 24px;
        }

        .location-heading {
          font-family: 'Noto Serif', serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #000000;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .dark .location-heading {
          color: #ffffff;
        }

        .location-list {
          font-size: 0.8rem;
          color: #666666;
          line-height: 1.8;
        }

        .dark .location-list {
          color: #9ca3af;
        }

        /* Skyline - hidden on transparent bg */
        .footer-skyline {
          display: none;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .footer-links-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer-brand {
            max-width: 100%;
          }

          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .footer-content {
            padding: 40px 16px 30px;
          }

          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          .footer-cta {
            flex-direction: column;
          }

          .cta-call,
          .cta-outline {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
          }

          .footer-logo-text {
            font-size: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}

