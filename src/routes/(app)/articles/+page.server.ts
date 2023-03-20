import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data } = await locals.supabase
    .from('articles')
    .select('id, slug, title');

  if (data) {
    return {
      articles: data
    };
  }

  throw error(404, 'Not found');
};
