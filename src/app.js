import express from 'express'
const app = express()
const hostname = '0.0.0.0'
const port = 8080
app.get('/', (req, res) => {
  res.send  ('<h1>Hello World!</h1><hr>')
})
app.listen(port, hostname, () => {
  console.log(`Hihihihihi ${ hostname }:${ port }/`)
})