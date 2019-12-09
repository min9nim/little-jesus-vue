<template lang="pug">
table.items
  thead
    tr.row
      td.name 이름
      td(v-for="item in points[0].items") {{item.type.label}}
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
      td.name 점수
      td(v-for="(item, index) in points[0].items") {{pointSum(index)}} / {{points.length * item.type.priority* (Number(item.type.type)-1)}}
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
          const value = point.items[index].value
          const label = point.items[index].type.label
          const priority = point.items[index].type.priority
          console.log({label, value, priority})
          return acc + value * priority
          // return acc + value
        }
        return props.points.reduce(reducer, 0)
      },
      itemSum(items: any) {
        if (!items) {
          throw Error('Not found items')
        }
        return items.reduce((acc: any, item: any) => acc + item.value * item.type.priority, 0)
      },
      perfectScoreSum(items: any) {
        if (!items) {
          throw Error('Not found items')
        }
        return items.reduce((acc: any, item: any) => {
          const perfectScore = (Number(item.type.type) - 1) * item.type.priority
          // console.log(item.type.label, perfectScore)
          return acc + perfectScore * item.type.priority
        }, 0)
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
