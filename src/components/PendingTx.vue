<script setup>
import {toRefs} from 'vue' 
const props = defineProps(
  {
    pendingTx: Number,
  }
)
const { pendingTx } = toRefs(props);


</script>
<template>

    <div class="rounded-xl w-full bg-gray-800 shadow-sm">
                        
        <div class="text-white text-4xl font-semibold leading-normal pt-8 px-6 pb-6">
            <span v-if="pendingTx != 0" class="flex justify-between items-center ">
            {{pendingTx}} <span class="text-sm">Tx</span>
            </span>
            <span v-else>
            <svg class="animate-spin mx-auto h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            </span>
        </div>

        <div class="bg-black rounded-b-xl text-gray-400 text-xs uppercase leading-normal py-4 px-6">
            Pending Transactions <br>
            <span class="text-gray-500 text-xs normal-case ">Updated every 5 seconds</span>
        </div>

    </div>
</template>