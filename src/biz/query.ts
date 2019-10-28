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
    createPoint(
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
