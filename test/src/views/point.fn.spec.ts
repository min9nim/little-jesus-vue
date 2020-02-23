import {expect} from 'chai'
import {getEtcStudentPoints, getPointsByTeacher} from '../../../src/components/points-by-class.fn'
import {studentToDefaultPointMap} from '../../../src/biz'
import {
  allStudentPoints,
  etcStudents,
  etcStudentPoint,
  pointMenus,
  allTeachers,
  getPointsByTeacherResult,
} from '../../mock/data'

describe('point.fn.ts test', () => {
  describe('getEtcStudentPoints', () => {
    it('should return etcStudentPoints', () => {
      const result = getEtcStudentPoints({
        allStudentPoints,
        etcStudents,
        defaultPoint: studentToDefaultPointMap(pointMenus),
      })
      expect(result).to.be.deep.equal(etcStudentPoint)
    })
  })
  describe('getPointsByTeachers', () => {
    it('should return points & pointsByTeachers', () => {
      const result = getPointsByTeacher({
        allStudentPoints,
        allTeachers,
        defaultPoint: studentToDefaultPointMap(pointMenus),
        etcStudents,
      })

      expect(result.points).to.be.deep.equal(getPointsByTeacherResult.points)
      expect(result.pointsByTeacher).to.be.deep.equal(getPointsByTeacherResult.pointsByTeacher)
    })
  })
})
