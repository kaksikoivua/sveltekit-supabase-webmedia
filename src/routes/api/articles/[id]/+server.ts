import {
  addTagToArticle,
  removeTagFromArticle,
  updateArticle
} from '$lib/server/articles';
import { deleteUnusedTag, getNewTagId } from '$lib/server/tags';

import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
  const patchData = await request.json();

  if ('tag' in patchData) {
    if (patchData.tag.name !== '') {
      const newTagId = await getNewTagId(patchData.tag.name, { locals });

      addTagToArticle(newTagId, patchData.tag.id, { locals, params });

      if (patchData.tag.id) {
        deleteUnusedTag(patchData.tag.id, { locals });
      }
    } else {
      removeTagFromArticle(patchData.tag.id, { locals, params });
    }
  } else {
    updateArticle(patchData, { locals, params });
  }

  const body = JSON.stringify({ message: 'Success' });
  const options = { status: 200 };
  return new Response(body, options);
};
