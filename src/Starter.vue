<template functional>
  <main>
    <h1>我们来做一个测试</h1>
    <p>两种情况：</p>
    <ol>
      <li>使用 <strong>删除并添加</strong> 节点的方式，实现虚拟滚动</li>
      <li>使用 <strong>回收利用</strong> 节点的方式，实现虚拟滚动</li>
    </ol>
    <button @click="props.next">开始吧</button>
  </main>
</template>
