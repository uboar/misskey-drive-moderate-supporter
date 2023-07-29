import { writable } from "svelte/store";
import { get } from "svelte/store";
import type { MisskeyFile } from "./type";

export const serverUrl = writable("");
export const accessToken = writable("");
export const selectedFile = writable<MisskeyFile>()

export const getCookie = () => {
  const cookies = document.cookie;
  if(cookies !== ""){
    const strArr = cookies.split("; ");
    strArr.forEach((elem) => {
      if(elem.startsWith("accessToken")) {
        accessToken.set(elem.replace(/accessToken=/, ""));
      }
      if(elem.startsWith("serverUrl")) {
        serverUrl.set(elem.replace(/serverUrl=/, ""));
      }
    })
  }
}

export const updateCookie = () => {
  document.cookie = `accessToken=${get(accessToken)}; Max-Age=50000000`;
  document.cookie = `serverUrl=${get(serverUrl)}; Max-Age=50000000`;
}