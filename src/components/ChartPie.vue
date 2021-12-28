<script setup>
import {toRefs, watchEffect, ref} from 'vue' 
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";

import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";

use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
]);

const props = defineProps(
  {
    pieData: Array
  }
)
const { pieData } = toRefs(props);
let chartready = ref(false);
const option = ref()

watchEffect(() => {
    otionRefresh()
    if (pieData.value.length > 0) {
        chartready.value = true
    }
})

function otionRefresh() {
    option.value = {
        title: {
            text: 'Transaction fees balance'
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2,
                    name:"arweave transaction fees with tips",
                    show: true,
                    title: "Save",
                    emphasis: {
                        iconStyle: { 
                            textFill: "#1F2937"
                        }
                    }
                }
            }
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
        {
        name: 'Transactions Fees',
        type: 'pie',
        radius: ['40%', '70%'],
        color: [ "#9CA3AF", "#1F2937", "#F87171"],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
        },
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [
            { value: pieData.value[0], name: 'Right price' },
            { value: pieData.value[1], name: 'With tips' },
            { value: pieData.value[2], name: 'Under Price' }
        ]
        }
        ]
    };
}





</script>

<style scoped>
.chart {
  height: 290px;
}
</style>

<template>
    <div class="w-full text-center bg-white shadow-lg px-6 py-4 rounded-xl">
        <span v-if="!chartready" class="flex justify-between items-center ">
            <svg class="animate-spin mx-auto h-12 w-12 text-grey-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </span>
        <span v-else>
            <v-chart class="chart" :option="option" />
        </span>
    </div>
</template>