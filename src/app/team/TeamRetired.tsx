import { SITE } from '@/content/site';
import { TEAM_DOC_URL, TEAM_RETIRED_MESSAGE } from '@/lib/team-status';
import { SiteShell, Section, Eyebrow, Button } from '@/components/poster';

// What every /team/* page renders while the dashboard is retired
// (src/lib/team-status.ts). No login form, no roster, no codes.
export function TeamRetired({ what }: { what?: string }) {
  return (
    <SiteShell>
      <Section first>
        <div className="max-w-[640px] py-12">
          <Eyebrow tone="denim">ZAOstock team</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-4">This moved into the document.</h1>
          <p className="text-lg text-ink-secondary mt-4 measure">
            {TEAM_RETIRED_MESSAGE}
            {what ? ` ${what}` : ''} The 4-letter codes no longer work, and nothing here is lost: the plan, the run of show and the roster live in the working document, and the festival facts live on the public pages.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {TEAM_DOC_URL !== 'UNSET' ? (
              <Button href={TEAM_DOC_URL} external variant="primary">
                Open the working document
              </Button>
            ) : (
              <Button href={`mailto:${SITE.contact}?subject=ZAOstock%20working%20document`} external variant="primary">
                Ask for the document link
              </Button>
            )}
            <Button href="/program" variant="secondary">
              The program
            </Button>
            <Button href="/build" variant="secondary">
              Build on ZAOstock
            </Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
