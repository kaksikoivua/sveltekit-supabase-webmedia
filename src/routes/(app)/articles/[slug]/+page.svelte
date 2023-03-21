<script lang="ts">
  import Article from '$lib/Article.svelte';

  import type { PageData } from './$types';

  export let data: PageData;

  const article = data.article;
</script>

<div><a href="/articles">Article list</a></div>

<Article {article}/>
