import { HandCoins } from 'lucide-react';

export function NotFound() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-12">
      <h1>Oops, this page doesn&apos;t exist</h1>
      <HandCoins className="w-52 h-52 md:w-60 md:h-60 stroke-[0.5]" />
    </div>
  );
}
