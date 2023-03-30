import { error as svelteKitError } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
  const patchData = await request.json();

  const { error } = await locals.supabase
    .from('articles')
    .update({
      title: patchData.title,
      slug: patchData.slug,
      content1: patchData.content1,
      content2: patchData.content2
    })
    .eq('id', params.id);

  if (!error) {
    const body = JSON.stringify({ message: 'Success' });
    const options = { status: 200 };
    return new Response(body, options);
  }

  console.log(error);
  throw svelteKitError(500, 'Internal Error');
}
