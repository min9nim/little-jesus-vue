import Vue from 'vue'
import Vuex from 'vuex'
import {IPublicState, ITeacher, IPoint, IStudent} from '@/biz/type'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    teachers: [] as ITeacher[],
  },
  mutations: {
    setTeachers(state, teachers) {
      state.teachers = teachers
    },
    addTeacher(state, teacher) {
      state.teachers.push(teacher)
    },
  },
  actions: {},
  modules: {},
})
