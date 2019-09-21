<template>
  <div
    class="recycle-scroller"
    :class="{ ready }"
    @scroll.passive="handleScroll"
  >
    <div
      :style="{ minHeight: totalHeight + 'px' }"
      class="recycle-scroller__wrapper"
    >
      <div
        v-for="view of pool"
        :key="view.nr.id"
        :style="ready ? { transform: `translateY(${view.position}px)` } : null"
        class="recycle-scroller__item"
        :class="{ hover: hoverKey === view.item.id }"
        @mouseenter="hoverKey = view.item.id"
        @mouseleave="hoverKey = null"
      >
        <slot :item="view.item" :index="view.index" :active="view.used" />
      </div>
    </div>
  </div>
</template>

<script>
let uid = 0;
export default {
  data() {
    this.$_unusedViews = [];
    this.$_views = new Map();
    this.$_startIndex = 0;
    this.$_endIndex = 0;
    this.$_scrollDirty = false; // 是否需要更新
    return {
      pool: [], // 所有的 view
      totalHeight: 0, // 总高度
      ready: false, // 计算完一次高度之后再显示，不然会闪
      hoverId: null, // 当前 hover 项
      heights: {}, // Map<number, number> id 与 高度映射
      hoverKey: null,
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
      this.updateVisibleItems(true);
    },
    heights() {
      console.log("changed");
      console.log({ ...this.heights });
      this.updateVisibleItems(false);
    },
  },
  computed: {
    // computed 不是 deep 的 const computedWatcherOptions = { lazy: true }
    itemsWithHeight() {
      console.log("this.heights");
      let accumulator = 0;
      return this.list.map(item => {
        const height = this.heights[item.id] || this.minHeight; // 未出现的标记为 minHeight
        accumulator = accumulator + height;
        return {
          item,
          id: item.id,
          height: height,
          accumulator, // 从顶部到元素底部的距离
        };
      });
    },
  },
  mounted() {
    console.log(1);
    this.$nextTick(() => {
      this.updateVisibleItems(true);
      this.ready = true; // mounted 之后
    });
  },
  methods: {
    handleScroll() {
      // 防止冗余计算
      if (!this.$_scrollDirty) {
        this.$_scrollDirty = true;
        requestAnimationFrame(() => {
          this.$_scrollDirty = false;
          this.updateVisibleItems(false);
        });
      }
    },

    updateVisibleItems(checkExist = false) {
      const { list, itemsWithHeight, $_views, $_unusedViews, pool } = this;
      const len = list.length;
      if (len === 0) return;

      // region 计算新的其实位置
      const { scrollTop, clientHeight } = this.$el;
      const lastItem = itemsWithHeight[len - 1];
      const startPx = scrollTop - this.offset;
      const endPx = scrollTop + clientHeight + this.offset;
      let startIndex = this.binarySearchStartItem(startPx, len);
      let endIndex = this.searchEndItem(startIndex, endPx, len);
      this.totalHeight = lastItem.accumulator;
      // endregion

      // region 根据移动的情况，更新view
      const continuous =
        startIndex <= this.$_endIndex && endIndex >= this.$_startIndex; // 连续的滚动，有些元素还存在着
      let view;

      if (!continuous) {
        // 清空所有状态
        $_views.clear();
        this.$_unusedViews = [];
        for (let i = 0; i < pool.length; i++) {
          view = pool[i];
          this.unuseView(view);
        }
      } else {
        // 连续的滚动时，我们检查一下pool 里面，每一个正在 被使用的 元素是否还在 viewport 里面即可，还在的保持不动
        for (let i = 0; i < pool.length; i++) {
          view = pool[i];
          if (view.used) {
            // 判断是否该 view 对应的 item 已被删除
            if (checkExist) {
              view.index = list.findIndex(item => item.id === view.item.id);
            }

            // 移出 viewport 的我们回收
            if (
              view.index === -1 ||
              view.index < startIndex ||
              view.index >= endIndex
            ) {
              this.unuseView(view);
            }
          }
        }
      }
      // endregion

      let indexOfUnusedView = 0;
      for (let i = startIndex; i < endIndex; i++) {
        let item = list[i];
        let view = $_views.get(item.id);

        // 这是一个刚移进 viewport 的元素，还没有 view
        if (!view) {
          if (continuous) {
            // 连续取出或者创建一个 view
            if ($_unusedViews.length) {
              view = $_unusedViews.pop();
              view.item = item;
              view.used = true;
              view.index = i;
            } else {
              view = this.addView(item, i);
            }
          } else {
            // 检查一下 缓存池够不够，不够扩容缓存，并使用
            if (indexOfUnusedView < $_unusedViews.length) {
              view = $_unusedViews[indexOfUnusedView];
              view.item = item;
              view.used = true;
              view.index = i;
            } else {
              view = this.addView(item, i);
              this.unuseView(view, true);
            }
            indexOfUnusedView++;
          }
          $_views.set(item.id, view);
        } else {
          // 存在及复用
          view.used = true;
        }

        // 更新view位置，第一个我们设置为 0
        view.position = i !== 0 ? itemsWithHeight[i - 1].accumulator : 0;
      }

      this.$_startIndex = startIndex;
      this.$_endIndex = endIndex;
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

    // 将 view 压入 unusedPool
    unuseView(view, show = false) {
      this.$_unusedViews.push(view);
      // 不在 viewport 中的元素
      if (!show) {
        view.used = false;
        view.position = -9999;
        this.$_views.delete(view.item.id);
      }
    },

    addView(item, index) {
      const view = {
        item,
        position: 0,
        used: true, // 是否正在使用
        index, // 第几个元素
      };
      Object.defineProperty(view, "nr", {
        configurable: false,
        value: {
          // 用于生成节点的 key，我们不要使用用户的 key，以保证复用 view 时不会重复
          // 不然修改 view 时，不能简单的随便找一个了，还得看看未使用的 view 缓存池里 有没有自己，太复杂了
          id: uid++,
        },
      });
      this.pool.push(view);
      return view;
    },
  },
};
</script>

<style lang="scss" scoped>
.recycle-scroller {
  position: relative;
  overflow-y: auto;
  &.ready .recycle-scroller__item {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
  }
}
</style>
