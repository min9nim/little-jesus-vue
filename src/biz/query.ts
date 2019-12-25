import gql from 'graphql-tag'

export const qCreatePoint = gql`
  # Write your query or mutation here
  mutation createPoint($owner: ObjectId!, $date: String!, $items: [PointItemArg!]!, $etc: String) {
    res: createPoint(owner: $owner, date: $date, items: $items, etc: $etc) {
      _id
      owner {
        _id
        name
      }
      date
      items {
        type
        value
      }
      etc
    }
  }
`
export const qUpdatePoint = gql`
  # Write your query or mutation here
  mutation updatePoint(
    $_id: ObjectId!
    $owner: ObjectId
    $date: String
    $items: [PointItemArg!]!
    $etc: String
  ) {
    res: updatePoint(_id: $_id, owner: $owner, date: $date, items: $items, etc: $etc) {
      _id
      owner {
        _id
        name
      }
      date
      items {
        type
        value
      }
      etc
    }
  }
`

export const qTeachers = gql`
  query teachers {
    res: teachers {
      _id
      name
      students {
        _id
        name
        teacher {
          _id
          name
        }
      }
    }
  }
`

export const qStudents = gql`
  query students {
    res: students {
      _id
      name
      teacher {
        _id
        name
      }
    }
  }
`

export const qInitialize = gql`
  query initialize {
    teachers {
      _id
      name
      students {
        _id
        name
        teacher {
          _id
          name
        }
      }
    }
    students {
      _id
      name
      teacher {
        _id
        name
      }
    }
    pointMenus(hidden: false) {
      _id
      label
      type
      priority
      hidden
      disable
    }
  }
`

export const qPoints = gql`
  query points($date: String, $teacherId: ObjectId) {
    res: points(date: $date, teacherId: $teacherId) {
      _id
      owner {
        _id
        name
        teacher {
          _id
          name
        }
      }
      date
      attendance
      meditation
      invitation
      visitcall
      recitation
      items {
        type
        value
      }
      etc
    }
  }
`

export const qPointsFromTo = gql`
  query pointsFromTo($startDate: String!, $endDate: String!) {
    res: pointsFromTo(startDate: $startDate, endDate: $endDate) {
      _id
      owner {
        _id
        name
        teacher {
          _id
          name
        }
      }
      date
      attendance
      meditation
      invitation
      visitcall
      recitation
      items {
        type
        value
      }
      etc
    }
  }
`

export const qRemovePoint = gql`
  mutation removePoint($_id: ObjectId!) {
    removePoint(_id: $_id) {
      _id
      date
    }
  }
`
