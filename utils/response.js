import helpers from './helpers'

class Response {
  constructor() {
    this.statusCode = null
    // this.type = null
    this.data = null
    this.error = null
  }

//   // setSuccess(statusCode, data) {
//   //   this.statusCode = statusCode
//   //   this.data = data
//   //   this.type = 'success'
//   // }

//   // setError(statusCode, message) {
//   //   this.statusCode = statusCode
//   //   this.message = message
//   //   this.type = message
//   //   this.type = 'error'
//   // }

  sendErr(res) {
    // const filteredResponse = helper.stripNull({
    //   status: this.type,
    //   message: this.message,
    //   data: this.data
    // })

    // if (this.type === 'success') {
    //   return res.status(this.statusCode).json({
    //     status: this.type,
    //     data: this.data
    //   })
    // }
    return res.status(this.statusCode).json({
      status: this.statusCode,
      error: this.error,
    })
  }

  sendSuccess(res) {
    // const filteredResponse = helper.stripNull({
    //   status: this.type,
    //   message: this.message,
    //   data: this.data
    // })

    // if (this.type === 'success') {
    //   return res.status(this.statusCode).json({
    //     status: this.type,
    //     data: this.data
    //   })
    // }
    return res.status(this.statusCode).json({
      status: this.statusCode,
      data: this.data,
    })
  }
}

export default Response