import Container from '@/components/Layout/Container';

export default function HeroSection() {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden border-b border-border bg-background pb-20 pt-28">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background dark:from-black/70 dark:via-black/55 dark:to-background" />

        <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute bottom-10 right-[-8%] h-96 w-96 rounded-full bg-accent/25 blur-3xl" />

        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop"
          alt="Hero Background"
          className="h-full w-full object-cover opacity-60 dark:opacity-40"
        />
      </div>

      <Container className="relative z-20">
        <div className="max-w-4xl">
          <div className="rounded-3xl border border-border/60 bg-background/70 p-8 backdrop-blur-xl md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Automotive Event Preview Platform
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] text-foreground md:text-7xl lg:text-8xl">
              CAPTURING
              <br />
              YOUR
              <br />
              MOMENTS
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Browse rolling shots, pick your favorite frame, and request polished edits directly
              via WhatsApp with a cleaner preview flow.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#events"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                Explore Events
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 px-8 py-4 font-semibold text-foreground backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
