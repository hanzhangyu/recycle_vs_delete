import buy from "/assets/img/buy.png";
import cry from "/assets/img/cry.png";

function getHash() {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

function generateItem(_, index) {
  const random = Math.random();
  return {
    id: index,
    title: index,
    content: getHash().repeat(Math.round(random * 50 + 1)),
    src: random > 0.5 ? buy : cry,
  };
}

export default function genList(count) {
  return Array.from({ length: count }, generateItem);
}
