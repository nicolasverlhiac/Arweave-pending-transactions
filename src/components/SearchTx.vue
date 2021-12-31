<script setup>
import { time } from 'echarts/core'
import {toRefs, ref} from 'vue' 
let searchedTx = ref("")
let searchedTxIsInError = ref(0)
let isSearching = ref(0)
let transaction = ref()
let ARUSD = ref(0)


const props = defineProps(
  {
    pendingTxs: Array
  }
)
const { pendingTxs } = toRefs(props);
getPriceAr()

/**
 * 1 - Search in pending transactions the string (The full or partial iD)
 * 2 - If we can't find the ID AND it is complete, we look for it directly via the API
 */
function searchTx({target}) {

    let searchInput = target.value
    isSearching.value = 1
    searchedTxIsInError.value = 0
    transaction.value = ""

    if(searchInput.length == 43) {
        searchedTx.value = searchInput
        findTx(searchInput)
    } else if (searchInput.length == 0) {
        searchedTxIsInError.value = 0
    } else {
        searchedTxIsInError.value = 1
        isSearching.value = 0
    }
}

async function findTx(tx) {

    fetch('https://arweave.net/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: 'query {transaction(id: "'+tx+'" ) {id, owner {address}, recipient, fee {winston}data {size}quantity {winston,ar},block {id,timestamp,height}}}'
            })
        })
      .then(r => r.json())
      .then(data => {
        transaction.value = data.data.transaction
        isSearching.value = 0
        })
      .catch(e => {
            console.log("Error GraphQl: " + e)
            searchedTxIsInError.value = 1
            isSearching.value = 0
      });
}

function dateFromTime(timestamp) {
    /**
     * Since the JavaScript date is in the millisecond unit while the Unix date 
     * is in the second unit, we can multiply 1000 to convert 
     * the Unix date to the JavaScript date. 
     */
    var date = new Date(timestamp * 1000);
    return date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          ", "+("0" + date.getHours()).slice(-2)+
          ":"+("0" + date.getMinutes()).slice(-2)+
          ":"+("0" + date.getSeconds()).slice(-2)
}
function priceArConverter(winston) {
    return (winston / 1000000000000).toFixed(8)
}



function convertAr2USD(winston) {
    return ((winston / 1000000000000) * ARUSD.value).toFixed(5)
}

async function getPriceAr() {

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd')
      .then(
        response => response.json()
      )
      .then(
        json => {
          ARUSD.value = json.arweave.usd
        }
      )
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

</script>

<template>
    <div class="rounded-t mb-0 pb-6 md:py-10">


            
                <div class="relative my-0 md:my-2">
                    <input @input="searchTx" class="focus:ring ring-gray-700 ring-offset-0 outline-none text-gray-700 shadow w-full rounded-lg border-0 p-3 mb-3" placeholder="Search transaction by ID...">
                    
                    <div class="absolute top-0 right-0 mt-4 mr-4 text-purple-lighter">
                        <svg version="1.1" class="h-4 text-dark" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 52.966 52.966" style="enable-background:new 0 0 52.966 52.966;" xml:space="preserve">
                            <path d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
                            c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
                            C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
                            S32.459,40,21.983,40z"/>

                        </svg>
                    </div>
                </div>
                
                <div v-if="isSearching != 0">
                    <svg class="animate-spin mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>

                <div v-if="searchedTxIsInError === 1">
                    Oops, impossible to find this transaction
                </div>
                
                <div v-if="transaction" class="rounded-xl w-full bg-gray-800 shadow-sm">
                        
                    <div class="text-white text-lg font-light leading-normal pt-8 px-6 pb-6">
                        <div class="flex justify-between items-center ">
                        

                            <div class="flex justify-between items-center">
                                <div class="flex-none bg-white rounded-lg p-2 w-10 h-10">

                                    <span v-if="transaction.data.size > 0">
                                        <svg version="1.1" baseProfile="tiny" id="Calque_1"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 258 258"
                                        overflow="visible" xml:space="preserve">
                                        <path fill="#1F2937" d="M227.6,205.2V53.2C227.6,22.6,175.9,6,127.2,6S26.9,22.6,26.9,53.2v151.7c0,30.6,51.7,47.2,100.4,47.2
                                            C175.9,252,227.6,235.8,227.6,205.2L227.6,205.2z M208.7,104.1c0,11.7-31.7,28.3-81.5,28.3s-81.5-17-81.5-28.3V81.8
                                            c19.2,12.5,50.9,18.9,81.5,18.9s62.3-6.4,81.5-18.9V104.1z M45.7,132.4c19.2,12.5,50.9,18.9,81.5,18.9s62.3-6.4,81.5-18.9v22.3
                                            c0,11.7-31.7,28.3-81.5,28.3s-81.5-17-81.5-28.3L45.7,132.4z M127.2,24.9c49.8,0,81.5,17,81.5,28.3S177,81.5,127.2,81.5
                                            s-81.5-17-81.5-28.3S77.4,24.9,127.2,24.9z M45.7,205.2V183c19.2,12.5,50.9,18.9,81.5,18.9s62.3-6.4,81.5-18.9v22.3
                                            c0,11.7-31.7,28.3-81.5,28.3S45.7,216.5,45.7,205.2z"/>
                                        </svg>
                                    </span>
                                    <span v-else>
                                        <svg version="1.1" baseProfile="tiny" id="Calque_1"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 258 258"
                                        overflow="visible" xml:space="preserve">
                                        <path fill="#1F2937" d="M191.3,31c-2.7,0.1-5.3,1.1-7.7,2.8c-6.2,4.6-7.5,13.3-2.8,19.5L206,87H24c-7.7,0-14,6.3-14,14
                                            c0,7.7,6.3,14,14,14h210c7.7,0,14-6.3,14-14c0-4.4-2.3-6.8-4.2-9.8l-40.5-54.5C200.5,32.8,195.8,30.8,191.3,31L191.3,31z M24,143
                                            c-7.7,0-14,6.3-14,14c0,4.4,2.3,6.8,4.2,9.8l40.5,54.5c2.9,3.9,7.5,5.9,12,5.7c2.7-0.1,5.3-1.1,7.7-2.8c6.2-4.6,7.5-13.3,2.8-19.5
                                            L52,171h182c7.7,0,14-6.3,14-14c0-7.7-6.3-14-14-14L24,143L24,143z"/>
                                        </svg>
                                    </span>

                                </div>
                                <span class="ml-4 text-sm flex flex-wrap">
                                    <span class=" min-w-full">{{transaction.id}}</span>
                                    
                                    <span v-if="transaction.data.size > 0" class="bg-gray-700 text-xs text-gray-200 p-1 px-2 rounded-md">
                                        {{formatBytes(transaction.data.size)}}
                                    </span>
                                    <span v-else class="bg-gray-700 text-xs text-gray-200 p-1 px-2 rounded-md">
                                        {{priceArConverter(transaction.quantity.winston)}} AR 
                                    </span>

                                    <span v-if="transaction.data.size == 0" class="bg-gray-900 text-xs text-gray-400 p-1 px-2 rounded-md ml-2">
                                        ${{convertAr2USD(transaction.quantity.winston)}}
                                    </span>
                                    
                                </span>
                            </div>

                            <div v-if="transaction.block">
                                <span class="text-sm bg-green-900 text-xs text-green-400 font-semibold py-2 px-3 rounded-lg">Confirmed </span>
                            </div>
                            <div v-else>
                                <span class="text-sm text-gray-900 font-semibold bg-white py-2 px-3 rounded-lg animate-pulse">Pending ...</span>
                            </div>
                            
                        </div>
                        
                        <div class="text-gray-400 text-xs mt-6">
                            Fees are 
                            <span class="text-gray-300 font-semibold">{{priceArConverter(transaction.fee.winston)}} AR </span>
                            <span class="bg-gray-900 text-xs text-gray-400 p-1 rounded-md">
                                ${{convertAr2USD(transaction.fee.winston)}}
                            </span>
                            <!-- <span class="bg-green-900 text-xs text-green-400 p-1 ml-2 rounded-md">
                                overpriced by x 1.2
                            </span> -->
                        </div>
                    </div>

                    <div class="text-gray-500 text-xs normal-case bg-black rounded-b-xl leading-normal py-4 px-6 flex justify-between items-center">
                        <div v-if="transaction.recipient">
                            From <span class="text-gray-400">{{transaction.owner.address}}</span>
                            <br> To <span class="text-gray-400">{{transaction.recipient}}</span>
                        </div>
                        <div v-else>
                            From <span class="text-gray-400">{{transaction.owner.address}}</span>
                        </div>

                        <div v-if="transaction.block" class="text-right">
                            Added on <span class="text-gray-400 text-xs uppercase">{{dateFromTime(transaction.block.timestamp)}}</span> <br>
                            Block <span class="text-gray-400 text-xs uppercase">{{transaction.block.height}}</span> 
                        </div>
                    </div>

                </div>  
    </div>
</template>