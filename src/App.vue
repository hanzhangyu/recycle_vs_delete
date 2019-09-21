<template>
  <div>
    <div class="wrap">
      <button :disabled="lock" @click="mode = 'delete'">delete</button>
      <button :disabled="lock" @click="mode = 'recycle'">recycle</button>
    </div>
    <component :is="mode" :list="list" :next="handleNext"></component>
  </div>
</template>

<script>
import genList from "./utils/genList";
import Preformance from "./utils/Preformance";
import Delete from "./DemoDelete.vue";
import Recycle from "./DemoRecycle.vue";
import Starter from "./Starter.vue";
import Ender from "./Ender.vue";
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
      preformance: new Preformance(),
    };
  },
  data() {
    return {
      lock: true,
      mode: "starter",
      list: [],
    };
  },
  mounted() {
    this.list = genList(1000);
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
</style>
