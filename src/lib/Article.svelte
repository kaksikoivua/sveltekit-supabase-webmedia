<script lang="ts">
  import { marked } from 'marked';

  export let article;

  const renderer = {
    heading(text, level) {
      level += 1;
      return `<h${level}>${text}</h${level}>`;
    }
  };
  marked.use({ renderer });
</script>

<article>
  <h1>{article.title}</h1>
  {@html marked(article.content1)}
  {#if article.content2}
    {@html marked(article.content2)}
  {/if}
</article>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(article, null, 2)}</pre>
