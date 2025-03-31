<template>
  <div id="app">
    <IdleGame />
  </div>
</template>

<script>
import IdleGame from './components/IdleGame.vue'

export default {
  name: 'App',
  components: {
    IdleGame
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}
</style>
