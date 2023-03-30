import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const tag = url.searchParams.get('tag');

  const columnsString = 'id, title, slug, tags, username';

  const { data, error } = tag !== null
    ? await locals.supabase
      .from('articles_with_tags')
      .select(columnsString)
      .overlaps('tags', [tag])
    : await locals.supabase
      .from('articles_with_tags')
      .select(columnsString);

  if (data) {
    return {
      articles: data,
      signedInCreator: await locals.isCreator()
        ? {
          username: await locals.supabase
            .from('profiles')
            .select('username')
            .then(({ data, error }) => {
              if (data) {
                return data[0].username;
              }
              console.log(error);
              throw svelteKitError(500, "Creator's username not found");
            })
          }
        : undefined
    };
  }

  console.log(error);
  throw svelteKitError(500, 'Internal Error');
};
