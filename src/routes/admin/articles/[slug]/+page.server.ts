import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, request }) => {
  let columnsString = 'content1, content2';

  const referer = request.headers.get('referer');
  if (referer !== 'http://localhost:5173/articles') {
    columnsString += ', id, title, slug, tags, username';
  }

  const user = await locals.supabase.auth.getUser();

  const { data, error } = await locals.supabase
    .from('articles_with_tags')
    .select(columnsString)
    .match({ slug: params.slug, user_id: user.data.user?.id });

  if (data) {
    if (data.length) {
      return {
        article: data[0]
      };
    } else {
      throw svelteKitError(404, 'Not found');
    }
  }

  console.log(error);
  throw svelteKitError(500, 'Internal Error');
};
