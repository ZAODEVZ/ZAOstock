import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import VolunteerPage from './page';
import { IN_PERSON, VIRTUAL } from '@/content/volunteer-slots';

describe('/volunteer tables', () => {
  it('gives each table a caption and each column header a scope', () => {
    const html = renderToStaticMarkup(createElement(VolunteerPage));
    const days = [...IN_PERSON, ...VIRTUAL];

    for (const day of days) {
      expect(html).toContain(`<caption class="sr-only">${day.title} volunteer roles and signup counts</caption>`);
    }

    expect(html.match(/<caption class="sr-only">/g)).toHaveLength(days.length);
    expect(html.match(/<th scope="col"/g)).toHaveLength(days.length * 4);
  });
});
