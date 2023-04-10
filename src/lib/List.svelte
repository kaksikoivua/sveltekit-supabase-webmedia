<script lang="ts">
  import { goto } from '$app/navigation';

  export let appName, items, setToStore, signedInCreator;

  let isMyPostsOnly = false;
</script>

<h1>
  <a href={`/${appName}`}>
    {appName.charAt(0).toUpperCase() + appName.substring(1)}
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
    {#if !isMyPostsOnly || item.profile.username === signedInCreator.username}
      <li>
        <a
          href={`/${appName}/${item.slug}`}
          on:click={() => setToStore(item)}
        >
          {item.title}
        </a>
        {#each item.tags as tag, i (i)}
          {#if tag}
            <a href={`/${appName}?tag=${tag.name}`} class="tag">{tag.name}</a>
          {/if}
        {/each}
        {#if item.profile.username === signedInCreator?.username}
          <button
            on:click={() => {
              setToStore(item);
              goto(`/admin/${appName}/${item.slug}`);
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
