import { createHash } from 'node:crypto';
import { expect, type Page, test } from '@playwright/test';

/**
 * ai-chat Slice 5: the chat remote, composed into the shell, against a routed
 * `/api/chat`. Bedrock is never called; the route answers with the NDJSON the
 * Lambda would stream (D11), so the suite runs the same locally and against a
 * deployed site.
 */

const ndjson = (...events: object[]): string =>
  events.map((event) => `${JSON.stringify(event)}\n`).join('');

const openAndAsk = async (page: Page, question: string): Promise<void> => {
  await page.getByRole('button', { name: 'Open AI chat' }).click();
  const dialog = page.getByRole('dialog', { name: 'Chat' });
  await dialog.getByRole('textbox', { name: 'Message' }).fill(question);
  await dialog.getByRole('button', { name: 'Send' }).click();
};

test.describe('the AI chat', () => {
  // The chat is disconnected for now (`apps/shell/src/routes/__root.tsx`), so
  // there is no launcher to open. Remove this line when it is reconnected.
  test.skip(true, 'the AI chat is disconnected from the shell for now');

  test('"show me your work" closes the drawer and brings #work into view', async ({ page }) => {
    const bodies: { body: string; hash: string | undefined }[] = [];
    await page.route('**/api/chat', async (route) => {
      const request = route.request();
      bodies.push({
        body: request.postData() ?? '',
        hash: request.headers()['x-amz-content-sha256'],
      });
      await route.fulfill({
        contentType: 'application/x-ndjson',
        body: ndjson(
          { type: 'text-delta', text: 'Here is his selected work.' },
          { type: 'tool-call', name: 'scroll_to', input: { sectionId: 'work' } },
          { type: 'done' }
        ),
      });
    });
    await page.goto('/');

    await openAndAsk(page, 'Show me your work');

    await expect(page.getByRole('dialog', { name: 'Chat' })).toHaveCount(0);
    await expect(page.locator('#work')).toBeInViewport();
    // D24: the body hash Lambda's OAC checks, over the exact bytes sent.
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.hash).toBe(
      createHash('sha256')
        .update(bodies[0]?.body ?? '')
        .digest('hex')
    );
  });

  test('a WAF challenge page instead of a reply shows the error, with a retry that works', async ({
    page,
  }) => {
    let calls = 0;
    await page.route('**/api/chat', async (route) => {
      calls += 1;
      await (calls === 1
        ? route.fulfill({ status: 202, contentType: 'text/html', body: '<html></html>' })
        : route.fulfill({
            contentType: 'application/x-ndjson',
            body: ndjson({ type: 'text-delta', text: 'He builds front ends.' }, { type: 'done' }),
          }));
    });
    await page.goto('/');

    await openAndAsk(page, 'Who is he?');
    const dialog = page.getByRole('dialog', { name: 'Chat' });
    await dialog.getByRole('button', { name: 'Try again' }).click();

    await expect(dialog.getByText('He builds front ends.')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Try again' })).toHaveCount(0);
  });
});
