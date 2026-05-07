# ZAO Festivals Sponsor Finders + Management Fee Structure

> **Status:** Locked 2026-05-07. Per Zaal + Rav call discussion.
> **Audience:** Anyone on the ZAO Festivals team who brings or runs a sponsor relationship.
> **Why this exists:** Removes Zaal as the bottleneck on sponsor pipeline. Compensates teammates fairly for the work of bringing AND running sponsorships.

## TL;DR

| You bring a sponsor | You also manage them | Total to you |
|---|---|---|
| Yes | No | **5%** finders fee |
| No | Yes | **10%** management fee |
| Yes | Yes | **15%** combined |

Of any sponsor dollar amount you cause to flow into ZAO Festivals.

## Definitions

**Bringing a sponsor** = you make the introduction or referral that gets us the first meeting. That is the moment the lead becomes ours. If we close them later, you earn the 5% finders fee on the committed amount.

**Managing a sponsor** = you are the named point of contact inside ZAO Festivals for that sponsor through the event. Includes: shipping them what they need (logos, partner agreements, day-of asks), keeping them informed, making sure they get what was promised on day-of, and post-event recap delivery. If you sustain that role through the event, you earn the 10% management fee.

**Closing the sponsor** = signed agreement + funds received. Fees are calculated on the committed amount, paid out on actual amounts received.

## Worked examples

**Example 1 - You bring, someone else runs**
You introduce ZAO to Bangor Savings. They commit $1,000. Someone else on the Finance circle manages the relationship through the event.
- Your finders fee: $50 (5% of $1,000)
- Manager's fee: $100 (10% of $1,000)
- ZAO Festivals: $850 (85% of $1,000)

**Example 2 - You bring AND run**
You introduce ZAO to a local brewery and own the relationship through Oct 3. They commit $2,500.
- Your combined fee: $375 (15% of $2,500)
- ZAO Festivals: $2,125 (85% of $2,500)

**Example 3 - You only manage**
Zaal brings a connection. You volunteer to be the named POC + run the relationship.
- Your management fee: 10% of whatever they commit

## Fee timing

Fees are recognized when funds are received by ZAO Festivals (or the appropriate fiscal infrastructure for tax-deductible support). Paid out within 14 days of receipt.

## How this fits with fiscal sponsorship

These finders + management fees are **separate project costs** built into the event budget. They are NOT pulled from the New Media Commons / Fractured Atlas overhead. NMC overhead is the cost of legal and fiscal infrastructure (no profit going to anyone). Our team fees are a separate budget line. Both add up and are accounted for cleanly per-deal.

When a live sponsor lead lands, we map the per-deal flow: gross amount → NMC infrastructure cost → ZAO Festivals project budget → finders/management fees → remaining for festival production (artists, vendors, venue). This is on a per-deal basis to make sure the math works for everyone.

## Caps and edge cases

- **Multiple finders for the same sponsor:** if more than one person can plausibly claim "I brought them," Zaal makes the call before fees are calculated. Earliest verifiable touchpoint usually wins.
- **Re-engaged sponsors:** if a sponsor we worked with in Year 1 (PALOOZA / CHELLA) returns for Year 2 because of someone's effort, that person earns the finders fee for Year 2. Year 1 finders fee does not transfer.
- **Multi-year deals:** finders fee is paid on the first year's commit only. Management fee is paid annually as long as you continue to manage.
- **Below $500:** for sponsorships under $500, no fees are paid - the goal there is community-building, not financial transaction.

## Documentation

For each sponsor that triggers a finders or management fee, we record:
- Name of the introducer (finders fee recipient)
- Name of the manager (management fee recipient, if different)
- Committed amount and date
- Received amount and date
- Fee paid amount and date

This lives in the `sponsors` table on ZAO STOCK Supabase. Ask the Finance circle to surface a quarterly fee report to the team.

## Updates

Locked 2026-05-07 by Zaal. Revisable if the structure breaks for a specific deal — we will adjust on a case-by-case basis and re-publish a v2 here when we have enough data points.
