import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const tag = url.searchParams.get('tag');

  let columnsString = 'id, title, slug, username';

  const { data, error } = tag !== null
    ? await locals.supabase
      .from('articles_profiles_view')
      .select(columnsString + ', tags!inner(name)')
      .eq('tags.name', tag)
    : await locals.supabase
      .from('articles_profiles_view')
      .select(columnsString + ', tags(name)');

  if (data) {
    return {
      articles: data,
      username: await locals.isAuthor()
        ? await locals.supabase
          .from('profiles')
          .select('username')
          .then(({ data }) => {
            if (data) {
              return data[0].username;
            }
          })
        : null
    };
  }

  console.log(error);
  throw svelteKitError(500, 'Internal Error');
};
