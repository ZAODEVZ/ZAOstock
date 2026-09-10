import { paletteCss } from '@/content/design-kit';

// The palette as a file, built from the same list the /design page renders.
export const dynamic = 'force-static';

export function GET() {
  return new Response(paletteCss(), {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Content-Disposition': 'attachment; filename="zaostock-colours.css"',
    },
  });
}
