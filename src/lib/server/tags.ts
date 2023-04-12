import { error as svelteKitError } from '@sveltejs/kit';

interface Event {
  locals: App.Locals;
}

export const addTag = async (tagName: string, event: Event) => {
  const { data, error } = await event.locals.supabase
    .from('tags')
    .insert({ name: tagName })
    .select('id');

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  return data[0].id;
};

export const deleteTag = async (tagId: number, event: Event) => {
  const apps = ['articles'];

  for (const app of apps) {
    const { count, error } = await event.locals.supabase
      .from(`${app}_tags`)
      .select('tag_id', { count: 'exact' })
      .eq('tag_id', tagId);

    if (error) {
      console.log(error);
      throw svelteKitError(500, 'Internal Error');
    }

    if (count) {
      return;
    }
  }

  const { error } = await event.locals.supabase
    .from('tags')
    .delete()
    .eq('id', tagId);

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};

export const getNewTagId = async (tagName: string, event: Event) => {
  const { data, error } = await event.locals.supabase
    .from('tags')
    .select('id')
    .eq('name', tagName);

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  const newTagId = data.length
    ? data[0].id
    : await addTag(tagName, event);

  return newTagId;
};
