<script lang="ts">
  import ArticleEditor from '$lib/ArticleEditor.svelte';
  import { article } from '$lib/stores';

  import type { PageData } from './$types';

  export let data: PageData;

  if ($article) {
    Object.assign(data.article, $article);
    $article = undefined;
  }
</script>

<div><a href="/admin">Admin</a></div>

<ArticleEditor article={data.article}/>
