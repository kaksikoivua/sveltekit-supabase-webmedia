import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const tag = url.searchParams.get('tag');

  let columnsString = 'id, title, slug';

  const { data, error } = tag !== null
    ? await locals.supabase
      .from('articles')
      .select(columnsString + ', tags!inner(name)')
      .eq('tags.name', tag)
    : await locals.supabase
      .from('articles')
      .select(columnsString + ', tags(name)');

  if (data) {
    return {
      articles: data
    };
  }

  console.log(error);
  throw svelteKitError(500, 'Internal Error');
};
