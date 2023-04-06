import { error as svelteKitError, redirect } from '@sveltejs/kit';

import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event
  });

  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  event.locals.getSignedInUserProfile = async () => {
    const session = await event.locals.getSession();
    if (!session) {
      return undefined;
    }
    return event.locals.supabase
      .from('profiles')
      .select('id, username, first_name, last_name, role:roles(name)')
      .eq('id', session.user.id)
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
          throw svelteKitError(500, 'Internal Error');
        }
        return data[0];
      });
  };

  if (event.url.pathname.startsWith('/admin')) {
    const profile = await event.locals.getSignedInUserProfile();
    if (!profile || profile.role.name !== 'creator') {
      throw redirect(303, '/');
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};
