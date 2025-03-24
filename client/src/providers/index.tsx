import { default as QueryClientProvider } from './query-client';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
