import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';

// Public - confirmed lineup only, and only public-safe fields (no fee,
// rider, notes, contact info, or anything else internal to the artists
// table). Powers the ZAO Festivals mobile app's festival detail screen.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();

  const { data: event, error: eventError } = await supabase.from('events').select('id').eq('slug', slug).maybeSingle();
  if (eventError) {
    console.error('[api/events/[slug]/lineup] event lookup failed', eventError);
    return NextResponse.json({ error: 'Failed to load lineup' }, { status: 500 });
  }
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('artists')
    .select('id, name, genre, city, bio, photo_url, socials, set_order')
    .eq('event_id', event.id)
    .eq('status', 'confirmed')
    .order('set_order', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('[api/events/[slug]/lineup] artists query failed', error);
    return NextResponse.json({ error: 'Failed to load lineup' }, { status: 500 });
  }
  return NextResponse.json({ artists: data });
}
