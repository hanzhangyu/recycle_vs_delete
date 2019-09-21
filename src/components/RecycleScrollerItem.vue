<template>
  <div><slot /></div>
</template>
<script>
export default {
  name: "RecycleScrollerItem",
  inject: ["heights"],
  props: {
    item: {
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    // 内部填充的元素改变时
    ["item.id"]() {
      this.updateHeight();
    },
    // 节点从外部移入 viewport 时
    active(val) {
      if (val) {
        this.updateHeight();
      }
    },
  },
  mounted() {
    if (this.active) this.updateHeight(); // 初始节点需要计算
  },
  methods: {
    updateHeight() {
      if (!this.active) return;
      const idPrevTick = this.item.id;
      this.$nextTick(() => {
        if (this.item.id !== idPrevTick) return; // 有可能滚动过快，刷的一下，就过去了，不计算
        const bounds = this.$el.getBoundingClientRect();
        const height = Math.round(bounds.height);
        if (height && this.heights[idPrevTick] !== height) {
          this.$set(this.heights, idPrevTick, height); // 动态去计算高度
        }
      });
    },
  },
};
</script>

<style scoped></style>
