<script lang="ts">
  import "@/others/global.scss";

  import { Ban, Hamburger } from "@lucide/svelte";
  import { Button, Checkbox, Loading } from "$lib/basic/index.js";
</script>

<div class="items">
  <div class="item">
    <h1>Button</h1>
    <hr />
    <div class="showcase">
      <Button variant="primary">
        <Hamburger /> Order
      </Button>
      <Button variant="secondary">
        <Ban /> Cancel
      </Button>
    </div>
  </div>

  <div class="item">
    <h1>Checkbox</h1>
    <hr />
    <div class="showcase">
      <Checkbox />
      <Checkbox active style="hollow" />
      <Checkbox active style="check" />
      <Checkbox active style="x" />
      <Checkbox active style="radio" />
      <Checkbox active style="custom">Hi</Checkbox>
    </div>
  </div>

  <div class="item">
    <h1>Loading</h1>
    <hr />
    <div class="showcase">
      <Loading style="throbber" />
      <Loading style="circle" />
      <Loading style="pinwheel" />
      <Loading style="arrow" />
      <Loading style="throbber" linear />
      <Loading style="custom" icon={Hamburger} linear />
      <Loading style="ellipses" />
      <Loading style="ellipses" char="z" />
      <Loading style="ellipses" text="Uploading" />
      <Loading style="ellipses" text="Searching" count={0} />
    </div>
  </div>
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  .items {
    flex: 1;
    align-self: center;
    justify-content: center;
    gap: 10px;
  }

  .item {
    font-family: Cascadia Code, monospace;
    background-color: #000;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px;
    border: 2px solid #1f1f1f;
    border-radius: 10px;

    h1 { margin: 0; }
    hr { width: 100%; margin: 0; }

    .showcase {
      gap: 15px;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    }
  }
</style>
