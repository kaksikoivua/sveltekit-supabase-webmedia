import { error as svelteKitError } from '@sveltejs/kit';

import { deleteUnusedTag } from '$lib/server/tags';

interface Event {
  locals: App.Locals;
  params: {
    id: string;
  };
}

interface PatchData {
  title: string;
  slug: string;
  content1: string;
  content2: string;
}

export const updateArticle = async (patchData: PatchData, event: Event) => {
  const { error } = await event.locals.supabase
    .from('articles')
    .update({
      title: patchData.title,
      slug: patchData.slug,
      content1: patchData.content1,
      content2: patchData.content2
    })
    .eq('id', event.params.id);

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};

export const addTagToArticle = async (
  newTagId: number,
  currentTagId: number,
  event: Event
) => {
  let query = event.locals.supabase.from('articles_tags');

  const { error } = currentTagId
    ? await query
      .update({ article_id: event.params.id, tag_id: newTagId })
      .match({ article_id: event.params.id, tag_id: currentTagId })
    : await query
      .insert({ article_id: event.params.id, tag_id: newTagId });

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};

export const removeTagFromArticle = async (tagId: number, event: Event) => {
  const { error } = await event.locals.supabase
    .from('articles_tags')
    .delete()
    .match({ article_id: event.params.id, tag_id: tagId });

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  deleteUnusedTag(tagId, { locals: event.locals });
};
