<template lang="pug">
.input-form
  el-card(shadow="hover")
    div(slot="header")
      h3 {{ point.owner.name }}
    .item(
      v-for="(item, index) in point.items"
      :key="index"
    )
      .label {{$store.getters.pointMenuMap[item.type].label}}
      .control(:class="item.value.split(':')[1] === '0' ? 'red' : 'green' ") {{item.value.split(':')[0]}}
    .item
      .label 기타사항
      .control
        el-input(
          v-model="point.etc"
          type="textarea"
          readonly
          :autosize="{ minRows: 2, maxRows: 6}"
        ) 
</template>
<script lang="ts">
import {createComponent} from '@vue/composition-api'

export default createComponent({
  props: {point: Object},
})
</script>
<style lang="stylus" scoped>
.input-form {
  h3 {
    margin: 0;
  }

  .item {
    font-size: 16px;
    display: flex;
    padding: 5px 0;

    & + .item {
      border-top: 1px solid #f9f9f9;
    }

    .label {
      margin-right: 20px;
      width: 70px;
      text-align: right;
      display: flex;
      align-items: center;
    }

    .control {
      margin-left: 10px;
      flex: 1;
    }
  }
}
</style>
