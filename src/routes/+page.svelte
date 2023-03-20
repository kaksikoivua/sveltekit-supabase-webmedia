<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  let loadedData = [];
  async function loadData() {
    const { data } = await data.supabase.from('test').select('*').limit(20);
    loadedData = data;
  }

  $: if (data.session) {
    loadData();
  }
</script>

{#if data.session}
  <p>client-side data fetching with RLS</p>
  <pre>{JSON.stringify(loadedData, null, 2)}</pre>
{/if}
