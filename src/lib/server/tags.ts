export const addTag = async (tagName: string, locals: App.Locals) => {
  const { data, error } = await locals.supabase
    .from('tags')
    .insert({ name: tagName })
    .select('id');

  if (error) {
    throw new Error(error.message);
  }

  return data[0].id;
};

export const deleteTag = async (tagId: number, locals: App.Locals) => {
  const apps = ['articles'];

  for (const app of apps) {
    const { count, error } = await locals.supabase
      .from(`${app}_tags`)
      .select('tag_id', { count: 'exact' })
      .eq('tag_id', tagId);

    if (error) {
      throw new Error(error.message);
    }

    if (count) {
      return;
    }
  }

  const { error } = await locals.supabase
    .from('tags')
    .delete()
    .eq('id', tagId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getNewTagId = async (tagName: string, locals: App.Locals) => {
  const { data, error } = await locals.supabase
    .from('tags')
    .select('id')
    .eq('name', tagName);

  if (error) {
    throw new Error(error.message);
  }

  const newTagId = data.length
    ? data[0].id
    : await addTag(tagName, locals);

  return newTagId;
};
