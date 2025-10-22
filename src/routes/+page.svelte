<script lang="ts">
  import "@/others/global.scss";

  import { Check, Cookie, Croissant, Hamburger, Pizza, X } from "@lucide/svelte";
  import { Button, Checkbox, Details, Field, Input, Loading } from "$lib/components";
</script>

<div class="items">
  <div class="item button">
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
      <Button variant="outline">
        <Cookie /> Outline
      </Button>
      <Button variant="blank">
        <Croissant /> Blank
      </Button>
    </div>
    <div class="showcase">
      <Button variant="primary" disabled>
        <Hamburger /> Primary
      </Button>
      <Button variant="secondary" disabled>
        <Pizza /> Secondary
      </Button>
      <Button variant="outline" disabled>
        <Cookie /> Outline
      </Button>
      <Button variant="blank" disabled>
        <Croissant /> Blank
      </Button>
    </div>
    <div class="showcase">
      <Button variant="primary" rounded>
        <Check />
      </Button>
      <Button variant="secondary" rounded>
        <X />
      </Button>
    </div>
  </div>

  <div class="item checkbox">
    <h1 id="checkbox">
      Checkbox
    </h1>
    <hr />
    <div class="showcase">
      <Checkbox />
      <Checkbox active icon="hollow" />
      <Checkbox active icon="check" />
      <Checkbox active icon="x" />
      <Checkbox active icon="radio" />
      <Checkbox active icon={Hamburger} />
      <Checkbox active icon="custom">Hi</Checkbox>
    </div>
  </div>

  <div class="item details">
    <h1 id="details">
      Details
    </h1>
    <hr />
    <div class="showcase">
      <Details summary="Hello! #1" name="details-showcase">
        These are more details.
      </Details>
      <Details summary="Hello! #2" name="details-showcase">
        They can also be mutually exclusive.
      </Details>
      <Details summary="Summary blah blah blah.">
        <Details summary="BOO!" icon="single">
          <span>
            <Loading variant="ellipses" char="HA" duration={800} />
            You should've seen your face!
            <br /> <br />
            They're also stackable.
            <br />
            Doing so handsomely as well.
          </span>
        </Details>
      </Details>
    </div>
  </div>

  <div class="item field">
    <h1 id="field">
      Field
    </h1>
    <hr />
    <div class="showcase">
      <Field>
        Username
        <Input type="text" placeholder="john_doe" icon />
      </Field>
    </div>
    <div class="showcase">
      <Field horizontal>
        <Checkbox />
        Pineapple on pizza is a crime.
      </Field>
    </div>
  </div>

  <div class="item input">
    <h1 id="input">
      Input
    </h1>
    <hr />
    <div class="showcase">
      <Input type="email" placeholder="john_doe@example.com" />
      <Input type="password" placeholder="• • • • • • • • • • • •" />
    </div>
    <div class="showcase">
      <Input type="email" placeholder="john_doe@example.com" icon pastable />
      <Input type="password" placeholder="• • • • • • • • • • • •" icon />
    </div>
    <div class="showcase">
      <Input label="Email" type="email" placeholder="john_doe@example.com" icon pastable />
      <Input label="Password" type="password" placeholder="• • • • • • • • • • • •" icon />
    </div>
    <div class="showcase">
      <Input label="Search" type="search" placeholder="The Treasure" icon clearable actions-on-hover />
    </div>
    <div class="showcase">
      <Input type="url" placeholder="example.com" icon hidable copyable cuttable pastable clearable />
    </div>
    <div class="showcase">
      <Input type="url" placeholder="example.com" icon hidable copyable cuttable pastable clearable disabled />
    </div>
  </div>

  <div class="item loading">
    <h1 id="loading">
      Loading
    </h1>
    <hr />
    <div class="showcase">
      <Loading variant="spinner" icon="circle" />
      <Loading variant="spinner" icon="throbber" />
      <Loading variant="spinner" icon="pinwheel" />
      <Loading variant="spinner" icon="arrow" />
      <Loading variant="spinner" icon="circle" linear />
      <Loading variant="spinner" icon={Hamburger} linear />
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

  .details, .field {
    .showcase {
      align-self: stretch;
      flex-direction: column;
      align-items: stretch;
    }
  }

  .input {
    .showcase {
      align-self: stretch;
      :global > * { flex: 1; width: 100%; }
    }
  }
</style>
