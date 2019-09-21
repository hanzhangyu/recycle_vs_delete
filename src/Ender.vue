<template>
  <main>
    <h1>得到结果</h1>
    <div v-for="perf in result">
      <h2>{{ perf.title }}</h2>
      <p>average fps: {{ perf.fps }}</p>
      <p>average mem: {{ perf.mem }}</p>
      <p>detail: {{perf.detail}}</p>
    </div>
  </main>
</template>
<script>
export default {
  data() {
    return {
      result: [],
    };
  },
  inject: ["performance"],
  mounted() {
    this.performance.result.forEach(item => {
      let sumFps = 0;
      let sumMem = 0;
      item.perfs.forEach(perf => {
        sumFps += perf.fps;
        sumMem += perf.mem;
      });
      this.result.push({
        title: item.title,
        fps: sumFps / item.perfs.length,
        mem: sumMem / item.perfs.length,
        detail: JSON.stringify(item.perfs)
      });
    });

    this.averageFps;
  },
};
</script>
