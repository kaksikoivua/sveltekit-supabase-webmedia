import { redirect } from '@sveltejs/kit';

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

  event.locals.isAuthor = async () => {
    const role = await event.locals.supabase
      .from('profiles')
      .select('role:roles(name)')
      .then(({ data }) => {
        if (data && data.length) {
          return data[0].role;
        }
      });

    if (role && ('name' in role)) {
      if (role.name === 'author') {
        return true;
      }
    }

    return false;
  };

  if (event.url.pathname.startsWith('/admin')) {
    if (!await event.locals.isAuthor()) {
      throw redirect(303, '/');
    }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};
