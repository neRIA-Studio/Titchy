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
      <Checkbox active symbol="hollow" />
      <Checkbox active symbol="check" />
      <Checkbox active symbol="x" />
      <Checkbox active symbol="radio" />
      <Checkbox active symbol={Hamburger} />
      <Checkbox active symbol="custom">Hi</Checkbox>
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
        <Details summary="BOO!" chevron="single">
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
        <Input type="url" placeholder="john_doe" />
      </Field>
    </div>
    <div class="showcase">
      <Field horizontal>
        <Checkbox />
        Pineapple on pizza is a crime.
      </Field>
    </div>
  </div>

  <div class="item loading">
    <h1 id="loading">
      Loading
    </h1>
    <hr />
    <div class="showcase">
      <Loading variant="spinner" symbol="circle" />
      <Loading variant="spinner" symbol="throbber" />
      <Loading variant="spinner" symbol="pinwheel" />
      <Loading variant="spinner" symbol="arrow" />
      <Loading variant="spinner" symbol="circle" linear />
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

  .details {
    .showcase {
      align-self: stretch;
      flex-direction: column;
      align-items: stretch;
    }
  }

  .field {
    .showcase {
      align-self: stretch;
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
