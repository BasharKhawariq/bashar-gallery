import Container from '@/components/Layout/Container';
import { Card } from '@/components/ui/card';

const steps = [
  'Browse preview photos',
  'Choose your favorite shot',
  'Send photo number via WhatsApp',
  'Receive edited result',
];

export default function WorkflowSection() {
  return (
    <section className="py-24 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Workflow</p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Simple & Fast Process
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={step}
              className="rounded-3xl bg-card/70 p-8 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-ring/20"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-black text-foreground">
                0{index + 1}
              </div>

              <h3 className="text-xl font-semibold leading-snug">{step}</h3>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
