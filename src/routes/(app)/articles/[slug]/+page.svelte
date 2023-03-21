<script lang="ts">
  import { marked } from 'marked';

  import type { PageData } from './$types';

  export let data: PageData;

  const article = data.article;

  const renderer = {
    heading(text, level) {
      level += 1;
      return `<h${level}>${text}</h${level}>`;
    }
  };
  marked.use({ renderer });
</script>

<div><a href="/articles">Article list</a></div>

<article>
  <h1>{article.title}</h1>
  {@html marked(article.content1)}
  {#if article.content2}
    {@html marked(article.content2)}
  {/if}
</article>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(article, null, 2)}</pre>
