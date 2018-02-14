import { animateScroll } from 'react-scroll'

const scrollToFirstError = () => {
  const firstErrorNode = document.querySelector('.has-error')
  const firstErrorInput = document.querySelector('.has-error input, .has-error select, .has-error textarea')

  if (!firstErrorNode) {
    return
  }

  const bodyRect = document.body.getBoundingClientRect()

  let elemRect

  if (firstErrorNode.parentNode.tagName === 'FIELDSET') {
    elemRect = firstErrorNode.parentNode.getBoundingClientRect()
  } else {
    elemRect = firstErrorNode.getBoundingClientRect()
  }

  const offset = elemRect.top - bodyRect.top

  animateScroll.scrollTo(offset, { smooth: true })
  firstErrorInput.focus()
}

export default scrollToFirstError
