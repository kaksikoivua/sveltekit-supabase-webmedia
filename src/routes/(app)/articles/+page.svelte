<script lang="ts">
  import List from '$lib/List.svelte';
  import { article } from '$lib/stores';

  import type { PageData } from './$types';

  export let data: PageData;

  $: articles = data.articles;

  const setToStore = (article) => {
    $article = article;
  };
</script>

<div><a href="/">Index</a></div>

<List
  appName="articles"
  items={articles}
  {setToStore}
  signedInCreator={data.signedInCreator}
/>
