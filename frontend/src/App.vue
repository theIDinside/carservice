<template>
<div class="site">
  <header>
  <div id="nav">
    <router-link to="/upload">Ladda upp ny besiktningslista</router-link> |
    <router-link to="/list">Lista alla fordon</router-link>
  </div>
  </header>
  <div class="maincontainer">
    <router-view />
  </div>
</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  border-top: 10px solid #829791c4;
  border-bottom: 20px solid #829791c4;
  border-radius: 0px 0px 15px 15px;
  width: 100%;
  margin: 0 auto;
}

#nav {
  padding: 0px;
  background: #829791c4;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
