<template>
  <main>
    <h1>recycle</h1>
    <RecycleScroller
      :list="list"
      class="scroll-container"
      ref="scroller"
      @ready="handleStart"
    >
      <template v-slot="{ item, active, index }">
        <RecycleScrollerItem :active="active" :item="item">
          <span>{{ item.title }}</span>
          <img :src="item.src" alt="商品图片" />
          <p>{{ item.content }}</p>
        </RecycleScrollerItem>
      </template>
    </RecycleScroller>
  </main>
</template>

<script>
import RecycleScroller from "./components/RecycleScroller.vue";
import RecycleScrollerItem from "./components/RecycleScrollerItem.vue";
export default {
  components: { RecycleScroller, RecycleScrollerItem },
  inject: ["performance"],
  props: ["list", "next"],
  methods: {
    async handleStart() {
      if(this.tested) return;
      this.tested = true;
      const ele = this.$refs.scroller.$el;
      const wrapper = ele.querySelector(".recycle-scroller__wrapper");
      await this.performance.install("recycle", ele, wrapper);
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
