import { addArticle, addTagToArticle } from '$lib/server/articles';
import { getNewTagId } from '$lib/server/tags';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  const postData = await request.json();
  const { tags, ...article } = postData;

  const articleId = await addArticle(article, locals);

  if (tags.length) {
    for (const tag of tags) {
      const newTagId = await getNewTagId(tag.name, locals);
      addTagToArticle(newTagId, undefined, articleId, locals);
    }
  }

  const options = {
    status: 201,
    headers: {
      'Location': `/articles/${article.slug}`
    }
  };
  return new Response(null, options);
};
