import { ARTIST_FORM, artistFormUrl, type OpsAct } from '@/content/artist-ops';
import { Button, Eyebrow } from '@/components/poster';

// The form, embedded, with the full link beside it. The link is not decoration:
// some phones and privacy browsers refuse third-party frames, and the frame
// failing must never be the reason an act does not reply.
export function ArtistForm({ act }: { act?: OpsAct }) {
  return (
    <div className="space-y-4" id="form">
      <Eyebrow>The artist details form</Eyebrow>
      <p className="text-sm text-ink-secondary m-0">
        Due {ARTIST_FORM.dueLabel}. No login and no code needed.
        {act ? ` Your act is already picked in the first question.` : ''} If the form does not show below,
        open it in its own tab - it is the same form.
      </p>
      <div>
        <Button href={artistFormUrl({ act })} external size="sm">
          Open the form
        </Button>
      </div>
      <iframe
        src={artistFormUrl({ act, embedded: true })}
        title="ZAOstock 2026 artist details form"
        className="w-full rounded-md border-[2.5px] border-ink-950 bg-paper-100"
        style={{ height: '2200px' }}
        loading="lazy"
      >
        Loading the form. If nothing appears, use the Open the form button.
      </iframe>
    </div>
  );
}
