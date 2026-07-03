const authConfig = {
  jwt: {
    secret: process.env.JTW_SECRETE,
    expriresIn: "1d"
  }
}

export { authConfig }