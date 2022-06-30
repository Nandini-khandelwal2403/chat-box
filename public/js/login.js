
function login() {
    const email = document.querySelector('#email').value
    const username = document.querySelector('#username').value
    const room = document.querySelector('#room').value

    let obj = { 'email': email, 'username': username, 'room': room }
    console.log(obj);

    sessionStorage.setItem('email', email)
    sessionStorage.setItem('username', username)
    sessionStorage.setItem('room', room)

    window.location = './chat'
}