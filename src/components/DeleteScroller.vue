<template>
  <div class="delete-scroller" @scroll.passive="handleScroll">
    <div
      :style="{ minHeight: totalHeight + 'px' }"
      class="delete-scroller__wrapper"
    >
      <div
        class="delete-scroller__placeholder"
        :style="{ height: placerHolderHeight + 'px' }"
      ></div>
      <div v-for="view of pool" :key="view.id" class="delete-scroller__item">
        <slot :item="view.item" :index="view.index" />
      </div>
    </div>
  </div>
</template>

<script>
let uid = 0;
export default {
  data() {
    // this.$_startIndex = 0;
    // this.$_endIndex = 0;
    this.$_scrollDirty = false; // 是否需要更新
    return {
      startIndex: 0,
      endIndex: 0,
      // pool: [], // 现实的元素
      totalHeight: 0, // 总高度
      heights: {}, // Map<number, number> id 与 高度映射
    };
  },
  provide() {
    return {
      heights: this.heights,
    };
  },
  props: {
    list: {
      required: true,
    },
    offset: {
      default: 200, // 上下偏移量
    },
    minHeight: {
      default: 54, // 没加载过的数据假设高度都为 54
    },
  },
  watch: {
    list() {
      this.updateVisibleItems();
    },
    heights() {
      // console.log("changed");
      // console.log({ ...this.heights });
      this.updateVisibleItems();
    },
  },
  computed: {
    placerHolderHeight() {
      const first = this.pool[0];
      return first ? first.accumulator - first.height : 0;
    },
    itemsWithHeight() {
      // console.log("this.heights");
      let accumulator = 0;
      return this.list.map((item, index) => {
        const height = this.heights[item.id] || this.minHeight; // 未出现的标记为 minHeight
        accumulator = accumulator + height;
        return {
          item,
          index,
          id: item.id,
          height: height,
          accumulator, // 从顶部到元素底部的距离
        };
      });
    },
    pool() {
      return this.itemsWithHeight.slice(this.startIndex, this.endIndex);
    },
  },
  mounted() {
    console.log(1);
    this.$nextTick(() => {
      this.updateVisibleItems();
      this.$nextTick(() => {
        this.$emit("ready");
      });
    });
  },
  methods: {
    handleScroll() {
      // 防止冗余计算
      if (!this.$_scrollDirty) {
        this.$_scrollDirty = true;
        requestAnimationFrame(() => {
          this.$_scrollDirty = false;
          this.updateVisibleItems();
        });
      }
    },

    updateVisibleItems() {
      const { list, itemsWithHeight } = this;
      const len = list.length;
      if (len === 0) return;

      // region 计算新的起始位置
      const { scrollTop, clientHeight } = this.$el;
      const lastItem = itemsWithHeight[len - 1];
      const startPx = scrollTop - this.offset;
      const endPx = scrollTop + clientHeight + this.offset;
      this.startIndex = this.binarySearchStartItem(startPx, len);
      this.endIndex = this.searchEndItem(this.startIndex, endPx, len);
      this.totalHeight = lastItem.accumulator;
      // endregion

      // // region 修正pool内容，TODO 测试直接 slice 与 push 性能差距
      // const continuous =
      //   startIndex <= this.$_endIndex && endIndex >= this.$_startIndex; // 连续的滚动，有些元素还存在着
      // if (!continuous) {
      //   this.pool = this.list.slice(startIndex, endIndex);
      // } else {
      //   if (startIndex >= this.$_startIndex) {
      //     // 向下滚
      //     this.pool.split(this.$_startIndex, startIndex - this.$_startIndex);
      //     this.pool.push(...this.list.slice(this.$_endIndex, endIndex));
      //   } else {
      //     // 向上滚
      //     this.pool.split(endIndex, this.$_endIndex - endIndex);
      //     this.pool.unshift(...this.list.slice(startIndex, this.$_startIndex));
      //   }
      // }
      // // endregion
    },
    /**
     * 查找第一个结点的 index
     * @param startPx {number}
     * @param len {number}
     * @return {number}
     */
    binarySearchStartItem(startPx, len) {
      let i = ~~(len / 2);
      let left = 0;
      let right = len - 1;
      let oldi;
      do {
        oldi = i;
        const cur = this.itemsWithHeight[i];
        if (cur.accumulator < startPx) {
          left = i;
        } else if (this.itemsWithHeight[i + 1].accumulator > startPx) {
          // 我们比的是底部
          right = i;
        }
        i = ~~((left + right) / 2);
      } while (oldi !== i); // 有可能 left 与 right 相差 1，这样失踪都会是 left 了
      return left;
    },
    /**
     * 查找最后一个结点的 index
     * @param startIndex {number}
     * @param endPx {number}
     * @param len {number}
     * @return {number}
     */
    searchEndItem(startIndex, endPx, len) {
      let endIndex;
      for (
        endIndex = startIndex;
        endIndex < len && this.itemsWithHeight[endIndex].accumulator < endPx;
        endIndex++
      );
      endIndex > len && (endIndex = len);
      return endIndex;
    },
  },
};
</script>

<style lang="scss" scoped></style>
