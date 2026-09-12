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

  form.setDescription(
    "You're on the bill for " + EVENT + ".\n\n" +
    'We announce the full lineup this weekend with a post about each artist. ' +
    'We need four things from you ' + ASK + ': a photo, a short bio, ' +
    'your city, and your links.\n\n' +
    'IMPORTANT: submitting this form is what puts you on the public lineup. ' +
    'We do not publish anyone who has not confirmed in writing, so if we do not ' +
    'hear from you, you will not appear on the site even though you are on the ' +
    'running order.\n\n' +
    'Also please note the SOUNDCHECK RUNS 4PM TO 7PM ON FRIDAY 2 OCTOBER, the ' +
    'night before the show. It covers every act and there is no Saturday ' +
    'alternative - Saturday morning is a line check only. A contract with the ' +
    'full terms follows separately; this form is just the four things plus a ' +
    'yes or no on the Friday.'
  );

  form.setCollectEmail(true);
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage(
    'Got it - thank you. That confirms you are playing and puts you on the ' +
    'public lineup. If you sent a photo link, we will check we can open it. ' +
    'Any problem, reply to the email that sent you here.'
  );

  form.addListItem()
    .setTitle('Which act are you?')
    // Set times are NOT public any more (Zaal, 2026-09-12: "no set times listed
    // publicly"), which reversed the 2026-09-10 call to point here at /program.
    // Each act has its own page, and the form points at that instead.
    .setHelpText('Your set time and length are on your own ZAOstock page, the link in the message we sent you.')
    .setChoiceValues(ACTS)
    .setRequired(true);

  form.addTextItem()
    .setTitle('A link to your photo')
    .setHelpText(
      'One good press shot, landscape if you have it, highest resolution you ' +
      'have. Google Drive, Dropbox, WeTransfer, an Instagram post, anything we ' +
      'can open. THIS IS THE ONE WE CANNOT MAKE OURSELVES. No link handy? Put ' +
      '"emailing it" here and reply to our email with the file attached.'
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

  form.addCheckboxItem()
    .setTitle('Confirming you are playing')
    .setHelpText(
      'This is the part that puts you on the public lineup. We publish nobody ' +
      'who has not confirmed in writing.'
    )
    .setChoiceValues(['Yes, I confirm I am playing ZAOstock on Saturday 3 October 2026'])
    .setRequired(true);

  // Folded in from the 'Artist contracts with Friday-night soundcheck clause'
  // card (due 2026-09-08) rather than sent as a second message. An act should
  // not be asked for a photo today and a soundcheck commitment tomorrow. This
  // is an ASK, not a signature - the contract carries the binding term. It is a
  // question rather than a forced yes so an act with a genuine conflict flags it
  // instead of abandoning the form. Start time is UNSET in our records, so no
  // time is stated here.
  form.addMultipleChoiceItem()
    .setTitle('Soundcheck is the evening of Friday 2 October. Can you be there?')
    .setHelpText(
      'It covers every act and there is no Saturday alternative - Saturday ' +
      'morning is a line check only. Exact start time to be confirmed.'
    )
    .setChoiceValues([
      'Yes, I can be there Friday evening 2 October',
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

  form.addParagraphTextItem()
    .setTitle('Anything else we should know?')
    .setHelpText('Access needs, a name spelling, someone else who handles your bookings. Optional.')
    .setRequired(false);

  var sheet = SpreadsheetApp.create('ZAOstock 2026 - Artist Details (responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('EDIT the form:  ' + form.getEditUrl());
  Logger.log('SEND this link: ' + form.getPublishedUrl());
  Logger.log('Responses:      ' + sheet.getUrl());
}
