import omit from 'lodash/omit'

const getFieldReviewProps = (schema, fieldName) => omit(schema[fieldName], ['validate'])

export default getFieldReviewProps

