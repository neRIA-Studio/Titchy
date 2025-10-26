<script lang="ts">
  import "@/others/global.scss";

  import { Check, Cookie, Croissant, Hamburger, Pizza, X } from "@lucide/svelte";
  import { Accordion, Button, Checkbox, Field, Input, Loading, Overlay, useToaster } from "$lib/components";

  const toaster = useToaster();

  let absoluteOverlayActive = $state(false);
  let fixedOverlayActive    = $state(false);
</script>

<div class="items">
  <div class="item accordion">
    <h1 id="accordion">
      Accordion
    </h1>
    <hr />
    <div class="showcase">
      <Accordion summary="Hello! #1" name="accordion-showcase">
        These are more details.
      </Accordion>
      <Accordion summary="Hello! #2" name="accordion-showcase">
        They can also be mutually exclusive.
      </Accordion>
      <Accordion summary="Summary blah blah blah.">
        <Accordion summary="BOO!" icon="single">
          <span>
            <Loading variant="ellipses" char="HA" duration={800} />
            You should've seen your face!
            <br /> <br />
            They're also stackable.
            <br />
            Doing so handsomely as well.
            <br />
            With custom icons if you desire.
          </span>
        </Accordion>
      </Accordion>
    </div>
  </div>

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
      <Input
        type="email"
        placeholder="john_doe@example.com"
        icon
        side-actions={{ pastable: 'always' }}
      />
      <Input
        type="password"
        placeholder="• • • • • • • • • • • •"
        icon
        side-actions={{ hidable: 'always' }}
      />
    </div>
    <div class="showcase">
      <Input
        label="Email"
        type="email"
        placeholder="john_doe@example.com"
        icon
        side-actions={{ pastable: 'always' }}
      />
      <Input
        label="Password"
        type="password"
        placeholder="• • • • • • • • • • • •"
        icon
        side-actions={{ hidable: 'always' }}
      />
    </div>
    <div class="showcase">
      <Input
        label="Search"
        type="search"
        placeholder="The Treasure"
        icon
        side-actions={{
          clearable: 'always',
          hidable:   'hover',
        }}
      />
    </div>
    <div class="showcase">
      <Input
        type="url"
        placeholder="example.com"
        icon
        side-actions={{
          hidable:   'always',
          cuttable:  'always',
          copyable:  'always',
          pastable:  'always',
          clearable: 'always',
        }}
      />
    </div>
    <div class="showcase">
      <Input
        type="url"
        placeholder="example.com"
        icon
        disabled
        side-actions={{
          hidable:   'always',
          cuttable:  'always',
          copyable:  'always',
          pastable:  'always',
          clearable: 'always',
        }}
      />
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

  <div class="item overlay">
    <h1 id="overlay">
      Overlay
    </h1>
    <hr />
    <div class="showcase">
      <Button onclick={() => absoluteOverlayActive = true}>
        Show Absolute Overlay
      </Button>
      <Button onclick={() => fixedOverlayActive = true}>
        Show Fixed Overlay
      </Button>
    </div>
    <Overlay bind:active={absoluteOverlayActive} fill="absolute" center>
      <span>This is an absolute overlay.</span>
      <span>Click to dismiss.</span>
    </Overlay>
    <Overlay bind:active={fixedOverlayActive} fill="fixed" center>
      <span>This is a fixed overlay.</span>
      <span>Click to dismiss.</span>
    </Overlay>
  </div>

  <div class="item toast">
    <h1 id="toast">
      Toast
    </h1>
    <hr />
    <div class="showcase">
      <Button
        onclick={() => toaster.add({
          type:    'info',
          title:   'BOO!',
          content: 'Bet you got scared again.',
          dismissible: true,
        })}
      >
        Show Info
      </Button>
      <Button
        onclick={() => toaster.add({
          type:    'success',
          title:   'BOO!',
          content: 'Bet you got scared again.',
          dismissible: true,
        })}
      >
        Show Success
      </Button>
      <Button
        onclick={() => toaster.add({
          type:    'warn',
          title:   'BOO!',
          content: 'Bet you got scared again.',
          dismissible: false,
        })}
      >
        Show Warn
      </Button>
      <Button
        onclick={() => toaster.add({
          type:    'error',
          title:   'BOO!',
          content: 'Bet you got scared again.',
          dismissible: false,
        })}
      >
        Show Error
      </Button>
      <Button
        onclick={() => toaster.add({
          type:    'danger',
          title:   'BOO!',
          content: 'Bet you got scared again.',
          dismissible: false,
        })}
      >
        Show Danger
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  .items {
    flex: 1;
    align-self: center;
    gap: 10px;
  }

  .item {
    color: C(secondary);
    background-color: #000;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px;
    border: 2px solid C(tertiary);
    border-radius: V(radius-1);
    overflow: hidden;

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

  .accordion, .field {
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
