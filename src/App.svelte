<script lang="ts">
    import { onMount } from "svelte";
  import { accessToken, serverUrl, updateCookie, getCookie } from "./lib/store";
  import type { MisskeyFile } from "./lib/type";
    import FileCard from "./components/FileCard.svelte";
    import FileModal from "./components/FileModal.svelte";
    import ReportModal from "./components/ReportModal.svelte";

  getCookie();

  onMount(() => {
    const serachParams = new URLSearchParams(window.location.search);
    if(serachParams.has("sinceId")) sinceId=serachParams.get("sinceId");
    if(serachParams.has("untilId")) untilId=serachParams.get("untilId");
  })

  const getFiles = async () => {
    try{
      const requestBody = {
        i: $accessToken,
        limit: 100,
      }
      if(files.length > 0) sinceId = files[files.length - 1].id;
      if(sinceId !== "") requestBody["sinceId"] = sinceId;
      if(untilId !== "") requestBody["untilId"] = untilId;
      
      const res = await fetch(`https://${$serverUrl}/api/admin/drive/files`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });
      
      files = [...files, ...await res.json()];
    }catch(err){
      console.error(err);
    }
  }

  let sinceId = "";
  let untilId = "";
  let files: MisskeyFile[] = [];
  
</script>

<main>
    <div class="sticky z-20 top-0 border-b-2 w-full bg-slate-300">
      <div class="p-4">
        <span class="font-bold text-3xl hidden lg:block">Misskey Drive Moderate Supporter</span>
        <span class="hidden lg:block">
          入力した情報はCookieに保存されます。
        </span>
        <div class="flex flex-wrap gap-2 md:gap-8 my-4">
          <div>
            <label for="server-url">サーバーURL</label>
            <input id="server-url" bind:value={$serverUrl} type="text" class="input input-xs md:input-md input-bordered md:w-96" placeholder="EX:voskey.icalo.net" on:input={updateCookie} />
          </div>
          <div>
            <label for="access-token">アクセストークン</label>
            <input id="access-token" bind:value={$accessToken} type="password" class="input input-xs md:input-md input-bordered md:w-96" on:input={updateCookie} />
          </div>
        </div>
        <div class="flex flex-wrap md:gap-8 gap-2">
          <div>
            <label for="since-id">sinceId</label>
            <input id="since-id" bind:value={sinceId} type="text" class="input input-xs md:input-md input-bordered w-72" />
          </div>
          <div>
            <label for="until-id">untilId</label>
            <input id="until-id" bind:value={untilId} type="text" class="input input-xs md:input-md input-bordered w-72" />
          </div>
          <button class="btn btn-sm md:btn-md md:btn-wide btn-primary" on:click={getFiles}>{(files.length > 0) ? "これより新しいファイルを取得" : "ファイルの取得"}</button>
          {#if files.length > 0}
            <button class="btn btn-sm md:btn-md btn-outline btn-primary" on:click={() => {files = []; getFiles();}}>バッファを削除して再取得</button>
            <label for="report-dialog" class="btn btn-sm md:btn-md btn-secondary">報告用テンプレート文書作成</label>
          {/if}
        </div>
      </div>
    </div>
    
    <div class="w-full">
      <div class="flex flex-wrap gap-2">
        {#each files as file, index}
          <FileCard {file} {index}></FileCard>
        {/each}
      </div>
    </div>
    <FileModal></FileModal>
    <ReportModal {files}></ReportModal>
</main>