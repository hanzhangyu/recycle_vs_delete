<template>
  <RecycleScroller :list="list" class="scroll-container">
    <template v-slot="{ item, active, index }">
      <RecycleScrollerItem :active="active" :item="item">
        <span>{{ item.title }}</span>
        <img :src="item.src" alt="商品图片" />
        <p>{{ item.content }}</p>
      </RecycleScrollerItem>
    </template>
  </RecycleScroller>
</template>

<script>
import RecycleScroller from "./components/RecycleScroller.vue";
import RecycleScrollerItem from "./components/RecycleScrollerItem.vue";
export default {
  components: { RecycleScroller, RecycleScrollerItem },
  props: ["list"],
};
</script>

<style lang="scss" scoped>
.scroll-container {
  width: 500px;
  height: 500px;
  word-break: break-all;
  overflow: auto;
}
img {
  width: 50px;
  height: 50px;
}
</style>
