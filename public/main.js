const form = document.getElementById('loginForm')
const usernameEl = document.getElementById('username')
const passwordEl = document.getElementById('password')
const resetBtn = document.getElementById('resetBtn')
const messageEl = document.getElementById('message')
const userError = document.getElementById('userError')
const passError = document.getElementById('passError')
const togglePass = document.getElementById('togglePass')
const rememberEl = document.getElementById('remember')

function showMessage(text, type){
  messageEl.textContent = text
  messageEl.className = 'message ' + (type === 'error' ? 'error' : 'success')
  // auto-hide after 4 seconds for non-persistent messages
  if(type === 'success' || type === 'error'){
    setTimeout(()=>{
      if(messageEl.textContent === text){
        messageEl.textContent = ''
        messageEl.className = 'message'
      }
    }, 4000)
  }
}

function clearMessages(){
  messageEl.textContent = ''
  userError.textContent = ''
  passError.textContent = ''
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault()
  clearMessages()
  const username = usernameEl.value.trim()
  const password = passwordEl.value

  let hasError = false
  if(!username){ userError.textContent = 'Please enter username'; hasError = true }
  if(!password){ passError.textContent = 'Please enter password'; hasError = true }
  if(password && password.length < 6){ passError.textContent = 'Password must be at least 6 characters'; hasError = true }
  if(hasError) return

  // send to server
  try{
    const res = await fetch('/api/login', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if(data.success){
      showMessage(data.message, 'success')
      // store username when remember me checked
      if(rememberEl && rememberEl.checked){
        localStorage.setItem('rememberedUser', username)
      } else {
        localStorage.removeItem('rememberedUser')
      }
      // redirect to protected dashboard
      setTimeout(()=>{ window.location.href = '/dashboard' }, 400)
    } else {
      showMessage(data.message || 'Login failed', 'error')
    }
  }catch(err){
    showMessage('Network error', 'error')
  }
})

resetBtn.addEventListener('click', ()=>{
  usernameEl.value = ''
  passwordEl.value = ''
  clearMessages()
  if(rememberEl){ rememberEl.checked = false }
  localStorage.removeItem('rememberedUser')
})

// restore remembered username if present
if(localStorage.getItem('rememberedUser')){
  usernameEl.value = localStorage.getItem('rememberedUser')
  if(rememberEl) rememberEl.checked = true
}

// Toggle password visibility
if(togglePass){
  togglePass.addEventListener('click', ()=>{
    if(passwordEl.type === 'password'){
      passwordEl.type = 'text'
      togglePass.textContent = 'Hide'
      togglePass.setAttribute('aria-label','Hide password')
    } else {
      passwordEl.type = 'password'
      togglePass.textContent = 'Show'
      togglePass.setAttribute('aria-label','Show password')
    }
  })
}

// small helper to check current session
async function checkSession(){
  try{
    const res = await fetch('/api/me')
    const data = await res.json()
    if(data.loggedIn){ showMessage('Already logged in as ' + data.user.username, 'success') }
  }catch(e){/* ignore */}
}

checkSession()
