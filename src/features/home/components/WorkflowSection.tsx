import Container from '@/components/Layout/Container';

const steps = [
  'Browse preview photos',
  'Choose your favorite shot',
  'Send photo number via WhatsApp',
  'Receive edited result',
];

export default function WorkflowSection() {
  return (
    <section className="py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Workflow
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Simple & Fast Process
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-8"
            >
              <div className="mb-6 text-4xl font-black text-muted-foreground">
                0{i + 1}
              </div>

              <h3 className="text-xl font-semibold">
                {step}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}