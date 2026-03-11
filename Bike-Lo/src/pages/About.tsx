export default function About() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <h1
          className="text-4xl font-bold text-black dark:text-white mb-2"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          About Bike-Lo
        </h1>
        <p className="text-muted-foreground mb-10">
          India’s trusted omni-channel platform for two-wheelers
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Bike-Lo is a trusted omni-channel platform built to transform the way India buys, sells,
            and maintains two-wheelers.
          </p>

          <p>
            Founded with a vision to create an honest, transparent, and stress-free mobility
            ecosystem, Bike-Lo was born from real market experience and a deep understanding of
            customer challenges. We eliminate hidden costs, unclear documentation, and unreliable
            vehicles by offering verified products, fair pricing, and complete end-to-end support.
          </p>

          <p>
            Starting with a small team and strong determination, we grew by putting customers first,
            personally inspecting every vehicle, and delivering consistent quality. Today, Bike-Lo
            offers verified vehicles, digital solutions, finance, insurance, servicing, and
            accessories — all under one roof.
          </p>

          <p>
            Driven by trust, powered by technology, and guided by strong values, we are building
            India’s most reliable two-wheeler ecosystem for working families and everyday riders.
          </p>

          <p>
            At Bike-Lo, we don’t just deliver bikes — we deliver confidence, peace of mind, and
            joy.
          </p>

          <p
            className="text-xl font-semibold text-black dark:text-white pt-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Bike-Lo — Happiness, Home Delivered.
          </p>
        </div>
      </div>
    </div>
  );
}
