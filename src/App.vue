<template>
  <div>
    <div class="links">
      <a
        href="https://raw.githubusercontent.com/hanzhangyu/recycle_vs_delete/master/src/assets/img/result.png"
        target="_blank"
        >查看结果截图</a
      >
      <a href="https://github.com/hanzhangyu/recycle_vs_delete">github</a>
    </div>
    <div class="wrap">
      <button :disabled="lock" @click="mode = 'delete'">delete</button>
      <button :disabled="lock" @click="mode = 'recycle'">recycle</button>
    </div>
    <component :is="mode" :next="handleNext"></component>
  </div>
</template>

<script>
import Performance from "./utils/Performance";
import Delete from "./DemoDelete.vue";
import Recycle from "./DemoRecycle.vue";
import Starter from "./Starter.vue";
import Ender from "./Ender.vue";
import buy from "/assets/img/buy.png";
import cry from "/assets/img/cry.png";

export default {
  name: "app",
  components: {
    Delete,
    Recycle,
    Starter,
    Ender,
  },
  provide() {
    return {
      performance: new Performance(),
      imgs: { buy, cry },
      list: this.list,
      appStatus: this.appStatus,
    };
  },
  data() {
    return {
      appStatus: {
        fetched: false,
      },
      lock: true,
      mode: "starter",
      list: [],
    };
  },
  async mounted() {
    this.list.push(
      ...(await fetch(
        "https://hanzhangyu.github.io/data/recycle_vs_delete.json",
      ).then(res => res.json())),
    );
    this.appStatus.fetched = true;
  },
  methods: {
    handleNext() {
      switch (this.mode) {
        case "starter":
          this.mode = "delete";
          break;
        case "delete":
          this.mode = "recycle";
          break;
        case "recycle":
          this.mode = "ender";
          this.lock = false;
          break;
        default:
      }
    },
  },
};
</script>

<style scoped>
.wrap {
  padding: 40px;
  text-align: center;
}
button:disabled {
  cursor: not-allowed;
}
.links {
  float: right;
}
</style>
<style>
canvas {
  display: inline-block !important;
}
button {
  cursor: pointer;
}
</style>
