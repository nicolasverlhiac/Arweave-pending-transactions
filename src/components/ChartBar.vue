<script setup>
import {toRefs} from 'vue' 
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

const props = defineProps(
  {
    data: Array,
    legend: Array
  }
)
const { data, legend } = toRefs(props);

var xAxisData = legend.value;
// var data1 = [];
// var data2 = [];
// for (var i = 0; i < 100; i++) {
//     xAxisData.push('%' + i);
//     data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
//     // data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
// }

const option = ref({
    title: {
        text: 'Test'
    },
    legend: {
        data: ['bar']
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    tooltip: {},
    xAxis: {
        data: xAxisData,
        splitLine: {
            show: false
        }
    },
    yAxis: {
    },
    series: [{
        name: 'bar',
        type: 'bar',
        data: data.value,
        emphasis: {
            focus: 'series'
        },
        animationDelay: function (idx) {
            return idx * 10;
        }
    }
    // , {
    //     name: 'bar2',
    //     type: 'bar',
    //     data: data2,
    //     emphasis: {
    //         focus: 'series'
    //     },
    //     animationDelay: function (idx) {
    //         return idx * 10 + 100;
    //     }
    // }
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
        return idx * 5;
    }
});

</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
<template>
  <v-chart class="chart" :option="option" />
</template>