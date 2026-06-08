const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
}))

// Simple in-memory user store (for demo only)
// Passwords should never be stored in plain text in production. Here we hash a sample password.
const users = {
  'student': { username: 'student', passwordHash: '' }
}

async function initUsers(){
  const hash = await bcrypt.hash('Password123', 10)
  users['student'].passwordHash = hash
}

// Initialize user store
initUsers()

app.use(express.static(path.join(__dirname, 'public')))

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {}
  if(!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required.' })

  const user = users[username]
  if(!user) return res.status(401).json({ success: false, message: 'Invalid username or password.' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if(!ok) return res.status(401).json({ success: false, message: 'Invalid username or password.' })

  // success: set session
  req.session.user = { username }
  return res.json({ success: true, message: 'Login successful' })
})

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) return res.status(500).json({ success: false })
    res.json({ success: true })
  })
})

app.get('/api/me', (req, res) => {
  if(req.session && req.session.user) return res.json({ loggedIn: true, user: req.session.user })
  return res.json({ loggedIn: false })
})

// Protected dashboard route - serve static file only if logged in
app.get('/dashboard', (req, res) => {
  if(req.session && req.session.user){
    return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
  }
  // not logged in -> redirect to root
  return res.redirect('/')
})

app.listen(PORT, ()=>{
  console.log('Server listening on port', PORT)
})
