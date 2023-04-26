<script lang="ts">
  import { send } from '$lib/client/fetch';

  export let article;

  if (!article) {
    article = {
      title: '',
      slug: '',
      content1: '',
      content2: '',
      tags: []
    };
  }

  const createArticle = () => {
    send('POST', article, 'articles');
  };

  const updateArticle = (data) => {
    if (article.id) {
      send('PATCH', Object.assign(data, { id: article.id }), 'articles');
    }
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
{#each Array(2) as _, i (i)}
  <div>
    <div>Content{i + 1}:</div>
    <textarea
      cols="30" rows="10"
      bind:value={article[`content${i + 1}`]}
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
          updateTag({ name: e.currentTarget.value, id: article.tags[i].id });
        }}
      >
    {:else}
      <input
        type="text"
        value=""
        on:change={(e) => {
          if (article.id) {
            updateTag({ name: e.currentTarget.value, id: undefined });
          } else {
            article.tags[i] = { name: e.currentTarget.value };
          }
        }}
      >
    {/if}
  </div>
{/each}

{#if !article.id}
  <button on:click={() => {createArticle()}}>
    Create
  </button>
{/if}

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(article, null, 2)}</pre>
