<script lang="ts">
  import "$lib/styles/global.css";
  import { Checkbox } from "$lib/basic/index.js";
</script>

<div class="items">
  <div class="item">
    <h1>Checkbox:</h1>
    <div class="showcase-grid">
      <div class="row-title">
        <span>Active</span>
      </div>
      <div class="showcase">
        <Checkbox active style="hollow" />
        <Checkbox active style="check" />
        <Checkbox active style="radio" />
        <Checkbox active style="custom">Y</Checkbox>
      </div>

      <div class="row-title">
        <span>Inactive</span>
      </div>
      <div class="showcase">
        <Checkbox style="hollow" />
        <Checkbox style="check" />
        <Checkbox style="radio" />
        <Checkbox style="custom">N</Checkbox>
      </div>
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

    .showcase-grid{
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 10px;

      .row-title {
        color: C(secondary, 80%);
        align-items: end;
        justify-content: center;
      }

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
  }
</style>
