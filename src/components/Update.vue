<script setup>
import { ref } from 'vue'
import {version} from '../../package'

let isOldVersion = ref(0)
let lastVersion = ref("")
let lastVersionUrl = ref("")

getLastVersion();

function getLastVersion() {

    fetch('https://raw.githubusercontent.com/nicolasverlhiac/Arweave-pending-transactions/main/info.json')
      .then(
        response => response.json()
      )
      .then(
        json => {
          lastVersion.value = json.version
          lastVersionUrl.value = json.url
          console.log(lastVersionUrl.value)
          console.log(lastVersion.value, version)
          isOldVersion.value = compareVersion(lastVersion.value, version)
        }
      )
}

function compareVersion(v1, v2) {
    if (typeof v1 !== 'string') return false;
    if (typeof v2 !== 'string') return false;
    v1 = v1.split('.');
    v2 = v2.split('.');
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++ i) {
        v1[i] = parseInt(v1[i], 10);
        v2[i] = parseInt(v2[i], 10);
        if (v1[i] > v2[i]) return 1;
        if (v1[i] < v2[i]) return -1;        
    }
    return v1.length == v2.length ? 0: (v1.length < v2.length ? -1 : 1);
}
</script>

<template>
    <div class="w-full text-center col-span-4 bg-white shadow-lg px-6 py-4 rounded-lg mb-8" v-if="isOldVersion === 1">
        A new version of this app is available <a class="bg-white hover:bg-black border border-black ml-2 py-2 px-4 rounded-md text-gray-800 hover:text-white uppercase text-xs font-bold" :href="lastVersionUrl">switch now</a>
    </div>
</template>