<template lang="pug">
table.items
  thead
    tr.row
      td.name 이름
      td.attendance 출석
      td.visitcall 심방
      td.meditation 묵상
      td.recitation 암송
      td.invitation 전도
      td.invitation 기타
  tbody
    tr.row(v-for="(point, index) in points" :key="index")
      td.name {{point.owner.name}}
      td.attendance {{point.attendance ? 1 : 0}}
      td.visitcall {{point.visitcall ? 1 : 0}}
      td.meditation {{point.meditation}}
      td.recitation {{point.recitation ? 1 : 0}}
      td.invitation {{point.invitation}}
      td.invitation {{point.etc}}
  tfoot
    tr.row
      td.name 합계
      td.attendance {{computed.attendanceSum}} / {{points.length}}
      td.visitcall {{computed.visitcallSum}} / {{points.length}}
      td.meditation {{computed.meditationSum}}
      td.recitation {{computed.recitationSum}} / {{points.length}}
      td.invitation {{computed.invitationSum}}
      td.invitation N/A              
</template>

<script lang="ts">
import ViewPoint from '../components/ViewPoint.vue'
import {useState, IState, IComputed, useHandleDateChange, useBeforeMount, useComputed} from '../views/point.fn'
import {IGlobalState, IPoint, ITeacher} from '../biz/type'

interface IProps {
  points: IPoint[]
}
export default {
  name: 'table-point',
  props: {
    points: Array,
  },
  setup(props: any) {
    const computed: IComputed = useComputed(props)
    return {
      computed,
    }
  },
}
</script>
<style scoped lang="stylus">
.home {
  // margin: 0 10px;
  padding: 5px;
  text-align: left;

  .items {
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;

    .row {
      margin: 5px;
      border: 1px solid #ddd;
      padding: 10px;
    }
    thead{
      background-color: #f9f9f9;
    }    
    tfoot {
      background-color: #f9f9f9;
    }
  }
}

table, th, td {
  border: 1px solid #eee;
}
td{
  padding: 3px;
  text-align: center;
}
</style>
