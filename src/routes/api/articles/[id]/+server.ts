import { error as svelteKitError } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
  const patchData = await request.json();

  if ('tag' in patchData) {
    const tags = await locals.supabase
      .from('tags')
      .select('id, name')
      .eq('name', patchData.tag.name);

    if (tags.error) {
      console.log(tags.error);
      throw svelteKitError(500, 'Internal Error');
    }

    const newTagId = tags.data.length
      ? tags.data[0].id
      : await locals.supabase
        .from('tags')
        .insert({ name: patchData.tag.name })
        .select('id')
        .then(({ data, error }) => {
          if (error) {
            console.log(error);
            throw svelteKitError(500, 'Internal Error');
          }
          return data[0].id;
        });

    let query = locals.supabase.from('articles_tags');

    const saveResult = patchData.tag.id
      ? await query
        .update({ article_id: params.id, tag_id: newTagId })
        .match({ article_id: params.id, tag_id: patchData.tag.id })
      : await query
        .insert({ article_id: params.id, tag_id: newTagId });

    if (saveResult.error) {
      console.log(saveResult.error);
      throw svelteKitError(500, 'Internal Error');
    }

    if (patchData.tag.id) {
      const countResult = await locals.supabase
        .from('articles_tags')
        .select('tag_id', { count: 'exact' })
        .eq('tag_id', patchData.tag.id);

      if (countResult.error) {
        console.log(countResult.error);
        throw svelteKitError(500, 'Internal Error');
      }

      if (!countResult.count) {
        await locals.supabase
          .from('tags')
          .delete()
          .eq('id', patchData.tag.id)
          .then(({ error }) => {
            if (error) {
              console.log(error);
              throw svelteKitError(500, 'Internal Error');
            }
          });
      }
    }
  } else {
    const updateResult = await locals.supabase
      .from('articles')
      .update({
        title: patchData.title,
        slug: patchData.slug,
        content1: patchData.content1,
        content2: patchData.content2
      })
      .eq('id', params.id);

    if (updateResult.error) {
      console.log(updateResult.error);
      throw svelteKitError(500, 'Internal Error');
    }
  }

  const body = JSON.stringify({ message: 'Success' });
  const options = { status: 200 };
  return new Response(body, options);
}
