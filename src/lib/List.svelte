<script lang="ts">
  export let heading, items;
</script>

<h1>{heading}</h1>

<ul>
  {#each items as article (article.id)}
    <li><a href={`/articles/${article.slug}`}>{article.title}</a></li>
  {/each}
</ul>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(items, null, 2)}</pre>
