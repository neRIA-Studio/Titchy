> ## [titchy](https://www.oxfordlearnersdictionaries.com/definition/english/titchy) <sub>/ˈtɪtʃi/</sub>
> <sup>(adj. _British English • informal_)</sup> \
>  very small. \
>  _"a titchy theatre"_

<sup>_Source: Oxford Dictionary._</sup>

---

A UI kit for Svelte, made for [me](https://github.com/IamFastre) really, but I thought why not make it public. \
Originally, it's a bunch of collected components from my other projects, they're simple wrappers around HTML elements
or just really simple components, hence the name `Titchy`.

And please don't be mad at the fact that they're made in `flex-box`, it's what most my projects use mainly.

# Installation

It goes without saying you need the `svelte` package, but also you need the `@lucide/svelte`
which I may put an effort on not making it _needed_, just make it optional or include the icons in the files,
or I just fucking add it to my node `dependencies`.

```bash
npm install titchy @lucide/svelte
```

# Usage

Just import the styles, then use it like it's a component of yours!

_Example:_

```svelte
<script lang="ts">
  import "titchy/styles";
  import { Button, Checkbox } from "titchy";

  let userHasLife = $state<boolean>(false);

  const onConfirm = () => alert(userHasLife ? "Damn liar." : "No one's surprised.");
  const onCancel  = () => alert("Coward.");
</script>

<main>
  <div class="question-of-the-year">
    <Checkbox bind:active={userHasLife} />
    <span>Do you have a life?</span>
  </div>
  <div class="actions">
    <Button onclick={onConfirm}>
      Confirm
    </Button>
    <Button onclick={onCancel} variant="secondary">
      Cancel
    </Button>
  </div>
</main>

<style lang="scss">
  main {
    /* I'm a flex guy. In fact, the whole kit is laid out in flex-box. */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .question-of-the-year,
  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

  }

  /* You can change the kit-wise variables in your global styles file,
     also every component has its custom variables prefixed with `--{component-name}`. */
  :global .titchy {
    --titchy-color-accent: cyan;
  }
</style>
```
