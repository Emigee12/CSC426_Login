const welcomeEl = document.getElementById('welcome')
const logoutBtn = document.getElementById('logoutBtn')

async function loadUser(){
  try{
    const res = await fetch('/api/me')
    const data = await res.json()
    if(data.loggedIn){
      welcomeEl.textContent = `Welcome to your student dashboard, ${data.user.username}`
    } else {
      // not logged in -> redirect
      window.location.href = '/'
    }
  }catch(e){
    window.location.href = '/'
  }
}

logoutBtn.addEventListener('click', async ()=>{
  try{
    await fetch('/api/logout', { method: 'POST' })
  }catch(e){/* ignore */}
  window.location.href = '/'
})

loadUser()
