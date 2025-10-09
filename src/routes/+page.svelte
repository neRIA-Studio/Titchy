<script lang="ts">
  import "$lib/styles/global.css";
  import { Checkbox } from "$lib/basic/index.js";
</script>

<div class="items">
  <div class="item">
    <h1>Checkbox:</h1>
    <div class="showcase">
      <Checkbox />
      <Checkbox active style="hollow" />
      <Checkbox active style="check" />
      <Checkbox active style="x" />
      <Checkbox active style="radio" />
      <Checkbox active style="custom">Hi</Checkbox>
    </div>
  </div>
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  .items {
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .item {
    background-color: #000;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px;
    border: 2px solid #1f1f1f;
    border-radius: 10px;

    h1 { margin: 0; }

    .showcase {
      gap: 15px;
      flex-direction: row;
      align-items: center;

      :global(>:last-child) {
        --checkbox-color: cyan;
        font-family: monospace;
      }
    }
  }
</style>
