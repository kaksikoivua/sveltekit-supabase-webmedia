<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const article = data.article;
</script>

<div><a href="/articles">Article list</a></div>

<article>
  <h1>{article.title}</h1>
  <p>{article.content1}</p>
  {#if article.content2}
    <p>{article.content2}</p>
  {/if}
</article>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(article, null, 2)}</pre>
