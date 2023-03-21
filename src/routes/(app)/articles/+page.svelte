<script lang="ts">
  import List from '$lib/List.svelte';

  import type { PageData } from './$types';

  export let data: PageData;

  const articles = data.articles;
</script>

<div><a href="/">Index</a></div>

<List heading="Articles" items={articles}/>
