<script lang="ts">
  import { onMount } from "svelte";
  import { accessToken, serverUrl, updateCookie, getCookie, mediaWidth } from "./lib/store";
  import type { MisskeyFile } from "./lib/type";
  import FileCard from "./components/FileCard.svelte";
  import FileModal from "./components/FileModal.svelte";
  import ReportModal from "./components/ReportModal.svelte";

  let collapsed = false;

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
      if(sinceId !== "") {
        requestBody["sinceId"] = sinceId;
        untilId = "";
      }else if(untilId !== "") requestBody["untilId"] = untilId;
      
      const res = await fetch(`https://${$serverUrl}/api/admin/drive/files`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json() as MisskeyFile[];
      if((sinceId === "") && (untilId === "")) data.reverse();
      
      files = [...files, ...data];
    }catch(err){
      console.error(err);
    }
  }

  const getOldFiles = async  () => {
    try{
      const requestBody = {
        i: $accessToken,
        limit: 100,
      }
      sinceId = "";
      if(files.length > 0) untilId = files[0].id;
      if(untilId !== "") requestBody["untilId"] = untilId;

      const res = await fetch(`https://${$serverUrl}/api/admin/drive/files`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json() as MisskeyFile[];
      data.reverse();
      files = [...data, ...files];
    }catch(err) {
      console.log(err);
    }
  }

  let sinceId = "";
  let untilId = "";
  let files: MisskeyFile[] = [];
  
</script>

<main>
    <div class="sticky z-20 top-0 border-b-2 w-full bg-slate-300">
      {#if !collapsed}
        <div class="md:p-4">
          <span class="font-bold text-3xl hidden lg:block">Misskey Drive Moderate Supporter <span class="text-sm link"><a href="https://github.com/uboar/misskey-drive-moderate-supporter/blob/main/README.md" target="_blank">使い方</a></span></span>
          <span class="hidden lg:block">
            入力した情報はCookieに保存されます。
          </span>
          <div class="flex flex-wrap gap-2 md:gap-8 md:my-4">
            <div>
              <label for="server-url">サーバーURL</label>
              <input id="server-url" bind:value={$serverUrl} type="text" class="input input-xs md:input-md input-bordered md:w-64" placeholder="EX:voskey.icalo.net" on:input={updateCookie} />
            </div>
            <div>
              <label for="access-token">アクセストークン</label>
              <input id="access-token" bind:value={$accessToken} type="password" class="input input-xs md:input-md input-bordered md:w-64" on:input={updateCookie} />
            </div>
          </div>
          <div class="flex flex-wrap md:gap-4 gap-2 items-center">
            <div>
              <label for="since-id">sinceId</label>
              <input id="since-id" bind:value={sinceId} type="text" class="input input-xs md:input-md input-bordered w-32" />
            </div>
            <div>
              <label for="until-id">untilId</label>
              <input id="until-id" bind:value={untilId} type="text" class="input input-xs md:input-md input-bordered w-32" />
            </div>
            <div>
              <label for="until-width">メディア幅</label>
              <input id="media-width" bind:value={$mediaWidth} type="number" class="input input-xs md:input-md input-bordered w-32" on:input={updateCookie} />
            </div>
            <button class="btn btn-sm md:btn-md md:btn-wide btn-primary" on:click={getFiles}>{(files.length > 0) ? "これより新しいファイルを取得" : "ファイルの取得"}</button>
            {#if files.length > 0}
              <button class="btn btn-sm md:btn-md md:btn-wide btn-accent" on:click={getOldFiles}>これより古いファイルを取得</button>
            {/if}
            {#if files.length > 0}
              <button class="btn btn-sm md:btn-md btn-outline btn-primary" on:click={() => {files = []; getFiles();}}>バッファを削除して再取得</button>
              <label for="report-dialog" class="btn btn-sm md:btn-md btn-secondary">報告用テンプレート文書作成</label>
            {/if}
            <button class="btn btn-info btn-sm md:btn-md" on:click={() => {collapsed = true}}>畳む</button>
          </div>
        </div>
      {:else}
        <div class="flex">
          <button class="btn btn-sm btn-wide max-w-[50%] btn-primary" on:click={getFiles}>{(files.length > 0) ? "これより新しいファイルを取得" : "ファイルの取得"}</button>
          <button class="btn btn-info btn-sm max-w-[50%] btn-wide" on:click={() => {collapsed = false}}>開く</button>
        </div>
      {/if}
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