import { default as TaskTable } from '@/components/home';

export function Home() {
  return (
    <div className="flex w-full h-full flex-1 flex-col space-y-8 p-8 md:p-10">
      <TaskTable />
    </div>
  );
}
