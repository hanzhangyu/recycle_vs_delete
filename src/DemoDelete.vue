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
  inject: ["preformance"],
  props: ["list", "next"],
  mounted() {},
  methods: {
    async handleStart() {
      const { ele, wrapper } = this.getEle();
      await this.preformance.install(ele, wrapper);
      this.next();
    },
    getEle() {
      const ele = this.$refs.scroller.$el;
      return {
        ele,
        wrapper: ele.querySelector(".delete-scroller__wrapper"),
      };
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
