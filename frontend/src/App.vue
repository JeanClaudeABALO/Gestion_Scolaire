<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  /* Thème bleu (aligné sur Login/Inscription) */
  --primary-700: #0d47a1;
  --primary-600: #1565c0;
  --primary-500: #1e88e5;
  --primary-300: #85c1e9;

  --text-900: #1f2937;
  --text-700: #374151;
  --muted-600: #6b7280;
  --bg-50: #f7fbff;

  --radius-lg: 18px;
  --shadow-lg: 0 18px 55px rgba(0, 0, 0, 0.18);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #ffffff;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>
