import { SiteShell, Section, SectionHeader, Card } from '@/components/poster';
import { SITE } from '@/content/site';
import { ArtistForm } from '../ArtistForm';

// A wrong or mistyped code. The background stays hidden, but the form never
// needed a code, so it is offered here too: a typo in a link must not be the
// reason an act does not reply.
export default function BackstageNotFound() {
  return (
    <SiteShell>
      <Section first className="pt-10 sm:pt-14">
        <div className="max-w-[760px] space-y-6">
          <SectionHeader
            as="h1"
            eyebrow="Backstage"
            title="That link does not match an act."
            lede={
              <>
                Check it against the message we sent, or email{' '}
                <a href={`mailto:${SITE.contact}`} className="underline">{SITE.contact}</a>. The form below does not
                need a code.
              </>
            }
          />
          <Card>
            <ArtistForm />
          </Card>
        </div>
      </Section>
    </SiteShell>
  );
}
