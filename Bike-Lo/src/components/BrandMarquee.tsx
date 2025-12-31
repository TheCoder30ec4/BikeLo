export default function BrandMarquee() {
  // Partner logos array with external image URLs
  const partners = [
    { 
      id: 1, 
      src: "https://i.ibb.co/N92D9G3/Screenshot-2020-10-20-My-Brand-New-Logo-My-Brand-New-Logo-Logo-design-proposals-removebg-preview.png",
      alt: "Partner Logo 1"
    },
    { 
      id: 2, 
      src: "https://i.ibb.co/G31gG9y/Screenshot-2020-10-20-My-Brand-New-Logo-My-Brand-New-Logo-Create-a-logo-removebg-preview.png",
      alt: "Partner Logo 2"
    },
    { 
      id: 3, 
      src: "https://i.ibb.co/jkSTBVP/Screenshot-2020-10-20-My-Brand-New-Logo-My-Brand-New-Logo-Logo-design-proposals-2-removebg-preview.png",
      alt: "Partner Logo 3"
    },
    { 
      id: 4, 
      src: "https://i.ibb.co/KNFTLHv/Screenshot-2020-10-20-My-Brand-New-Logo-My-Brand-New-Logo-Logo-design-proposals-1.png",
      alt: "Partner Logo 4"
    },
    { 
      id: 5, 
      src: "https://i.ibb.co/G31gG9y/Screenshot-2020-10-20-My-Brand-New-Logo-My-Brand-New-Logo-Create-a-logo-removebg-preview.png",
      alt: "Partner Logo 5"
    },
    { 
      id: 6, 
      src: "https://i.ibb.co/N92D9G3/Screenshot-2020-10-20-My-Brand-New-Logo-My-Brand-New-Logo-Logo-design-proposals-removebg-preview.png",
      alt: "Partner Logo 6"
    },
  ];

  return (
    <section id="ourclients" className="py-4 sm:py-5 lg:py-6 px-4 sm:px-6 lg:px-8 clients-section">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="clients-header">
          <h3 className="clients-title">Our Partners</h3>
        </div>

        {/* Clients Wrap */}
        <div className="clients-wrap">
          <ul className="clients-track">
            {/* First set of logos */}
            {partners.map((partner, index) => (
              <li key={`first-${partner.id}-${index}`} className="client-item">
                <img 
                  src={partner.src} 
                  alt={partner.alt}
                  className="client-logo"
                />
              </li>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <li key={`second-${partner.id}-${index}`} className="client-item">
                <img 
                  src={partner.src} 
                  alt={partner.alt}
                  className="client-logo"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .clients-section {
          position: relative;
          background: transparent;
          margin-top: 0;
        }

        .dark .clients-section {
          background: transparent;
        }

        .clients-header {
          text-align: center;
          margin-bottom: 16px;
        }

        .clients-title {
          display: inline-block;
          border-bottom: 2px solid #f7931e;
          padding: 8px 16px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
          font-family: 'Noto Serif', serif;
        }

        .dark .clients-title {
          color: #f3f4f6;
        }

        .clients-wrap {
          display: block;
          width: 100%;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(247, 147, 30, 0.2);
          padding: 12px 0;
        }

        .dark .clients-wrap {
          border: 1px solid rgba(247, 147, 30, 0.3);
        }

        .clients-track {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          animation: scroll-clients 20s linear infinite;
          width: fit-content;
        }

        .clients-section:hover .clients-track {
          animation-play-state: paused;
        }

        .client-item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 160px;
          height: 70px;
          line-height: 70px;
          text-align: center;
          margin: 0 10px;
          border: 1px solid rgba(247, 147, 30, 0.3);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
        }

        .dark .client-item {
          border: 1px solid rgba(247, 147, 30, 0.4);
          background: rgba(0, 0, 0, 0.1);
        }

        .client-item:hover {
          border-color: #f7931e;
          background: rgba(247, 147, 30, 0.05);
        }

        .client-logo {
          vertical-align: middle;
          max-width: 100%;
          width: 110px;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .client-item:hover .client-logo {
          transform: scale(1.1);
        }

        @keyframes scroll-clients {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .client-item {
            width: 140px;
            height: 60px;
            margin: 0 8px;
          }
          .client-logo {
            width: 90px;
          }
          .clients-title {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .client-item {
            width: 120px;
            height: 50px;
            margin: 0 6px;
          }
          .client-logo {
            width: 75px;
          }
          .clients-title {
            font-size: 1rem;
          }
        }

        /* Performance optimizations */
        .clients-track {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}

