const axios = require('axios');
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  try {
    const data = await axios.get('https://ipapi.co/json/')
    const country_code = data.data.country_code

    if (username.slice(0, 2).toLowerCase() != country_code.toLowerCase()) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    } else {
      const user = await User.findOne({ username })
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
  
      if (!(user && passwordCorrect)) {
        return response.status(401).json({
          error: 'invalid username or password'
        })
      }
    
      response
        .status(200)
        .send({username: user.username, name: user.name })
    }
    

  } catch(error) {
    console.log(error);
  }


})

module.exports = loginRouter