import HeroSection from '@/features/home/components/HeroSection';
import RecentEvents from '@/features/home/components/RecentEvents';
import WorkflowSection from '@/features/home/components/WorkflowSection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <RecentEvents />

      <WorkflowSection />
    </>
  );
}
