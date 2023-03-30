<script lang="ts">
	import { goto } from '$app/navigation';

  import { patch } from '$lib/client/fetch';

  export let article;

  const updateArticle = (data) => {
    patch(data, article.id, 'articles');
  }
</script>

<div>
  <div>Title:</div>
  <input
    type="text"
    bind:value={article.title}
    on:input={(e) => {
      updateArticle({ title: e.currentTarget.value });
    }}
  >
</div>
<div>
  <div>Slug:</div>
  <input
    type="text"
    bind:value={article.slug}
    on:change={(e) => {
      updateArticle({ slug: e.currentTarget.value });
    }}
  >
</div>
<div>
  <div>Content1:</div>
  <textarea
    cols="30" rows="10"
    bind:value={article.content1}
    on:input={(e) => {
      updateArticle({ content1: e.currentTarget.value });
    }}
  ></textarea>
</div>
<div>
  <div>Content2:</div>
  <textarea
    cols="30" rows="10"
    bind:value={article.content2}
    on:input={(e) => {
      updateArticle({ content2: e.currentTarget.value });
    }}
  ></textarea>
</div>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(article, null, 2)}</pre>
