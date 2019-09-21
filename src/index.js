import Vue from "vue";
import Stats from "stats.js";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue(App).$mount("#app");

window.stats = new Stats();
document.body.appendChild(stats.dom);
requestAnimationFrame(function loop() {
  stats.update();
  requestAnimationFrame(loop);
});
