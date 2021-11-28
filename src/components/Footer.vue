<template>
  <footer class="w-full bottom-0 pb-6">
    <div class="container mx-auto px-4">
      <div
        class="flex flex-wrap items-center md:justify-between justify-center"
      >
        <div class="w-full px-4">
          <div class="text-sm text-gray-700 py-1">
            © {{date}}
             <a href="https://ownbase.org" target="_blanck" class="text-gray-700 hover:text-gray-400 text-sm py-1 px-3">Ownbase</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      date: new Date().getFullYear()
    }
  }
}
</script>