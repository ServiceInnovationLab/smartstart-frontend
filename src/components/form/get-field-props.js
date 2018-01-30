import omit from 'lodash/omit'

export const preventBlurOnButtonClick = (e) => {
  const { relatedTarget } = e
  const type = relatedTarget ? relatedTarget.getAttribute('type') : ''

  if (type === 'button' || type === 'submit') {
    e.preventDefault()
  }
}

const getFieldProps = (schema, fieldName) => (
  {
    onBlur: preventBlurOnButtonClick,
    ...omit(schema[fieldName], ['validate']) // omit validate because we validate the whole form at once
  }
)

export default getFieldProps
