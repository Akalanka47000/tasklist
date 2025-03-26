import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/common/layout/header';
import { authService } from '@/services';
import { cleanup, screen } from '@testing-library/react';
import { mockCurrentUserResponse } from '../__mocks__';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

describe('render header', () => {
  it('with login button when not logged in', async () => {
    renderWithProviders(<Header />);

    await wait();
    expect(screen.getAllByRole('button').find((btn) => btn.textContent?.includes('Login'))).toBeDefined();

    expect(screen.getAllByRole('button').find((btn) => btn.textContent?.includes('Logout'))).toBeUndefined();
  });
  it('with logout button when logged in', async () => {
    vi.spyOn(authService, 'current').mockResolvedValue(mockCurrentUserResponse);
    renderWithProviders(<Header />);

    await wait();
    expect(screen.getAllByRole('button').find((btn) => btn.textContent?.includes('Login'))).toBeUndefined();
    expect(screen.getAllByRole('button').find((btn) => btn.textContent?.includes('Logout'))).toBeDefined();
  });
});
