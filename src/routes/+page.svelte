<script lang="ts">
  import "@/others/global.scss";

  import { Cookie, Hamburger, Pizza } from "@lucide/svelte";
  import { Button, Checkbox, Loading } from "$lib/components";
</script>

<div class="items">
  <div class="item">
    <h1 id="button">
      Button
    </h1>
    <hr />
    <div class="showcase">
      <Button variant="primary">
        <Hamburger /> Primary
      </Button>
      <Button variant="secondary">
        <Pizza /> Secondary
      </Button>
      <Button variant="tertiary">
        <Cookie /> Tertiary
      </Button>
    </div>
    <div class="showcase">
      <Button variant="primary" disabled>
        <Hamburger /> Primary
      </Button>
      <Button variant="secondary" disabled>
        <Pizza /> Secondary
      </Button>
      <Button variant="tertiary" disabled>
        <Cookie /> Tertiary
      </Button>
    </div>
  </div>

  <div class="item">
    <h1 id="checkbox">
      Checkbox
    </h1>
    <hr />
    <div class="showcase">
      <Checkbox />
      <Checkbox active symbol="hollow" />
      <Checkbox active symbol="check" />
      <Checkbox active symbol="x" />
      <Checkbox active symbol="radio" />
      <Checkbox active symbol={Hamburger} />
      <Checkbox active symbol="custom">Hi</Checkbox>
    </div>
  </div>

  <div class="item">
    <h1 id="loading">
      Loading
    </h1>
    <hr />
    <div class="showcase">
      <Loading variant="spinner" symbol="throbber" />
      <Loading variant="spinner" symbol="circle" />
      <Loading variant="spinner" symbol="pinwheel" />
      <Loading variant="spinner" symbol="arrow" />
      <Loading variant="spinner" symbol="throbber" linear />
      <Loading variant="spinner" symbol="custom" icon={Hamburger} linear />
    </div>
    <div class="showcase">
      <Loading variant="ellipses" />
      <Loading variant="ellipses" char="z" stretch />
      <Loading variant="ellipses" text="Uploading" />
      <Loading variant="ellipses" text="Searching" count={0} />
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
    color: C(secondary);
    background-color: #000;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px;
    border: 2px solid C(tertiary);
    border-radius: 10px;

    h1 { margin: 0; }
    hr { width: 100%; margin: 0; border: 1px solid C(secondary); }

    .showcase {
      gap: 15px;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }
  }
</style>
