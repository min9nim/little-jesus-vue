<template lang="pug">
.input-form
  h1 {{ point.owner.name }}
  .item
    .label 출석여부
    .control {{point.attendance ? 'O' : 'X'}}
  .item
    .label 심방여부
    .control {{point.visitcall ? 'O' : 'X'}}
  .item.meditation
    .label 말씀묵상
    .control {{point.meditation}}
  .item
    .label 말씀암송
    .control {{point.recitation ? 'O' : 'X'}}
  .item.invitation
    .label 전도
    .control {{point.invitation}}
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
  h1 {
    margin-top: 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #f9f9f9;
  }

  .item {
    font-size: 18px;
    display: flex;
    padding: 10px 0;

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
<style lang="stylus">
.home {
  .form {
    .item {
      .el-radio__label {
        font-size: 18px;
      }
    }
  }
}
</style>
