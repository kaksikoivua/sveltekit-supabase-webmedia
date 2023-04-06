import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, request }) => {
  let columnsString = 'content1, content2';

  const referer = request.headers.get('referer');

  if (referer !== 'http://localhost:5173/articles') {
    columnsString += ', id, title, slug, tags(id, name)';
  }

  const profile = await locals.getSignedInUserProfile();

  const { data, error } = await locals.supabase
    .from('articles')
    .select(columnsString)
    .match({ slug: params.slug, user_id: profile.id });

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  if (!data.length) {
    throw svelteKitError(404, 'Not found');
  }

  if ('id' in data[0]) {
    Object.assign(data[0], {
      profile: {
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    });
  }

  return {
    article: data[0]
  };
};
