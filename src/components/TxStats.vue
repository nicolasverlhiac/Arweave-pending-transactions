<script setup>
import {toRefs} from 'vue' 
import ChartBar from "./ChartBar.vue";
import ChartPie from './ChartPie.vue';
const props = defineProps(
  {
    data: Array,
    legend: Array
  }
)
const { data, legend} = toRefs(props);

function lovelyUniq(items) {
  return [...new Set(items)]
}

console.log(pie.value, "coucou pie")
// this.legend = lovelyUniq(this.legend)
</script>
<template>
    <div class="w-full text-center col-span-4 bg-white shadow-lg px-6 py-4 rounded-lg mb-8">

        <ChartBar :legend="lovelyUniq(legend)" :data="data"></ChartBar>
    </div>

</template>