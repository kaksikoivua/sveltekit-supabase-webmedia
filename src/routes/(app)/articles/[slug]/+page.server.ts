import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, request }) => {
  let columnsString = 'content1';

  const referer = request.headers.get('referer');

  if (referer !== 'http://localhost:5173/articles') {
    columnsString += ', id, title, slug, user_id, tags(id, name)';
  }

  const session = await locals.getSession();

  if (session) {
    columnsString += ', content2';
  }

  const { data, error } = await locals.supabase
    .from('articles')
    .select(columnsString)
    .eq('slug', params.slug);

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  if (!data.length) {
    throw svelteKitError(404, 'Not found');
  }

  if ('user_id' in data[0]) {
    await locals.supabase
      .from('profiles')
      .select('username, first_name, last_name')
      .eq('id', data[0].user_id)
      .then(({ data: profilesData, error }) => {
        if (error) {
          console.log(error);
          throw svelteKitError(500, 'Internal Error');
        }
        Object.assign(data[0], {
          profile: {
            username: profilesData[0].username,
            first_name: profilesData[0].first_name,
            last_name: profilesData[0].last_name
          }
        });
      });
    delete data[0].user_id;
  }

  return {
    article: data[0]
  };
};
