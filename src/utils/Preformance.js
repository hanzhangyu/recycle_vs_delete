/**
 * @file run use case
 */
import Stats from "./Stats";

window.stats = new Stats();
document.body.appendChild(stats.dom);
requestAnimationFrame(function loop() {
  stats.update();
  requestAnimationFrame(loop);
});

const delay = (timeout = 20) => new Promise(r => setTimeout(r, timeout));

export default class {
  constructor() {
    this.result = [];
  }
  install = async (title, ele, wrapper) => {
    this.ele = ele;
    this.wrapper = wrapper;
    await this.test();
    this.result.push({
      title,
      fps: 1,
      memory: 1,
    })
  };
  async test() {
    const speeds = [
      undefined,
      -200,
      600,
      -800,
      1000,
      -1500,
      1500,
      -1500,
      3000,
      -3000,
    ];
    for (let speed of speeds) {
      await this.scroll(speed);
    }
  }
  async scroll(distance = 100) {
    const { ele, wrapper } = this;
    ele.scrollTop += distance;
    await delay();
    if (
      distance > 0
        ? wrapper.clientHeight - ele.clientHeight <= ele.scrollTop
        : ele.scrollTop === 0
    )
      return;
    await this.scroll(distance * 1.1);
  }
}
