<template lang="pug">
table.items
  thead
    tr.row
      td.name 이름
      td(v-for="item in $store.state.pointMenus") {{item.label}}
      td.etc 기타
      td.point 점수
  tbody(v-if="!tableBodyHidden")
    tr.row(v-for="(point, index) in points" :key="index")
      td.name {{point.owner.name}}
      td(v-for="item in point.items") {{item.value}}
      td.etc {{point.etc}}
      td.point {{itemSum(point.items)}}
  tfoot
    tr.row
      td.name 합계
      td(v-for="(item, index) in $store.state.pointMenus") {{pointSum(index)}} / {{points.length * item.priority * (Number(item.type)-1)}}
      td.etc -    
      td.point -        
</template>

<script lang="ts">
import {IComputed, useComputed} from '../components/table-point.fn'
import {IPublicState, IPoint, ITeacher} from '../biz/type'
import {usePublicState} from '../views/home.fn'

export default {
  name: 'table-point',
  props: {
    points: Array,
    tableBodyHidden: Boolean,
  },
  setup(props: any) {
    const computed: IComputed = useComputed(props)
    return {
      computed,
      pointSum(index: number) {
        const reducer = (acc: number, point: any) => {
          if (!point.items) {
            return acc
          }
          if (!point.items[index]) {
            // 포인트 입력 이후 새로 추가된 항목이 있을 경우 예외 처리
            return acc
          }
          const val = point.items[index].value
          const priority = point.items[index].type.priority
          // console.log({point, val, priority})
          return acc + val * priority
        }
        return props.points.reduce(reducer, 0)
      },
      itemSum(items: any) {
        if (!items) {
          return 200
        }
        return items.reduce((acc: any, item: any) => acc + item.value * item.type.priority, 0)
      },
    }
  },
}
</script>
<style scoped lang="stylus">
.items {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  padding: 5px;

  .row {
    margin: 5px;
    border: 1px solid #ddd;
    padding: 10px;
  }

  thead {
    background-color: #f9f9f9;
  }

  tbody {
    .name {
      min-width: 35px;
    }

    .etc {
      font-size: 10px;
      text-align: left;
      max-width: 130px;
    }
  }

  tfoot {
    background-color: #f9f9f9;
  }
}

table, th, td {
  border: 1px solid #eee;
}

td {
  padding: 3px;
  text-align: center;
}
</style>
