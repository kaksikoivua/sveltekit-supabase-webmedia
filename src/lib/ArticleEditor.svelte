<script lang="ts">
  import { patch } from '$lib/client/fetch';

  export let article;

  const contents = [article.content1, article.content2];

  const updateArticle = (data) => {
    patch(data, article.id, 'articles');
  };

  const updateTag = (data) => {
    updateArticle({ tag: data });
  };
</script>

<div>
  <div>Title:</div>
  <input
    type="text"
    bind:value={article.title}
    on:change={(e) => {
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
{#each contents as content, i (i)}
  <div>
    <div>Content{i + 1}:</div>
    <textarea
      cols="30" rows="10"
      bind:value={content}
      on:change={(e) => {
        updateArticle({ [`content${i + 1}`]: e.currentTarget.value });
      }}
    ></textarea>
  </div>
{/each}
{#each Array(3) as _, i (i)}
  <div>
    <div>Tag{i + 1}:</div>
    {#if article.tags[i]}
      <input
        type="text"
        value={article.tags[i].name}
        on:change={(e) => {
          updateTag({ name: e.currentTarget.value, id: article.tags[i].id })
        }}
      >
    {:else}
      <input
        type="text"
        value=""
        on:change={(e) => {
          updateTag({ name: e.currentTarget.value, id: undefined })
        }}
      >
    {/if}
  </div>
{/each}

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(article, null, 2)}</pre>
