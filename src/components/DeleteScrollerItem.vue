<template>
  <div><slot /></div>
</template>
<script>
export default {
  inject: ["heights"],
  props: {
    item: {
      required: true,
    },
  },
  mounted() {
    this.active = true;
    this.updateHeight(); // 初始节点需要计算
  },
  destroyed() {
    this.active = false;
  },
  methods: {
    updateHeight() {
      this.$nextTick(() => {
        if (!this.active) return; // 有可能滚动过快，刷的一下，就过去了，不计算
        const bounds = this.$el.getBoundingClientRect();
        const height = Math.round(bounds.height);
        const id = this.item.id;
        if (height && this.heights[id] !== height) {
          this.$set(this.heights, id, height); // 动态去计算高度
        }
      });
    },
  },
};
</script>

<style scoped></style>
