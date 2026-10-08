/**
 * Makes the two ZAOstock 2026 feedback forms in your Google account.
 * Question set: ZAOOS research doc 2620 (events/2620-zaostock-feedback-form-questions, PR #3752).
 *
 * How (about 2 minutes, signed in as info@thezao.com):
 *   1. Go to script.google.com and click "New project".
 *   2. Delete what is in the editor and paste this whole file.
 *   3. Click Run (function: makeZaostockFeedbackForms). Allow access when Google asks:
 *      it needs to create forms in your Drive.
 *   4. Open "Execution log". It prints the edit and share links for both forms.
 *   5. Fill in both forms once on your phone and time it (doc 2620: test on two phones).
 *   6. Send the GUEST share link to the zaostock-content lane. It goes into FEEDBACK_FORM_URL
 *      in src/content/site.ts and zaostock.com/feedback switches to the form.
 *      The INSIDER link goes in your personal notes to the seven acts, crew and partners.
 *
 * 2026 RUN: Zaal ran this as info@thezao.com on 7 Oct 2026. It made
 *   GUEST   'How was ZAOstock?'  share id 1FAIpQLSdkwhmYVaMMIS_pKVoxFBG6SWgY4wsBVnFMP1rmqm0gyftOMg
 *   INSIDER 'ZAOstock: artists, crew and partners'  share id 1FAIpQLSdG9aKDpOo-587NnLFA8lsPWl6nkZBEVCkwZMk1PP-9WzgSMA
 * Workspace forms start restricted to the domain: switch off Settings > Responses >
 * 'Restrict to users in thezao.com' on both, or the public gets a sign-in wall.
 * For 2027: copy this file, update the dates and the act list.
 *
 * The forms sit in your Drive. Nobody finds them unless they have the share link.
 * Only the seven acts who played are named, and there is no future date.
 *
 * GUEST FORM ROUTE (Google Forms branches on a single-choice answer, at section ends):
 *   Section 1: how did you take part (required)
 *     -> In person: overall (required), vs expected, how long, ease grid (7 rows)
 *     -> Livestream: overall (required), vs expected, how much, stream grid
 *     -> Something else: overall (required), vs expected
 *     -> Played / crew / partner: link to the insider form, then submit
 *   Then everyone: who you caught, one thing to change, best part, come again
 *   Then: quote consent (required), first name and email (both optional)
 * Overall and vs expected are asked separately per route on purpose, so in-person and
 * stream answers land in separate columns and are never averaged together (doc 2620).
 */

var OVERALL = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
var VS_EXPECTED = [
  'Much worse than I expected',
  'A bit worse',
  'About what I expected',
  'A bit better',
  'Much better than I expected',
];
var CONSENT = [
  'Yes, with my first name',
  'Yes, without my name',
  'No, keep my words private and use my answers in counts only',
];
var NAME_TITLE = "First name (only if you chose 'with my first name')";
var EMAIL_TITLE = 'Email, only if you want to hear about the next one. If you are under 18, ask a parent first.';

function makeZaostockFeedbackForms() {
  var insider = makeInsiderForm_();
  var guest = makeGuestForm_(insider.getPublishedUrl());

  Logger.log('GUEST form edit link (yours): ' + guest.getEditUrl());
  Logger.log('GUEST form share link (for zaostock.com/feedback): ' + guest.getPublishedUrl());
  Logger.log('INSIDER form edit link (yours): ' + insider.getEditUrl());
  Logger.log('INSIDER form share link (for the acts, crew, partners): ' + insider.getPublishedUrl());
  [guest, insider].forEach(function (f) {
    try {
      Logger.log('Short link: ' + f.shortenFormUrl(f.getPublishedUrl()));
    } catch (e) {
      Logger.log('Short link not available; use the share link above.');
    }
  });
}

function addOverall_(form) {
  form.addMultipleChoiceItem()
    .setTitle('Overall, how was ZAOstock?')
    .setChoiceValues(OVERALL)
    .setRequired(true);
}

function addVsExpected_(form, title) {
  form.addMultipleChoiceItem()
    .setTitle(title)
    .setChoiceValues(VS_EXPECTED);
}

function addConsent_(form) {
  form.addMultipleChoiceItem()
    .setTitle('Can we quote what you wrote?')
    .setChoiceValues(CONSENT)
    .setRequired(true);
  form.addTextItem().setTitle(NAME_TITLE);
  form.addTextItem().setTitle(EMAIL_TITLE);
}

function makeGuestForm_(insiderUrl) {
  var form = FormApp.create('How was ZAOstock?');
  form.setDescription(
    'ZAOstock, Saturday 3 October 2026, Franklin Street Parklet, Ellsworth, Maine.\n' +
    'Two minutes if you skip the text boxes. Only three questions are required.'
  );
  form.setCollectEmail(false);
  form.setConfirmationMessage('Thank you. This shapes the next one. Replay: zaostock.com/live');

  // Section 1: the routing question.
  var role = form.addMultipleChoiceItem()
    .setTitle('How did you take part in ZAOstock?')
    .setRequired(true);

  // In person.
  var pInPerson = form.addPageBreakItem().setTitle('You were there');
  addOverall_(form);
  addVsExpected_(form, 'Compared with what you expected, how was the day?');
  form.addMultipleChoiceItem()
    .setTitle('How long did you stay on Franklin Street?')
    .setChoiceValues(['Under 30 minutes', '30 to 60 minutes', '1 to 2 hours', '2 to 4 hours', 'Most of the day']);
  form.addGridItem()
    .setTitle('How easy was each part of the day?')
    .setRows([
      'Finding ZAOstock and arriving',
      'Stopping to watch the music',
      'Finding somewhere to sit',
      'Restrooms',
      'Shelter from sun, wind or weather',
      'Visiting nearby shops, food or drink',
      'Walking to Black Moon at 6 PM for the after-party',
    ])
    .setColumns(['Easy', 'OK', 'Hard', 'Did not use or notice']);

  // Livestream.
  var pStream = form.addPageBreakItem().setTitle('You watched the livestream');
  addOverall_(form);
  addVsExpected_(form, 'Compared with what you expected, how was the stream?');
  form.addMultipleChoiceItem()
    .setTitle('How much of the livestream did you watch?')
    .setChoiceValues(['A few minutes', 'Under an hour', '1 to 2 hours', 'Most of it']);
  form.addGridItem()
    .setTitle('How was the stream?')
    .setRows(['The picture', 'The sound', 'Joining and finding the stream'])
    .setColumns(['Good', 'OK', 'Poor', 'Did not notice']);

  // Something else.
  var pOther = form.addPageBreakItem().setTitle('About the day');
  addOverall_(form);
  addVsExpected_(form, 'Compared with what you expected, how was the day?');

  // Played, crew, partners: send them to their own short form.
  var pInsider = form.addPageBreakItem()
    .setTitle('There is a shorter form just for you')
    .setHelpText(
      'Thank you for being part of ZAOstock. Artists, crew, partners and nearby businesses have ' +
      'their own form with different questions:\n' + insiderUrl + '\n\nPress Submit here, then open that link.'
    );

  // Everyone (guests) continues here.
  var pCommon = form.addPageBreakItem().setTitle('A few more');
  form.addCheckboxItem()
    .setTitle('Who did you catch?')
    .setChoiceValues([
      'The Crown Vics',
      'OPEN X',
      'Grass Rug',
      'Michael Anderson',
      'DCoop',
      'LyonsDen Rez Muzik',
      'Tom Fellenz',
      'The after-party at Black Moon',
    ]);
  form.addParagraphTextItem().setTitle('What is one thing we should do differently next time?');
  form.addTextItem().setTitle('What was the best part of the day?');
  form.addMultipleChoiceItem()
    .setTitle('Would you come to the next ZAOstock?')
    .setChoiceValues(['Yes', 'Maybe', 'No']);

  form.addPageBreakItem().setTitle('Last one');
  addConsent_(form);

  // Routing. A page break's setGoToPage decides where the section BEFORE it goes on.
  pStream.setGoToPage(pCommon);   // end of In person -> A few more
  pOther.setGoToPage(pCommon);    // end of Livestream -> A few more
  pInsider.setGoToPage(pCommon);  // end of About the day -> A few more
  pCommon.setGoToPage(FormApp.PageNavigationType.SUBMIT); // end of the insider page -> submit

  role.setChoices([
    role.createChoice('I was there in person on Franklin Street', pInPerson),
    role.createChoice('I only watched the livestream', pStream),
    role.createChoice('I played, or I was on the crew or a volunteer', pInsider),
    role.createChoice('I am a partner or sponsor, or I run a business nearby', pInsider),
    role.createChoice('Something else', pOther),
  ]);

  return form;
}

function makeInsiderForm_() {
  var form = FormApp.create('ZAOstock: artists, crew and partners');
  form.setDescription(
    'For the people who made ZAOstock happen on Saturday 3 October 2026. ' +
    'Same idea as an after-action review: what you expected, what happened, what to keep, what to change.'
  );
  form.setCollectEmail(false);
  form.setConfirmationMessage('Thank you. Zaal reads every one of these.');

  form.addMultipleChoiceItem()
    .setTitle('Which best describes you?')
    .setChoiceValues(['I played', 'I was on the crew or a volunteer', 'I am a partner or sponsor', 'I run a business nearby', 'Other'])
    .setRequired(true);
  addVsExpected_(form, 'Compared with what you expected before the day, how did ZAOstock go for you?');
  form.addParagraphTextItem().setTitle('What was different from what you expected, good or bad?');
  form.addParagraphTextItem().setTitle('What should we keep exactly as it was?');
  form.addParagraphTextItem().setTitle('What should we change before next time?');
  form.addMultipleChoiceItem()
    .setTitle('Did ZAOstock change your day or your business?')
    .setChoiceValues(['More people than usual came by', 'No change', 'It was harder than usual', 'Not sure', 'Does not apply to me']);
  form.addMultipleChoiceItem()
    .setTitle('Would you take part again next time?')
    .setChoiceValues(['Yes', 'Maybe', 'No']);
  addConsent_(form);

  return form;
}
