import Container from '../Container';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-lg font-bold tracking-wide text-foreground">
              BASHAR GALLERY
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Automotive Event Preview Platform
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              © 2026 Bashar Gallery. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}