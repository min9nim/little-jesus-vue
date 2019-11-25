<template lang="pug">
.input-form
  el-card(shadow="hover")
    div(slot="header")
      h3 {{ state.point.owner.name }}
    template(v-if="state.point._id && !state.point.items")
      .item.attendance
        .label 출석여부
        .control
          el-radio(v-model="state.point.attendance" :label="true") O
          el-radio(v-model="state.point.attendance" :label="false") X
      .item
        .label 심방여부
        .control
          el-radio(v-model="state.point.visitcall" :label="true") O
          el-radio(v-model="state.point.visitcall" :label="false") X    
      .item.meditation
        .label 말씀묵상
        .control
          el-radio(v-model="state.point.meditation" :label="0") 0
          el-radio(v-model="state.point.meditation" :label="1") 1
          el-radio(v-model="state.point.meditation" :label="2") 2
          el-radio(v-model="state.point.meditation" :label="3") 3
          el-radio(v-model="state.point.meditation" :label="4") 4
          el-radio(v-model="state.point.meditation" :label="5") 5
          el-radio(v-model="state.point.meditation" :label="6") 6
          el-radio(v-model="state.point.meditation" :label="7") 7
      .item
        .label 말씀암송
        .control
          el-radio(v-model="state.point.recitation" :label="true") O
          el-radio(v-model="state.point.recitation" :label="false") X    
      .item.invitation
        .label 전도
        .control
          el-radio(v-model="state.point.invitation" :label="0") 0
          el-radio(v-model="state.point.invitation" :label="1") 1
          el-radio(v-model="state.point.invitation" :label="2") 2
          el-radio(v-model="state.point.invitation" :label="3") 3
          el-radio(v-model="state.point.invitation" :label="4") 4
          el-radio(v-model="state.point.invitation" :label="5") 5    
    template(v-else)
      .item(v-for="item in $store.state.pointMenus" :key="item._id")
        .label {{item.label}}
        .control
          el-radio(
            v-for="num in Array.from(Array(Number(item.type)).keys())"
            v-model="state.point.items[state.point.items.findIndex(propEq('_id', item._id))].value" :label="num"
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

    &.attendance {
      .label {
        font-weight: bold;
      }
    }

    &.meditation {
      .label {
        font-weight: bold;
      }

      .el-radio {
        margin: 10px 20px 10px 0;
      }
    }

    &.invitation {
      .el-radio {
        margin: 10px 20px 10px 0;
      }
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

