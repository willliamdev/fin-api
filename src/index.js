const express = require("express")
const { v4: uuidv4 } = require("uuid")

const app = express()
app.use(express.json())

const customers = []

// Middleware

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers
  const customer = customers.find(customer => customer.CPF === cpf)

  if (!customer) {
    return response.status(400).json({ error: "Customer not found!" })
  }

  request.customer = customer

  return next()
}

app.get('/', (request, response) => {
  response.send("okok")
})



app.post("/account", (resquest, response) => {
  const { CPF, name } = resquest.body

  const customerAlreadyExists = customers.some(
    (customer) => customer.CPF === CPF
  )

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" })
  }

  customers.push({
    CPF,
    name,
    id: uuidv4(),
    statement: []
  })

  response.status(201).send()
})


// app.use(verifyIfExistsAccountCPF)

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request
  return response.json(customer.statement)
})


app.listen(3333, console.log('Server is running on "http://localhost:3333"'))