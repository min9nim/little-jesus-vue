import {expect} from 'chai'
import {getEtcStudentPoints} from '../../../src/views/points.fn'
import {studentToDefaultPointMap} from '../../../src/biz'
import {points, etcStudents, etcStudentPoint, pointMenus} from '../../mock/data'

describe('point.fn.ts test', () => {
  describe('getEtcStudentPoints', () => {
    it('should return etcStudentPoints', () => {
      const result = getEtcStudentPoints({
        points,
        etcStudents,
        defaultPoint: studentToDefaultPointMap(pointMenus),
      })
      expect(result).to.be.deep.equal(etcStudentPoint)
    })
  })
})
