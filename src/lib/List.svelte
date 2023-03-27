<script lang="ts">
  import { goto } from '$app/navigation';

  export let items, mediaType, setToStore, username;
</script>

<h1>
  <a href={`/${mediaType}`}>
    {mediaType.charAt(0).toUpperCase() + mediaType.substring(1)}
  </a>
</h1>

<ul>
  {#each items as item (item.id)}
    <li>
      <a href={`/${mediaType}/${item.slug}`} on:click={() => setToStore(item)}>
        {item.title}
      </a>
      {#each item.tags as tag, i (i)}
        <a href={`/${mediaType}?tag=${tag.name}`} class="tag">{tag.name}</a>
      {/each}
      {#if item.username === username}
        <button on:click={() => goto(`/admin/${mediaType}/${item.id}`)}>
          Edit
        </button>
      {/if}
    </li>
  {/each}
</ul>

<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(items, null, 2)}</pre>
