const LOTTIE_EMBED_URL =
  "https://lottie.host/embed/44880ce5-872c-4948-b6e0-e6a0ce47c1eb/chTm3Axle7.lottie";

export default function Service() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1
          className="text-4xl font-bold mb-2 text-black dark:text-white"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          Bike Service
        </h1>
        <p className="text-muted-foreground mb-10">
          Professional bike maintenance and repairs.
        </p>

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <iframe
            src={LOTTIE_EMBED_URL}
            title="Bike Service animation"
            className="w-full border-0 rounded-lg"
            style={{ minHeight: 400 }}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
