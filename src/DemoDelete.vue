<template>
  <main>
    <h1>delete</h1>
    <DeleteScroller
      :list="list"
      class="scroll-container"
      ref="scroller"
      @ready="handleStart"
    >
      <template v-slot="{ item, index }">
        <DeleteScrollerItem :item="item">
          <span>{{ item.title }}</span>
          <img :src="item.src" alt="商品图片" />
          <p>{{ item.content }}</p>
        </DeleteScrollerItem>
      </template>
    </DeleteScroller>
  </main>
</template>

<script>
import DeleteScroller from "./components/DeleteScroller.vue";
import DeleteScrollerItem from "./components/DeleteScrollerItem.vue";
export default {
  components: { DeleteScroller, DeleteScrollerItem },
  inject: ["performance"],
  props: ["list", "next"],
  mounted() {},
  methods: {
    async handleStart() {
      if(this.tested) return;
      this.tested = true;
      const ele = this.$refs.scroller.$el;
      const wrapper = ele.querySelector(".delete-scroller__wrapper");
      await this.performance.install("delete", ele, wrapper);
      this.next();
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-container {
  width: 500px;
  height: 700px;
  word-break: break-all;
  overflow: auto;
}
img {
  width: 50px;
  height: 50px;
}
</style>
