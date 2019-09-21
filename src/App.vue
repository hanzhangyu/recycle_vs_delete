<template>
  <div>
    <div class="wrap">
      <button @click="mode = 'delete'">delete</button>
      <button @click="mode = 'recycle'">recycle</button>
    </div>
    <component :is="mode" :list="list"></component>
  </div>
</template>

<script>
import genList from "./utils/genList";
import Delete from "./DemoDelete.vue";
import Recycle from "./DemoRecycle.vue";
export default {
  name: "app",
  components: {
    Delete,
    Recycle,
  },
  data() {
    return {
      mode: "delete",
      list: [],
    };
  },
  mounted() {
    this.list = genList(1000);
  },
};
</script>

<style scoped>
.wrap {
  padding: 40px;
  text-align: center;
}
</style>
