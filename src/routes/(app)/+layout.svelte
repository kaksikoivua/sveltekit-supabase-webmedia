<script lang="ts">
  import { goto } from '$app/navigation';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: ({ supabase, session } = data);

  const signOut = async () => {
    let { error } = await supabase.auth.signOut();
    goto('/signin');
  };
</script>

{#if session}
  <button on:click={signOut}>SignOut</button>
{/if}

<slot></slot>
