import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, request }) => {
  let columnsString = 'content1';

  const referer = request.headers.get('referer');
  if (referer !== 'http://localhost:5173/articles') {
    columnsString += ', id, title, tags(name)';
  }

  const session = await locals.getSession();
  if (session) {
    columnsString += ', content2';
  }

  const { data, error } = await locals.supabase
    .from('articles')
    .select(columnsString)
    .eq('slug', params.slug);

  if (data) {
    if (data.length) {
      return {
        article: data[0]
      };
    } else {
      throw svelteKitError(404, 'Not found');
    }
  } else {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};
