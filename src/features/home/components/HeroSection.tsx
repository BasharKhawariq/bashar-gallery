import Container from '@/components/Layout/Container';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-border bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60 dark:bg-black/50 z-10" />

        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop"
          alt="Hero Background"
          className="h-full w-full object-cover"
        />
      </div>

      <Container className="relative z-20">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm uppercase tracking-[0.4em] text-zinc-300">
            Automotive Event Preview Platform
          </p>

          <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
            CAPTURING
            <br />
            SUNMORI
            <br />
            MOMENTS
          </h1>

          <p className="mt-8 max-w-xl text-lg text-zinc-300">
            Browse your rolling shots, choose your favorite frame,
            and request high quality edits directly via WhatsApp.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#events"
              className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-[1.02]"
            >
              Explore Events
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Instagram
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}