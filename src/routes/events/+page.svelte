<script lang="ts">
  import type { PageData } from "./$types";
  import Event from "./Event.svelte";
  import type { VenueEvent } from "$lib/types";
  import { faAdd, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { enhance } from "$app/forms";

  let { data }: { data: PageData } = $props();

  let events: Array<VenueEvent> = $state(data.events);

  let upcomingEvents: Array<VenueEvent> = $derived(
    events
      .filter((event) => new Date(event.date) > new Date())
      .toSorted(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
  );

  let pastEvents: Array<VenueEvent> = $derived(
    events
      .filter((event) => new Date(event.date) < new Date())
      .toSorted(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
      .reverse(),
  );

  let entryMode: boolean = $state(false);

  function createEvent({ formData }: { formData: FormData }) {
    entryMode = false;

    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        events.push(result.data.events[0]);
      } else if (result.type === "error") {
        // Handle errors if necessary
        console.error("Form submission failed:", result.status);
      }
    };
  }
</script>

<svelte:head>
  <title>Events</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <h1>Events</h1>
  {#if !entryMode}
    <button type="button" class="post action" onclick={() => (entryMode = true)}
      ><Fa icon={faAdd} /> add new</button
    >
  {:else}
    <h2><strong>Add new event</strong></h2>
    <form
      class="newEvent"
      method="POST"
      action="?/create_event"
      autocomplete="off"
      use:enhance={createEvent}
    >
      <label for="title">Title</label>
      <input id="title" name="title" required />
      <label for="date">Date</label>
      <input id="date" type="datetime-local" name="date" required />
      <hr class="dim" />
      <label id="description" for="description">Description</label>
      <textarea name="description" spellcheck="false"></textarea>
      <br />
      <button type="submit" class="post action"
        ><Fa icon={faSave} /> save</button
      >
      <button
        type="button"
        class="post action"
        onclick={() => (entryMode = false)}><Fa icon={faXmark} /> cancel</button
      >
    </form>
  {/if}
  <h2><strong>Upcoming events</strong></h2>
  <ul class="eventList">
    {#each upcomingEvents as event (event.slug)}
      <li>
        <Event {...event} detailed={false} />
      </li>
    {/each}
  </ul>

  <h2><strong>Past events</strong></h2>
  <ul class="eventList">
    {#each pastEvents as event (event.slug)}
      <li>
        <Event {...event} detailed={false} />
      </li>
    {/each}
  </ul>
</section>

<style>
  ul.eventList {
    padding-left: 0;
  }

  ul.eventList li {
    list-style: none;
  }
</style>
