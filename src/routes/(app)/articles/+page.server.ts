import { error as svelteKitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const tagName = url.searchParams.get('tag');

  const { data, error } = tagName === null
    ? await locals.supabase.rpc('get_article_list')
    : await locals.supabase.rpc('get_article_list', { tag_name: tagName });

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  const profile = await locals.getSignedInUserProfile();

  return {
    articles: data,
    signedInCreator: profile && profile.role.name === 'creator'
      ? { username: profile.username }
      : undefined
  };
};
