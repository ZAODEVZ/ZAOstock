import { Card, Button } from '@/components/poster';

interface InstagramLinksProps {
  /** Full Instagram permalink + a one-line label for the card. */
  posts: { url: string; label: string }[];
}

/**
 * Link-out cards to Instagram posts, deliberately NOT an embed.
 *
 * This page used to load Instagram's own embed.js and render each post
 * inline via a <blockquote> it rewrites into an iframe. Verified on
 * production 2026-09-21: the iframes render, but their content comes back
 * 400/404 and the page shows two blank white boxes where the recap should
 * be - Instagram's anonymous, logged-out embed flow has been breaking
 * across the web since third-party cookie restrictions tightened, and
 * there is no fix available from this side of the embed (no API token,
 * no server we control). A broken-but-invisible failure is worse than an
 * honest link, so this replaces the embed with a plain card that says
 * what the post is and sends people to Instagram to watch it.
 */
export function InstagramLinks({ posts }: InstagramLinksProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <Card key={post.url}>
          <p className="text-sm text-ink-950 m-0">{post.label}</p>
          <div className="mt-4">
            <Button href={post.url} external variant="secondary" size="sm">
              Watch on Instagram
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
