<script lang="ts">
  import { goto } from '$app/navigation';

  export let items, mediaType, setToStore, signedInCreator;

  let isMyPostsOnly = false;
</script>

<h1>
  <a href={`/${mediaType}`}>
    {mediaType.charAt(0).toUpperCase() + mediaType.substring(1)}
  </a>
</h1>

{#if signedInCreator}
  <button on:click={() => (isMyPostsOnly = !isMyPostsOnly)}>
    {#if isMyPostsOnly}
      All
    {:else}
      My Posts Only
    {/if}
  </button>
{/if}

<ul>
  {#each items as item (item.id)}
    {#if !isMyPostsOnly || item.username === signedInCreator.username}
      <li>
        <a
          href={`/${mediaType}/${item.slug}`}
          on:click={() => setToStore(item)}
        >
          {item.title}
        </a>
        {#each item.tags as tag, i (i)}
          {#if tag}
            <a href={`/${mediaType}?tag=${tag.name}`} class="tag">{tag.name}</a>
          {/if}
        {/each}
        {#if item.profile.username === signedInCreator?.username}
          <button
            on:click={() => {
              setToStore(item);
              goto(`/admin/${mediaType}/${item.slug}`);
            }}
          >
            Edit
          </button>
        {/if}
      </li>
    {/if}
  {/each}
</ul>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(items, null, 2)}</pre>
