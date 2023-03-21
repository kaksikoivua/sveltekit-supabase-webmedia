<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const articles = data.articles;
</script>

<div><a href="/">Index</a></div>

<h1>Articles</h1>

<ul>
  {#each articles as article (article.id)}
    <li><a href={`/articles/${article.slug}`}>{article.title}</a></li>
  {/each}
</ul>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(articles, null, 2)}</pre>
