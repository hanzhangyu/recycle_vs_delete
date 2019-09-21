<template functional>
  <main>
    <h1>我们来做一个测试</h1>
    <p>两种情况：</p>
    <ol>
      <li>使用 <strong>删除并添加</strong> 节点的方式，实现虚拟滚动</li>
      <li>使用 <strong>回收利用</strong> 节点的方式，实现虚拟滚动</li>
    </ol>
    <button @click="props.next" :disabled="!injections.appStatus.fetched">
      开始吧
    </button>
    <p v-show="!injections.appStatus.fetched">
      获取数据中 <span class="dot">...</span>
    </p>
  </main>
</template>

<script>
export default {
  inject: ["appStatus"],
};
</script>

<style lang="scss" scoped>
p {
  font-size: 18px;
}
.dot {
  display: inline-block;
  height: 1em;
  overflow: hidden;
  line-height: 1;
  text-align: left;
  vertical-align: -0.25em;
  &::before {
    display: block;
    white-space: pre-wrap;
    content: "...\A..\A.";
    animation: dot 2s infinite step-start both;
  }
  @keyframes dot {
    33% {
      transform: translateY(-2em);
    }
    66% {
      transform: translateY(-1em);
    }
  }
}
</style>
