<script lang="ts">
  import { goto } from '$app/navigation';

	import type { PageData } from './$types';

  export let data: PageData;

  $: supabase = data.supabase;

  let email = '';
  let username = '';
  let isNewRegistration = false;

  const signUp = async () => {
    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: 'PMccwYzAIxHHzzeCKBJE',
      options: {
        data: {
          username: username
        }
      }
    });
    goto('/');
  };

  const signIn = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'PMccwYzAIxHHzzeCKBJE'
    });
    goto('/');
  };
</script>

<label>
  Email:
  <input type="email" bind:value={email} placeholder="email@email.com">
</label>
{#if isNewRegistration}
  <label>
    Username:
    <input type="text" bind:value={username} placeholder="username">
  </label>
  <button on:click={signUp}>SignUp</button>
  <p on:click={() => (isNewRegistration = false)}>Already have an account?</p>
{:else}
  <button on:click={signIn}>SignIn</button>
  <p on:click={() => (isNewRegistration = true)}>Create a new account?</p>
{/if}
