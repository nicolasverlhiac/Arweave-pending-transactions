<script setup>
import { ref } from 'vue'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import TxStats from './components/TxStats.vue';
import PendingTx from './components/PendingTx.vue';
import Update from './components/Update.vue';
import ChartPie from './components/ChartPie.vue';
import Popper from "vue3-popper";

let pendingTx = ref(0)
let searchTx = ref("")
let chunkFee = ref(0)
let fixedFees = ref(0)
let arPriceUSD = ref(0)
let chunkPriceUSD = ref(0)

let barData = ref([])
let barLegend = ref([])
let pieDistribution = ref([])

  getPrice();

  getPending()

  setInterval(() => {
      getPending();
  }, 10000)

  async function getPending(params) {

      fetch('https://arweave.net/tx/pending')
      .then(
      response => response.json()
      )
      .then(
          json => {
              pendingTx.value = Object.keys(json).length;

              test(JSON.stringify(json))
              
              // TODO : Search a transaction
              // json.forEach(function(item, index, array) {
              //   if (item == searchTx.value) {
              //     console.log(item, index);
              //   }
              
              // });
          }
      )
  }

  async function test(txs) {
    
    fetch('https://arweave.net/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 
          "query { transactions(first: 100, recipients: \"\", ids: "+txs+") {edges {cursor,node {fee {winston},data {size},quantity {winston},recipient}}}}"
        })
    })
      .then(r => r.json())
      .then(data => {
        console.log('data returned:', data.data.transactions.edges)
        // gettxs(data.data.transactions.edges)
        txDistribution(data.data.transactions.edges)
        getPriceAr()
        })
      .catch(e => {
        console.log(e)
      });
  }

  async function getPrice() {

    fetch('https://arweave.net/price/0')
      .then(
        response => response.json()
      )
      .then(
        json => {
          fixedFees.value = json

          fetch('https://arweave.net/price/1')
          .then(
            response => response.json()
          )
          .then(
            json => {
              // Variable = Chunk price
              chunkFee.value = json - fixedFees.value
            }
          )
        }
      )

    
  }

  async function getPriceAr() {

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd')
      .then(
        response => response.json()
      )
      .then(
        json => {
          arPriceUSD.value = json.arweave.usd
          chunkPriceUSD.value = (chunkFee.value / 1000000000000 * json.arweave.usd).toFixed(5) ;
        }
      )
  }

  function calculPrice(size) {
    //console.log(chunkFee.value, fixedFees.value)
    // * The price is no longer calculated per byte but by chunk of 256 x 1024 (262 144 byte)
    // * If a transaction sizes 2 bytes or 200 000 bytes, the price is always the same 
    // * If a transaction sizes 262 145 bytes, the price is doubled
    let chunk = 256 * 1024
    var nbChunk = Math.floor(size / chunk);
    if ( nbChunk == 0 ) {
      return chunkFee.value + fixedFees.value;
    }
    return ((nbChunk * chunkFee.value) + fixedFees.value)
  }

  // ((Va-Vd)/Vd)*100 
  function evolutionPourcentage(Va,Vd) {
    return ((Va-Vd)/Vd)*100 
  }

  function txDistribution (data) {

    var txFairPrice = 0
    var txOverPriced = 0
    var txUnderPriced = 0

    data.forEach(function(item, index, array) {

      if (item.node.quantity.winston > 0) {
        console.log("💰 donation")
      }
      
      if (calculPrice(item.node.data.size) > item.node.fee.winston) {
        console.error("Under price")
        txUnderPriced ++
      } else if (calculPrice(item.node.data.size) < item.node.fee.winston) {
        txOverPriced ++
      } else {
        txFairPrice ++
      }
    })

    pieDistribution.value = [txFairPrice, txOverPriced, txUnderPriced]
  }

  function gettxs(data) {

    let barData = []
    let barLegend = []    

    data.forEach(function(item, index, array) {
      // console.log(item.node.data.size, calculPrice(item.node.data.size), item.node.fee.winston);
      
      if (item.node.quantity.winston > 0) {
        console.log("💰 donation")
      }

      if (calculPrice(item.node.data.size) > item.node.fee.winston) {
        console.error("Under price")
      } else if (calculPrice(item.node.data.size) < item.node.fee.winston) {
        console.log("✅ price "+ evolutionPourcentage(item.node.fee.winston, calculPrice(item.node.data.size)).toFixed(1) + "%")
        barData.push(evolutionPourcentage(item.node.fee.winston, calculPrice(item.node.data.size)).toFixed(2))
        barLegend.push(evolutionPourcentage(item.node.fee.winston, calculPrice(item.node.data.size)).toFixed(1) + "%")
      } else {
        // Le bon prix
      }
            
    }, this);

    barData.value = barData
    barLegend.value = barLegend
  }

  
</script>

<template>
  <div class="">
    <Navbar></Navbar>
    <main>
      <section>
        <div class="container mx-auto px-4 mt-10 md:mt-40">
          <div class="flex content-center justify-center h-full">
            <div class="w-full h-auto lg:w-8/12 px-4">
              <div class="relative grid grid-cols-1 mb-6">

                <Update />

                <div class="grid grid-cols-4 grid-flow-row gap-4 mb-10">
                  <div class="col-span-4 md:col-span-2">
                    <PendingTx :pendingTx="pendingTx" />

                    <div class="flex">
                      <div class="rounded-xl w-32 h-32 bg-black shadow-sm mt-4 p-6  mr-4">
                        <div class="leading-normal flex items-center justify-between text-white text-md uppercase"><span>AR</span> 
                        <Popper 
                          arrow
                          content="USD price for 1 AR token, according to coingecko">
                          <span class="bg-white cursor-pointer rounded-full text-xs w-4 h-4 items-center justify-center flex  text-black">?</span> 
                        </Popper>

                        </div>
                        <div class="text-white leading-normal font-semibold text-xl mt-4">
                        ${{arPriceUSD}} 
                        </div>
                      </div>
                      <div class="rounded-xl w-full h-32 bg-gray-800 shadow-sm mt-4 p-6">
                        <div class="leading-normal flex items-center justify-between text-white text-md"><span>Data Chunk </span> 
                        <Popper 
                          arrow
                          content="A chunk of data is 256*1024 bytes. It's the minium size of data transaction on arweave network. This does not include the initial costs of a transaction which are very low. You can multiply this price by the number of 256 KB chunks needed to store your data.">
                          <span class="bg-white rounded-full text-xs min-w-4 w-4 min-h-4 h-4 items-center justify-center flex text-black">?</span>
                        </Popper>
                        </div>
                        <div class="text-white leading-normal font-semibold text-xl mt-4">
                        ${{chunkPriceUSD}} 
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  <div class="col-span-4 md:col-span-2">
                    <ChartPie :pieData="pieDistribution" />
                  </div>

                </div>

                <!-- <TxStats :data="barData" :legend="barLegend"></TxStats> -->


                <!-- <div class="rounded-xl w-full col-span-2 bg-white shadow-sm">
                    
                    <div class="text-white text-4xl font-semibold leading-normal py-8 px-6">
                      
                    </div>

                    <div class="bg-gray-200 rounded-b-xl text-gray-500 text-xs uppercase leading-normal py-4 px-6">
                        Pending Transactions
                    </div>

                </div>

                <div class="rounded-t mb-0 px-6 py-12">
                  <div class="text-center">

                    <p class="py-2">
                      <input v-model="searchTx" type="text" placeholder="" class="w-full rounded-2xl focus:ring-gray-900 focus:border-gray-900"/>
                    </p>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer></Footer>
  </div>
</template>

<style scoped>
  :deep(.popper) {
    background: #6B7280;
    padding: 10px;
    border-radius: 0.75rem;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    color: #fff;
    font-size: 12px;
    text-transform: none;
  }

  :deep(.popper #arrow::before) {
    background: #6B7280;
  }

  :deep(.popper:hover),
  :deep(.popper:hover > #arrow::before) {
    background: #6B7280;
  }
</style>