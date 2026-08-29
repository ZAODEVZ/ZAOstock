import { permanentRedirect } from 'next/navigation';

// The eight circles were a dashboard feature: join a circle, a coordinator
// rotates, all of it behind a 4-letter code. The dashboard is retired and this
// page had been failing publicly ever since, because its API now answers 401.
//
// Zaal, 29 August: the circles "will become meetings", twice a day at 11:30
// and 17:00 ET. So the idea moves to /meetings and this route follows it.
export default function CirclesRedirect() {
  permanentRedirect('/meetings');
}
