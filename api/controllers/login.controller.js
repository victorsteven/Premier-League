import validator from  "email-validator"


class LoginController {
  constructor(loginService) {
    this.loginService = loginService
  }

  async login(req, res) {

    const { email, password } =  req.body

    if (
      (!email || typeof email !== "string") ||
      (!password || typeof password !== "string")
    ) {
      return res.status(400).json({
        status: 400,
        error: "ensure that correct details are sent"
      })
    }
    if (!validator.validate(email)){
      return res.status(400).json({
        status: 400,
        error: "invalid email"
      })
    }
    
    try {
      const token = await this.loginService.login(email, password)
      if(!token) {
        return res.status(500).json({
          status: 500,
          error: "invalid user credentials"
        })
      }
      return res.status(200).json({
        status: 200,
        token
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error:  error.message
      })
    }
  }
}

export default LoginController