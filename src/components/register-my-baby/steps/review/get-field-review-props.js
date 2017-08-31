import pick from 'lodash/pick'

const getFieldReviewProps = (schema, fieldName) => pick(schema[fieldName], ['name', 'label'])

export default getFieldReviewProps
