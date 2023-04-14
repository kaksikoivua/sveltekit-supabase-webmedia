import { error as svelteKitError } from '@sveltejs/kit';

import { deleteTag } from '$lib/server/tags';

interface Article {
  title: string;
  slug: string;
  content1: string;
  content2: string;
}

export const addArticle = async (postData: Article, locals: App.Locals) => {
  const session = await locals.getSession();
  const userId = session?.user.id;

  const { data, error } = await locals.supabase
    .from('articles')
    .insert(Object.assign(postData, { user_id: userId }))
    .select('id');

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  return data[0].id;
};

export const getArticle = async (
  id: number,
  columnsString: string,
  locals: App.Locals
)  => {
  const { data, error } = await locals.supabase
    .from('articles')
    .select(columnsString)
    .eq('id', id);

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }

  return data[0];
};

export const updateArticle = async (
  patchData: Article,
  id: number,
  locals: App.Locals
) => {
  const { error } = await locals.supabase
    .from('articles')
    .update(patchData)
    .eq('id', id);

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};

export const deleteArticle = async (id: number, locals: App.Locals) => {
  const { error } = await locals.supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};

export const addTagToArticle = async (
  newTagId: number,
  currentTagId: number | undefined,
  articleId: number,
  locals: App.Locals
) => {
  let query = locals.supabase.from('articles_tags');

  const { error } = currentTagId
    ? await query
      .update({ article_id: articleId, tag_id: newTagId })
      .match({ article_id: articleId, tag_id: currentTagId })
    : await query
      .insert({ article_id: articleId, tag_id: newTagId });

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};

export const removeTagFromArticle = async (
  tagId: number,
  articleId: number,
  locals: App.Locals
) => {
  const { error } = await locals.supabase
    .from('articles_tags')
    .delete()
    .match({ article_id: articleId, tag_id: tagId });

  if (error) {
    console.log(error);
    throw svelteKitError(500, 'Internal Error');
  }
};
