<script lang="ts">
  export let heading, items;
</script>

<h1><a href="/articles">{heading}</a></h1>

<ul>
  {#each items as article (article.id)}
    <li>
      <a href={`/articles/${article.slug}`}>{article.title}</a>
      {#each article.tags as tag, i (i)}
        <a href={`/articles?tag=${tag.name}`} class="tag">{tag.name}</a>
      {/each}
    </li>
  {/each}
</ul>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(items, null, 2)}</pre>
