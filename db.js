// ============================================================
// GATEPOST — Supabase Connection
// db.js — import this in every page that needs data
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL  = 'https://tpurkcxtkvwpywxnuzwe.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdXJrY3h0a3Z3cHl3eG51endlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDUwMzYsImV4cCI6MjA5MjI4MTAzNn0.j1fPBjBsbIoXXosM96YtywdGiVVLWnd-YrXZ1634alU';

export const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ============================================================
// ASSOCIATION HELPERS
// ============================================================
export async function getAssociation(id) {
  const { data, error } = await db.from('associations').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getDefaultAssociation() {
  const { data, error } = await db.from('associations').select('*').eq('abbreviation', 'CoWN').single();
  if (error) throw error;
  return data;
}

// ============================================================
// MEMBER HELPERS
// ============================================================
export async function getMembers(associationId) {
  const { data, error } = await db
    .from('members')
    .select(`*, member_registrations(*)`)
    .eq('association_id', associationId)
    .eq('active', true)
    .order('last_name');
  if (error) throw error;
  return data;
}

export async function getMemberByName(first, last, associationId) {
  const { data, error } = await db
    .from('members')
    .select(`*, member_registrations(*)`)
    .eq('association_id', associationId)
    .ilike('first_name', first.trim())
    .ilike('last_name', last.trim());
  if (error) throw error;
  return data;
}

export async function upsertMember(member) {
  const { data, error } = await db
    .from('members')
    .upsert(member, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// HORSE HELPERS
// ============================================================
export async function getHorses() {
  const { data, error } = await db
    .from('horses')
    .select(`*, horse_registrations(*), horse_owners(*, members(*))`)
    .eq('active', true)
    .order('registered_name');
  if (error) throw error;
  return data;
}

export async function getHorseByName(name) {
  const { data, error } = await db
    .from('horses')
    .select(`*, horse_registrations(*), horse_owners(*, members(*))`)
    .ilike('registered_name', name.trim());
  if (error) throw error;
  return data;
}

export async function upsertHorse(horse) {
  const { data, error } = await db
    .from('horses')
    .upsert(horse, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// SHOW HELPERS
// ============================================================
export async function getShows(associationId) {
  const { data, error } = await db
    .from('shows')
    .select('*')
    .eq('association_id', associationId)
    .order('show_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getShow(showId) {
  const { data, error } = await db
    .from('shows')
    .select(`*, show_classes(*), show_judges(*, judges(*))`)
    .eq('id', showId)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertShow(show) {
  const { data, error } = await db
    .from('shows')
    .upsert(show, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// ENTRY HELPERS
// ============================================================
export async function getEntries(showId) {
  const { data, error } = await db
    .from('entries')
    .select(`
      *,
      members(*),
      horses(*),
      entry_classes(*, show_classes(*)),
      payments(*)
    `)
    .eq('show_id', showId)
    .order('back_number');
  if (error) throw error;
  return data;
}

export async function getEntry(entryId) {
  const { data, error } = await db
    .from('entries')
    .select(`
      *,
      members(*, member_registrations(*)),
      horses(*, horse_registrations(*)),
      entry_classes(*, show_classes(*)),
      payments(*)
    `)
    .eq('id', entryId)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertEntry(entry) {
  const { data, error } = await db
    .from('entries')
    .upsert(entry, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function scratchEntryClass(entryClassId, reason) {
  const { data, error } = await db
    .from('entry_classes')
    .update({
      status: 'scratched',
      scratch_reason: reason,
      scratched_at: new Date().toISOString()
    })
    .eq('id', entryClassId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// PAYMENT HELPERS
// ============================================================
export async function addPayment(entryId, amount, method, processedBy, notes) {
  // Insert the payment record
  const { data: payment, error: pe } = await db
    .from('payments')
    .insert({ entry_id: entryId, amount, method, notes, processed_by: processedBy })
    .select()
    .single();
  if (pe) throw pe;

  // Update total_paid on the entry
  const { data: entry, error: ee } = await db
    .from('entries')
    .select('total_paid')
    .eq('id', entryId)
    .single();
  if (ee) throw ee;

  const newPaid = (parseFloat(entry.total_paid) || 0) + parseFloat(amount);
  await db.from('entries').update({ total_paid: newPaid }).eq('id', entryId);

  return payment;
}

// ============================================================
// COGNITO IMPORT
// Takes parsed entries array from the Cognito parser and
// upserts everything into the database
// ============================================================
export async function importCognitoEntries(parsedEntries, showId, associationId) {
  const results = { inserted: 0, updated: 0, errors: [] };

  for (const e of parsedEntries) {
    try {
      // 1. Find or create member
      const nameParts = e.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName  = nameParts.slice(1).join(' ') || '(unknown)';

      let memberId;
      const existing = await getMemberByName(firstName, lastName, associationId);
      if (existing && existing.length > 0) {
        memberId = existing[0].id;
        // Update their CoWN number if we have it and they don't
        if (e.memberNum && e.memberNum !== '0' && !existing[0].membership_tier) {
          await db.from('members').update({ notes: 'CoWN #' + e.memberNum })
            .eq('id', memberId);
        }
      } else {
        const newMember = await upsertMember({
          association_id:    associationId,
          first_name:        firstName,
          last_name:         lastName,
          email:             e.email || null,
          phone:             e.phone || null,
          address:           e.address || null,
          needs_membership:  e.needsMembership || null,
        });
        memberId = newMember.id;

        // Save CoWN number as a registration
        if (e.memberNum && e.memberNum !== '0') {
          await db.from('member_registrations').insert({
            member_id: memberId, org: 'CoWN', registration_number: e.memberNum
          });
        }
      }

      // 2. Find or create horse
      let horseId;
      const existingHorse = await getHorseByName(e.horse);
      if (existingHorse && existingHorse.length > 0) {
        horseId = existingHorse[0].id;
      } else {
        const newHorse = await upsertHorse({
          registered_name: e.horse,
          gender:          e.horseGender || null,
          dob:             e.horseDob ? new Date(e.horseDob).toISOString().split('T')[0] : null,
        });
        horseId = newHorse.id;

        // Link owner
        await db.from('horse_owners').insert({
          horse_id: horseId, member_id: memberId, primary_owner: true
        });
      }

      // 3. Upsert the entry
      const { data: entry, error: entryErr } = await db
        .from('entries')
        .upsert({
          show_id:          showId,
          member_id:        memberId,
          horse_id:         horseId,
          source:           'cognito_import',
          status:           'active',
          stall_1night:     e.stall1qty   || 0,
          stall_2night:     e.stall2qty   || 0,
          shavings:         e.shavings    || 0,
          rv_1night:        e.rv1qty      || 0,
          rv_2night:        e.rv2qty      || 0,
          rv_circuit:       e.rvCircuit   || 0,
          stall_note:       e.stallNote   || null,
          needs_membership: e.needsMembership || null,
          cognito_ref:      String(e.entryNum || ''),
          imported_at:      new Date().toISOString(),
        }, { onConflict: 'show_id,member_id,horse_id', ignoreDuplicates: false })
        .select()
        .single();
      if (entryErr) throw entryErr;

      // 4. Upsert entry_classes
      for (const cls of e.classes) {
        // Find the show_class by class number
        const { data: showClass } = await db
          .from('show_classes')
          .select('id, base_fee, cow_fee, is_cow')
          .eq('show_id', showId)
          .eq('class_number', cls.num)
          .single();

        if (showClass) {
          const fee = (showClass.base_fee || 0) + (showClass.is_cow ? (showClass.cow_fee || 0) : 0);
          await db.from('entry_classes').upsert({
            entry_id:      entry.id,
            show_class_id: showClass.id,
            status:        'entered',
            fee_charged:   fee,
          }, { onConflict: 'entry_id,show_class_id', ignoreDuplicates: true });
        }
      }

      results.inserted++;
    } catch (err) {
      results.errors.push({ name: e.name, error: err.message });
    }
  }

  return results;
}

// ============================================================
// CLASS DRAW
// Randomizes order for a class, saves to show_classes.draw_order
// ============================================================
export async function drawClass(showClassId) {
  // Get all active entries for this class
  const { data: entryClasses, error } = await db
    .from('entry_classes')
    .select('id, entry_id, entries(back_number, members(first_name, last_name), horses(barn_name, registered_name))')
    .eq('show_class_id', showClassId)
    .eq('status', 'entered');
  if (error) throw error;

  // Fisher-Yates shuffle
  const arr = [...entryClasses];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Save draw positions
  for (let i = 0; i < arr.length; i++) {
    await db.from('entry_classes')
      .update({ draw_position: i + 1 })
      .eq('id', arr[i].id);
  }

  // Save draw order to show_classes
  const drawOrder = arr.map((ec, i) => ({
    position:   i + 1,
    entry_id:   ec.entry_id,
    entry_class_id: ec.id,
    rider:      ec.entries?.members?.first_name + ' ' + ec.entries?.members?.last_name,
    horse:      ec.entries?.horses?.barn_name || ec.entries?.horses?.registered_name,
    back_num:   ec.entries?.back_number,
  }));

  await db.from('show_classes')
    .update({ draw_order: drawOrder, status: 'draw_done' })
    .eq('id', showClassId);

  return drawOrder;
}

// ============================================================
// POINTS CALCULATOR
// Call after a show class is marked complete
// ============================================================
export async function calculatePoints(showClassId, associationId, seasonYear) {
  // Get all completed entry_classes with placings
  const { data: results, error } = await db
    .from('entry_classes')
    .select(`
      id, "placing", entry_id,
      entries(member_id, horse_id),
      show_classes(division, class_name, is_cow)
    `)
    .eq('show_class_id', showClassId)
    .eq('status', 'complete')
    .not('"placing"', 'is', null);
  if (error) throw error;

  // Basic points table — will make this configurable per association later
  const pointsTable = { 1: 7, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1 };

  for (const r of results) {
    const pts = pointsTable[r.placing] || 0;
    if (pts === 0) continue;

    const division = r.show_classes?.division;
    const memberId = r.entries?.member_id;
    const horseId  = r.entries?.horse_id;

    // Update entry_classes points_earned
    await db.from('entry_classes').update({ points_earned: pts }).eq('id', r.id);

    // Upsert into points standings
    const { data: existing } = await db
      .from('points')
      .select('id, total_points, shows_counted')
      .eq('member_id', memberId)
      .eq('horse_id', horseId)
      .eq('association_id', associationId)
      .eq('season_year', seasonYear)
      .eq('division', division)
      .single();

    if (existing) {
      await db.from('points').update({
        total_points:  existing.total_points + pts,
        shows_counted: existing.shows_counted + 1,
        updated_at:    new Date().toISOString()
      }).eq('id', existing.id);
    } else {
      await db.from('points').insert({
        member_id:      memberId,
        horse_id:       horseId,
        association_id: associationId,
        season_year:    seasonYear,
        division:       division,
        total_points:   pts,
        shows_counted:  1,
      });
    }
  }
}
