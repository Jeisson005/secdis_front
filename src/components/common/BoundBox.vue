<template>
  <div class="BoundBox">
    <div
      class="box"
      :style="{
        top: bTop + 'px',
        left: bLeft + 'px',
        width: bWidth + 'px',
        height: bHeight + 'px'
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "BoundBox",
  props: ["bTop", "bLeft", "bWidth", "bHeight"]
};
</script>

<style scoped lang="scss">
.box {
  position: absolute;
  border: 2px #6200ea solid;
  background-color: rgba(98, 0, 234, 0.2);
  z-index: 3;
}
</style>
