<script lang="ts">
  import Article from '$lib/Article.svelte';
  import { article } from '$lib/stores';

  import type { PageData } from './$types';

  export let data: PageData;

  if ($article) {
    Object.assign(data.article, $article);
    $article = false;
  }
</script>

<div><a href="/articles">Articles</a></div>

<Article article={data.article}/>
