
<script lang="ts">
  import type { MisskeyFile } from "../lib/type";
  import { serverUrl } from "../lib/store";

  export let files: MisskeyFile[];
  let generatedText = "";

  const gen = () => {
    let flagSum = 0;

    if(files.length === 0) {
      generatedText = "まだファイルをチェックしていません。";
      return;
    }
    generatedText = `${new Date().toLocaleString()}\n`;
    generatedText += `${files.length}個のファイルをチェックしました。\n\n`;
    generatedText += `チェックを開始したファイルのID ： ${files[0].id} <https://${$serverUrl}/admin/file/${files[0].id}>\n`;
    generatedText += `チェックを開始したファイルの作成時刻 ： ${new Date(Date.parse(files[0].createdAt)).toLocaleString()}\n`;
    generatedText += `チェックを終了したファイルのID ： ${files[files.length - 1].id}  <https://${$serverUrl}/admin/file/${files[files.length - 1].id}>\n`;
    generatedText += `チェックを終了したファイルの作成時刻 ： ${new Date(Date.parse(files[files.length - 1].createdAt)).toLocaleString()}\n\n`;
    
    files.forEach((elem) => {
      if(elem.checked === true) flagSum++;
    })

    generatedText += `フラグを立てたファイルは${flagSum}個でした。\n`;
    generatedText += `続きをチェックする場合は \n`;
    generatedText += `<https://${$serverUrl}/admin/files> \n`
    generatedText += `または <https://uboar.github.io/misskey-drive-moderate-supporter?sinceId=${files[files.length - 1].id}> からチェック出来ます。`;
  }

  const genFlag = () => {
    generatedText = "";
    let flagImages: string[] = [];
    files.forEach((elem) => {
      if(elem.checked === true) {
        flagImages.push(`https://${$serverUrl}/admin/file/${elem.id}`)
      }
    })
    
    generatedText += `${flagImages.length}個のフラグを立てたファイルがありました。以下が一覧です。\n\n`;
    flagImages.forEach((elem, index) => {
      generatedText += `${index + 1} ： ${elem} \n`
    })
  }

  const copyToClipboard = () => {
    if(navigator.clipboard){
      navigator.clipboard.writeText(generatedText);
    }
  }
</script>


<input type="checkbox" id="report-dialog" class="modal-toggle" />
<div class="modal">
  <div class="modal-box lg:w-[800px]">
    <h2>報告用テンプレート文書作成</h2>
    <textarea class="textarea w-full my-2 textarea-bordered" bind:value={generatedText}></textarea>
    <div class="flex flex-wrap w-full justify-between gap-4">
      <button class="btn btn-primary btn-wide" on:click={gen}>生成</button>
      <button class="btn btn-warning" on:click={genFlag}>生成(フラグ概要)</button>
      <button class="btn btn-secondary btn-wide" on:click={copyToClipboard}>クリップボードにコピー</button>
      <label class="btn btn-outline" for="report-dialog">閉じる</label>
    </div>
  </div>
  <label class="modal-backdrop" for="report-dialog">Close</label>
</div>