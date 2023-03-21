<script lang="ts">
  import { onMount } from 'svelte';

  import { invalidate } from '$app/navigation';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: ({ supabase } = data);

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth');
    });

    return () => subscription.unsubscribe();
  });
</script>

<slot></slot>
