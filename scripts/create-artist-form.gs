/**
 * ZAOstock 2026 - creates the artist details Google Form in one run.
 *
 * HOW TO USE
 *   1. script.google.com -> New project
 *   2. Paste this whole file over the default Code.gs
 *   3. Run -> createZaostockArtistForm
 *   4. Approve the permission prompt (it only creates a Form and a Sheet)
 *   5. The editor and public URLs are printed to the Execution log
 *
 * WHY THERE IS NO FILE-UPLOAD QUESTION
 *   Apps Script cannot ADD a file-upload item (FILE_UPLOAD can be read but not
 *   created), and Google Forms uploads additionally require every respondent to
 *   be signed into a Google account, with the files landing in the form owner's
 *   Drive. Two of the acts appear in zero files anywhere in our records, so
 *   a Google sign-in wall would silently lose exactly the acts we can least
 *   afford to lose. This form asks for a photo LINK and offers an email fallback.
 *
 *   To add a real upload box anyway: open the form, click +, choose "File
 *   upload". That works in the UI even though the API will not do it. Keep the
 *   link question as well, as the fallback for acts with no Google account.
 */

// No due date (Zaal, 2026-09-10: "just dont make it due on a date no later
// than 18 th"). It was the Friday before the first posts. The live form carries no date.
var ASK = 'as soon as you can';
var EVENT = 'ZAOstock, Saturday 3 October 2026, Franklin Street Parklet, Ellsworth';

// Locked from the 3 September running order. Do NOT re-ask acts for these.
// EIGHT since 2026-09-10, bare names: the live form was edited by hand that day
// to drop Hurricane and the set times, and Zaal's standing rule is always
// "Acadia Rising", never the long form. This list mirrors the live dropdown.
// A response filed before the edit carries the OLD text ("DCoop - 3:45 PM,
// 40 min"), so anything reading responses must accept both shapes.
var ACTS = [
  'The Crown Vics',
  'OPEN X',
  'Grass Rug',
  'Acadia Rising',
  'Michael Anderson',
  'DCoop',
  'Lyons Den',
  'Fellenz',
];

function createZaostockArtistForm() {
  var form = FormApp.create('ZAOstock 2026 - Artist Details');

  // THE FORM IS THE CONTRACT (Zaal, 2026-09-11: "Lets say the google form is
  // the contract include anything we would need"). No separate contract goes
  // out, so the terms live here, at the top, and the last question is the
  // agreement. MONEY IS LEFT OUT on purpose (his pick): no fee, no dollar
  // figure, not even the meal certificate's value.
  form.setDescription(
    "You're on the bill for " + EVENT + '. This form is your agreement to ' +
    'play. Fill it in ' + ASK + '. Your set time and length are at ' +
    'zaostock.com/program.\n\n' +
    'THE TERMS\n' +
    '- Soundcheck: Friday 2 October, 4 PM to 7 PM, on the parklet stage. Every ' +
    'act, and there is no Saturday alternative. Saturday morning is a line check only.\n' +
    '- Saturday: on site by 10 AM. Sets start on time. If your set runs over, it ' +
    'comes out of your own changeover, and the next act still starts on time.\n' +
    '- Gear: we provide the stage and a shared PA. Your instruments and gear are ' +
    'your responsibility on the day. Anything else you need, ask below; until we ' +
    'confirm an item to you in writing, assume you bring it.\n' +
    '- Filming: we livestream the day and film, record and photograph every set. ' +
    'You answer that one below.\n' +
    '- Hospitality: water at the stage, a Black Moon gift certificate to eat ' +
    'after your set, and a dressing room with a bathroom in the Black Moon basement.\n\n' +
    'Submitting this form is what puts you on the public lineup. We publish ' +
    'nobody who has not confirmed in writing.'
  );

  form.setCollectEmail(true);
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage(
    'Got it - thank you. That confirms you are playing on the terms in this ' +
    'form and puts you on the public lineup. If you sent a photo link, we will ' +
    'check we can open it. Any problem, write to info@thezao.com.'
  );

  form.addListItem()
    .setTitle('Which act are you?')
    // Set times live in ONE public place, /program (Zaal, 2026-09-10). The form
    // points there and never repeats a time, so the two cannot disagree.
    .setHelpText('Your set time and length are at zaostock.com/program.')
    .setChoiceValues(ACTS)
    .setRequired(true);

  // The live form also carries "Does your set length work?", added by hand on
  // 2026-09-10 (its "5 to 10 minutes longer" option removed: the day has 14
  // minutes of margin). It is not recreated here.

  form.addTextItem()
    .setTitle('A link to your photo')
    .setHelpText(
      'One good press shot, landscape if you have it, highest resolution you ' +
      'have. Google Drive, Dropbox, WeTransfer, an Instagram post, anything we ' +
      'can open. THIS IS THE ONE WE CANNOT MAKE OURSELVES. No link handy? ' +
      'Write "emailing it" here and send it to info@thezao.com.'
    )
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('A short bio')
    .setHelpText(
      '2 to 4 sentences. Who you are, what you sound like, anything you want ' +
      'people to know before they hear you.'
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('Your city / where you are based')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Your links')
    .setHelpText(
      'Instagram, Bandcamp, Spotify, website, whatever you want people to find. ' +
      'Send them all, we will pick.'
    )
    .setRequired(true);

  // A question rather than a forced yes, so an act with a genuine conflict
  // flags it instead of abandoning the form.
  form.addMultipleChoiceItem()
    .setTitle('Soundcheck is Friday 2 October, 4 PM to 7 PM. Can you be there?')
    .setHelpText('It covers every act and there is no Saturday alternative.')
    .setChoiceValues([
      'Yes, I can be there Friday 2 October, 4 PM to 7 PM',
      'I have a problem with Friday - please get in touch',
    ])
    .setRequired(true);

  // Zaal, 2026-09-10: "we need a check mark for the artists to say we can
  // livestream their performance and use in future content". A choice rather
  // than a lone required tick, so an act that wants to talk first can still
  // submit everything else instead of abandoning the form.
  form.addMultipleChoiceItem()
    .setTitle('Filming, photos and livestream')
    .setHelpText(
      'We livestream the day and film, record and photograph every set, ' +
      'including the Friday soundcheck. This lets us share yours, live and afterwards.'
    )
    .setChoiceValues([
      'Yes, ZAOstock and The ZAO can livestream, film, record and photograph my set and use it in future content',
      "Let's talk first",
    ])
    .setRequired(true);

  // THE TECH RIDER, folded in (Zaal, 2026-09-11: "Ask for rider things"). It
  // was a separate email due Friday 18 September; the same four questions are
  // asked here instead, so there is one thing to fill in, not two.
  form.addSectionHeaderItem()
    .setTitle('Your tech rider')
    .setHelpText('So the stage is ready for you. Write "nothing" where nothing applies.');

  form.addParagraphTextItem()
    .setTitle('Who is on stage, and how many people are with you in total?')
    .setHelpText('Names and what each person plays. The total sets the meals and the dressing-room space.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('What do you plug in?')
    .setHelpText('Every instrument and voice that needs to go through the PA.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('What do you bring?')
    .setHelpText('Amps, drums, keyboards, stands, anything you carry on.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('What do you need from us?')
    .setHelpText('Beyond the stage and the shared PA. Until we confirm an item to you in writing, assume you bring it.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('When do you arrive in Ellsworth, and where from?')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Will you have merch to sell?')
    .setChoiceValues(['Yes', 'No'])
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Anything you would like after the event?')
    .setHelpText('A recording of your set, photos, a clip for your socials. Tell us and we will do what we can.')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Any questions for us?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Anything else we should know?')
    .setHelpText('Access needs, a name spelling, someone else who handles your bookings. Optional.')
    .setRequired(false);

  // Last, so it is agreed after everything above has been read.
  form.addCheckboxItem()
    .setTitle('Your agreement')
    .setChoiceValues(['Yes, I am playing ZAOstock on Saturday 3 October 2026, on the terms at the top of this form'])
    .setRequired(true);

  var sheet = SpreadsheetApp.create('ZAOstock 2026 - Artist Details (responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('EDIT the form:  ' + form.getEditUrl());
  Logger.log('SEND this link: ' + form.getPublishedUrl());
  Logger.log('Responses:      ' + sheet.getUrl());
}
