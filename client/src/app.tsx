import { Layout, Toaster } from '@/components';
import Pages from './pages';
import Providers from './providers';

function App() {
  return (
    <>
      <Providers>
        <Layout>
          <Pages />
        </Layout>
      </Providers>
      <Toaster
        richColors
        theme="light"
        closeButton
        toastOptions={{
          duration: 4 * 1000,
          classNames: {
            toast: 'group group-[.toaster]:pointer-events-auto'
          }
        }}
      />
    </>
  );
}

export default App;
