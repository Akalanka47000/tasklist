import { afterEach, expect, it } from 'vitest';
import { default as TaskTable, testIds } from '@/components/home';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { renderWithProviders, wait } from '../__utils__';

afterEach(cleanup);

it('open add task dialog when clicked on button', async () => {
  renderWithProviders(<TaskTable />);
  expect(screen.queryByTestId(testIds.createDialog)).toBeNull();
  fireEvent.click(screen.getByTestId(testIds.createButton));
  await wait();
  const createDialog = screen.getByTestId(testIds.createDialog);
  expect(createDialog).toBeDefined();
  expect(createDialog.textContent).toContain('Add Task');
  expect(
    within(createDialog)
      .getAllByRole('button')
      .find((btn) => btn.getAttribute('type') === 'submit')
      ?.hasAttribute('disabled')
  ).toBe(true);
  const cancelButton = within(createDialog)
    .getAllByRole('button')
    .find((btn) => btn.textContent?.includes('Cancel'));
  expect(cancelButton).toBeDefined();
  fireEvent.click(cancelButton!);
  expect(screen.queryByTestId(testIds.createDialog)).toBeNull();
});
