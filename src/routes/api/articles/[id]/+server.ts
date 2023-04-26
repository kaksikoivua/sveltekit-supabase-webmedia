import {
  addTagToArticle,
  deleteArticle,
  getArticle,
  removeTagFromArticle,
  updateArticle
} from '$lib/server/articles';
import { handleError } from '$lib/server/errorHandler';
import { deleteTag, getNewTagId } from '$lib/server/tags';

import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
  const patchData = await request.json();

  const articleId = Number(params.id);

  try {
    if ('tag' in patchData) {
      const currentTagId = patchData.tag.id;
      const tagName = patchData.tag.name;

      if (tagName !== '') {
        const newTagId = await getNewTagId(tagName, locals);
        await addTagToArticle(newTagId, currentTagId, articleId, locals);
      } else {
        await removeTagFromArticle(currentTagId, articleId, locals);
      }

      if (currentTagId) {
        await deleteTag(currentTagId, locals);
      }
    } else {
      await updateArticle(patchData, articleId, locals);
    }
  } catch (error) {
    handleError(error);
  }

  const options = { status: 204 };
  return new Response(null, options);
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const articleId = Number(params.id);

  const article = await getArticle(articleId, 'tags(id)', locals);

  await deleteArticle(articleId, locals);

  if ('tags' in article && Array.isArray(article.tags)) {
    const tags = article.tags;
    for (const tag of tags) {
      deleteTag(tag.id, locals);
    }
  }

  const options = { status: 204 };
  return new Response(null, options);
};
