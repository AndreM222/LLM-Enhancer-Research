import { Projects } from '@/components/project-cards';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 sm:items-start">
        <Projects />
      </main>
    </div>
  );
}
