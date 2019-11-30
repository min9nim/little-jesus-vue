<template lang="pug">
.input-form
  el-card(shadow="hover")
    div(slot="header")
      h3 {{ state.point.owner.name }}
    .item(v-for="item in state.point.items" :key="item._id")
      .label {{item.type.label}}
      .control
        el-radio.radio(
          v-for="num in Array.from(Array(Number(item.type.type)).keys())"
          v-model="item.value" :label="num"
          :key="num"
        ) {{num}}        
    .item
      .label 기타사항
      .control
        el-input(
          v-model="state.point.etc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6}"
          placeholder="특이사항 입력"
        )  
</template>
<script lang="ts">
import {createComponent, reactive, computed, watch} from '@vue/composition-api'
import {useState, usePublicState as useHomeState} from '../views/home.fn'
import {propEq, pathEq} from 'ramda'
import Vue from 'vue'

export default createComponent({
  props: {studentId: String},
  methods: {propEq},
  setup(props, {root}) {
    const homeState = useHomeState()
    let state = reactive({
      point: homeState.points.find(pathEq(['owner', '_id'], props.studentId)),
    })
    watch(
      () => props.studentId,
      () => {
        state.point = homeState.points.find(pathEq(['owner', '_id'], props.studentId))
      },
    )
    return {
      state,
    }
  },
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
      border-top: 1px solid #f7f7f7;
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

      .radio {
        margin: 8px 10px;
      }
    }
  }
}
</style>

