import gql from 'graphql-tag'

export const qCreatePoint = gql`
  # Write your query or mutation here
  mutation createPoint(
    $owner: ObjectId!
    $date: String!
    $attendance: Boolean
    $visitcall: Boolean
    $meditation: Int
    $recitation: Boolean
    $invitation: Int
    $etc: String
  ) {
    res: createPoint(
      owner: $owner
      date: $date
      attendance: $attendance
      visitcall: $visitcall
      meditation: $meditation
      recitation: $recitation
      invitation: $invitation
      etc: $etc
    ) {
      _id
      owner {
        _id
        name
      }
      date
      attendance
      visitcall
      meditation
      recitation
      invitation
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
    $attendance: Boolean
    $visitcall: Boolean
    $meditation: Int
    $recitation: Boolean
    $invitation: Int
    $etc: String
  ) {
    res: updatePoint(
      _id: $_id
      owner: $owner
      date: $date
      attendance: $attendance
      visitcall: $visitcall
      meditation: $meditation
      recitation: $recitation
      invitation: $invitation
      etc: $etc
    ) {
      _id
      owner {
        _id
        name
      }
      date
      attendance
      visitcall
      meditation
      recitation
      invitation
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
      }
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
      }
      date
      attendance
      meditation
      invitation
      visitcall
      recitation
      etc
    }
  }
`
