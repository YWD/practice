<template>
  <div id="app">
    <h1>拉钩教育</h1>
    <h1>hello {{ message }}</h1>
    <input type="text" v-model="message">
  </div>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      message: 'world'
    }
  }
}
</script>

<style scoped>

</style>
