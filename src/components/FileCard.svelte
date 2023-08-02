<script lang="ts">
  import type { MisskeyFile } from "../lib/type";
  import { serverUrl, selectedFile, mediaWidth } from "../lib/store";
  export let file: MisskeyFile;
  export let index : number;
</script>

<div class="card card-bordered card-compact {(file.isSensitive) ? "border-red-500" : ""} {(file.checked) ? "bg-red-100" : "bg-base-200"}">
  <div class="card-body">
    <div class="grid grid-cols-2">
      <div class="font-bold">{ index + 1 }<span class="text-xs text-red-600">{ (file.isSensitive) ? "（センシティブ）" : "" }</span></div>
      <div class="w-full text-xs text-end">{ file.type }</div>
    </div>
    <a href={file.url} target="_blank">
      {#if file.type.startsWith("image")}
        <img loading="lazy" class="media object-contain bg-white" src={file.thumbnailUrl} alt={file.url} style="--size: {$mediaWidth}px" />
      {:else if file.type.startsWith("video")}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video controls src={file.url} class="bg-white" width={$mediaWidth} height={$mediaWidth} />
      {:else if file.type.startsWith("audio")}
        <audio controls src={file.url} class="bg-white media" style="--size: {$mediaWidth}px"></audio>
      {:else}
        <div class="alert w-full audio">{file.name}</div>
      {/if}
    </a>
    <div class="text-sm font-bold truncate title" style="--size: {$mediaWidth}px">
      <p>{file.name}</p>
    </div>
    <div class="text-sm">
      <a href={`https://${$serverUrl}/admin/file/${file.id}`} tabindex="-1" target="_blank" class="link">ID : {file.id}</a>
      <p>{new Date(Date.parse(file.createdAt)).toLocaleString()}</p>
    </div>
    <a class="badge badge-primary badge-outline" tabindex="-1" href={`https://${$serverUrl}/@${file.user.username}`}  target="_blank">
      @{ file.user.username }
    </a>
    <div class="grid grid-cols-2 items-center">
      <label class="label cursor-pointer w-fit">
        <span class="label-text mr-3">フラグ</span>
        <input type="checkbox" bind:checked={file.checked} class="checkbox checkbox-error" tabindex={index} />
      </label>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- <label for="file-details-dialog" class="btn btn-info btn-outline btn-sm" on:click={() => {$selectedFile = file}} tabindex="-1">詳細</label> -->
    </div>
  </div>
</div>

<style>
  .media {
    width: var(--size);
    height: var(--size);
  }

  .title {
    width: var(--size)
  }
</style>