import { Validator } from '$lib/server/validation';

interface Article {
  title: string;
  slug: string;
  content1: string;
  content2: string;
}

class CreateValidator extends Validator<Article> {
  isProvidedType = (data: any): data is Article => {
    return typeof data.title === 'string'
      && typeof data.slug === 'string'
      && typeof data.content1 === 'string'
      && typeof data.content2 === 'string';
  };

  setUpValidator = () => {
    this.add({
      rule: 'mustNotBeEmpty',
      fieldNames: ['title', 'slug', 'content1'],
      message: 'This field is required.'
    });

    this.add({
      rule: 'mustBeInRange',
      fieldNames: ['title'],
      message: 'Title must be between 3 and 20 characters long.',
      additionalArgs: { min: 3, max: 20 }
    });

    return this;
  };
}

class UpdateValidator extends CreateValidator {
  isProvidedType = (data: any): data is Article => {
    return typeof data.title === 'string'
      || typeof data.slug === 'string'
      || typeof data.content1 === 'string'
      || typeof data.content2 === 'string';
  };
}

export const addArticle = async (postData: Article, locals: App.Locals) => {
  const articleValidator = new CreateValidator();
  articleValidator.setUpValidator().validate(postData);

  const session = await locals.getSession();
  const userId = session?.user.id;

  const { data, error } = await locals.supabase
    .from('articles')
    .insert(Object.assign(postData, { user_id: userId }))
    .select('id');

  if (error) {
    throw new Error(error.message);
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
    throw new Error(error.message);
  }

  return data[0];
};

export const updateArticle = async (
  patchData: Article,
  id: number,
  locals: App.Locals
) => {
  const articleValidator = new UpdateValidator();
  articleValidator.setUpValidator().validate(patchData);

  const { error } = await locals.supabase
    .from('articles')
    .update(patchData)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteArticle = async (id: number, locals: App.Locals) => {
  const { error } = await locals.supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};
