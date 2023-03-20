<script lang="ts">
  import { onMount } from 'svelte';

  import { goto, invalidate } from '$app/navigation';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: ({ supabase, session } = data);

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth');
    });

    return () => subscription.unsubscribe();
  });

  const signOut = async () => {
    supabase.auth.signOut();
    goto('/signin');
  }
</script>

{#if session}
  <button on:click={signOut}>SignOut</button>
{/if}

<slot></slot>
