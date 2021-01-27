document.forms['signupForm'].addEventListener('submit', (event) => {
  event.preventDefault()
  document.querySelector('#successMessage').classList.remove('hidden')
  document.querySelector('#successMessage').classList.add('flex')

  fetch(event.target.action, {
    method: 'POST',
    body: new URLSearchParams(new FormData(event.target)), // event.target is the form
  })
    .then((resp) => {
      return resp.json() // or resp.text() or whatever the server sends
    })
    .then((body) => {
      // TODO handle body
    })
    .catch((error) => {
      console.error(error)
    })

  document
    .querySelectorAll('form input:not([type="submit"]')
    .forEach((input) => (input.value = ''))
})
