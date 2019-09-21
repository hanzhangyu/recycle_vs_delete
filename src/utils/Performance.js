/**
 * @file run use case
 */
import Stats from "./Stats";

const delay = (timeout = 20) => new Promise(r => setTimeout(r, timeout));

export default class {
  constructor() {
    this.result = [];
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    requestAnimationFrame(this.loop);
  }
  loop = () => {
    this.stats.update();
    requestAnimationFrame(this.loop);
  };
  install = async (title, ele, wrapper) => {
    this.ele = ele;
    this.wrapper = wrapper;
    this.stats.record();
    await this.test();
    const perfs = this.stats.endRecord();

    this.result.push({
      title,
      perfs,
    });
  };
  async test() {
    const speeds = [
      undefined,
      -200,
      1000,
      -3000,
      6000,
      -12000,
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
