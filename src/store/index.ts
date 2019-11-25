import Vue from 'vue'
import Vuex from 'vuex'
import {IPointMenu, ITeacher, IPoint, IStudent} from '@/biz/type'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    teachers: [] as ITeacher[],
    pointMenus: [] as IPointMenu[],
  },
  mutations: {
    setTeachers(state, teachers) {
      state.teachers = teachers
    },
    setPointMenus(state, pointMenus) {
      state.pointMenus = pointMenus
    },
    addTeacher(state, teacher) {
      state.teachers.push(teacher)
    },
  },
  actions: {},
  modules: {},
})
