import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  let columnsString = 'id, title, content1';
  await locals.getSession()
    .then(session => {
      if (session) {
        columnsString += ', content2';
      }
    });

  const { data } = await locals.supabase
    .from('articles')
    .select(columnsString)
    .eq('slug', params.slug);

  if (data && data.length) {
    return {
      article: data[0]
    };
  }

  throw error(404, 'Not found');
};
