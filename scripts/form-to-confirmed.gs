/**
 * ZAOstock 2026 - turn a submitted artist form into a confirmed row, automatically.
 *
 * WHY THIS EXISTS
 *   Hand-flipping rows to `confirmed` was authorised on 2026-09-08 as a BRIDGE,
 *   six days before the reveal. This is the destination it is a bridge to. A
 *   hand edit records nothing in `activity_log`, so a row confirmed by hand
 *   carries no machine-readable evidence of WHY it is confirmed. This path does,
 *   because /api/admin/confirm-artist requires `confirmation_reference` and
 *   writes it to the log.
 *
 * WHAT IT DOES
 *   On each form submission: read which act replied, build a reference that
 *   points at the actual response, and POST it to the confirm endpoint. The
 *   endpoint does the rest - and it will NEVER create a row, so a typo in an
 *   act name is a 404 rather than an invented artist.
 *
 * INSTALL
 *   1. Open the artist form's linked Apps Script (Extensions -> Apps Script)
 *   2. Paste this file in alongside the form-builder script
 *   3. Project Settings -> Script properties, add:
 *        ARTIST_CONFIRM_SECRET   the same value set in the Vercel project
 *        ZAOSTOCK_BASE_URL       https://zaostock.com     (optional)
 *   4. Run `installTrigger` once and approve the prompt
 *
 * IT FAILS LOUDLY, ON PURPOSE
 *   Every outcome is logged and a failure throws. A silent failure here looks
 *   exactly like "no artists have replied yet", which is the one thing we cannot
 *   afford to misread in the six days before a reveal.
 */

/** The question whose answer names the act. Must match the form exactly. */
var ACT_QUESTION = 'Which act are you?';

function installTrigger() {
  var form = FormApp.getActiveForm();
  if (!form) throw new Error('Open this from the FORM\'s bound script, not a standalone project.');

  // Remove any existing copy first, so running this twice does not double-post
  // every confirmation.
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'onArtistFormSubmit') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  ScriptApp.newTrigger('onArtistFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('Trigger installed on: ' + form.getTitle());
}

function onArtistFormSubmit(e) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('ARTIST_CONFIRM_SECRET');
  var base = props.getProperty('ZAOSTOCK_BASE_URL') || 'https://zaostock.com';

  if (!secret) {
    throw new Error('ARTIST_CONFIRM_SECRET is not set in Script properties. ' +
                    'The confirmation was received but NOT recorded.');
  }

  var answers = readAnswers(e);
  var act = answers[ACT_QUESTION];

  if (!act) {
    throw new Error('No answer to "' + ACT_QUESTION + '". Nothing was confirmed. ' +
                    'Answers present: ' + Object.keys(answers).join(', '));
  }

  // The reference points at the real thing that justified the confirmation.
  // Timestamped, and carrying the respondent's own email where the form
  // collected it, so it can be found again in the responses sheet.
  var who = (e && e.response && e.response.getRespondentEmail)
    ? (e.response.getRespondentEmail() || 'no email collected')
    : 'no email collected';
  var when = (e && e.response && e.response.getTimestamp)
    ? e.response.getTimestamp().toISOString()
    : new Date().toISOString();

  var reference = 'ZAOstock artist form, submitted ' + when + ' by ' + who;

  var body = {
    name: act,
    confirmation_reference: reference,
  };

  // Pass through anything the act gave us, so one call both confirms them and
  // fills the page. Absent answers are simply omitted.
  addIfPresent(body, 'bio', answers, ['A short bio', 'Bio', 'Your bio']);
  addIfPresent(body, 'city', answers, ['Your city', 'City']);
  addIfPresent(body, 'photo_url', answers, ['A link to your photo', 'Photo link', 'Photo']);
  addIfPresent(body, 'socials', answers, ['Your links', 'Links', 'Socials']);

  var res = UrlFetchApp.fetch(base + '/api/admin/confirm-artist', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + secret },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });

  var code = res.getResponseCode();
  var text = res.getContentText();

  if (code === 200) {
    Logger.log('CONFIRMED: ' + act + ' -> ' + text);
    return;
  }

  // Everything below is a real problem and must be visible.
  if (code === 404) {
    throw new Error('NOT CONFIRMED. No artist row matches "' + act + '" exactly. ' +
                    'The endpoint never creates rows, by design. Fix the name in ' +
                    'the artists table or the form option, then re-run manually. ' +
                    'Response: ' + text);
  }
  if (code === 503) {
    throw new Error('NOT CONFIRMED. The endpoint says it is not configured - ' +
                    'ARTIST_CONFIRM_SECRET is missing in the Vercel project. ' +
                    'The reply is safe in the responses sheet; nothing was lost.');
  }
  throw new Error('NOT CONFIRMED for "' + act + '". HTTP ' + code + ': ' + text);
}

/** Form answers as a plain title -> answer object. */
function readAnswers(e) {
  var out = {};
  if (!e || !e.response) return out;
  var items = e.response.getItemResponses();
  for (var i = 0; i < items.length; i++) {
    var a = items[i].getResponse();
    out[items[i].getItem().getTitle()] = Array.isArray(a) ? a.join(', ') : a;
  }
  return out;
}

/** Copy the first matching answer into the payload, if the act gave one. */
function addIfPresent(body, field, answers, candidateTitles) {
  for (var i = 0; i < candidateTitles.length; i++) {
    var v = answers[candidateTitles[i]];
    if (v && String(v).trim()) {
      body[field] = String(v).trim();
      return;
    }
  }
}
