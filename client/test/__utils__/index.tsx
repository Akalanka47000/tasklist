import { MemoryRouter } from 'react-router-dom';
import { default as Providers } from '@/providers';
import { render } from '@testing-library/react';

export const renderWithProviders = (ui: React.ReactNode | React.ReactNode[]) => {
  render(
    <Providers>
      <MemoryRouter>{ui}</MemoryRouter>
    </Providers>
  );
};

/**
 * @description Waits for some ui updates to complete
 */
export const wait = (duration = 100) => new Promise((resolve) => setTimeout(resolve, duration));
