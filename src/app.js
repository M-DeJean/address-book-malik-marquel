require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { v4: uuid } = require('uuid');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(express.json());
app.use(helmet())

const address = [
  {
    // id: 'UUID',
    // firstName: 'String',
    // lastName: 'String',
    // address1: 'String',
    // address2: String,
    // city: String,
    // state: String,
    // zip: Number
  }
]

app.get('/address', (req, res) => {
  res.send(address)
})

app.post('/address', (req, res) => {
  const { firstName, lastName, address1, address2 = '', city, state, zip } = req.body

  //VALIDATION
  if (!firstName) {
    return res
      .status(400)
      .send('First Name required');
  }
  if (!lastName) {
    return res
      .status(400)
      .send('Last Name required');
  }
  if (!address1) {
    return res
      .status(400)
      .send('Address1 required');
  }
  if (!city) {
    return res
      .status(400)
      .send('City required');
  }
  if (!state) {
    return res
      .status(400)
      .send('State required');
  }
  if (!zip) {
    return res
      .status(400)
      .send('Zip required');
  }
  if (state.length !== 2) {
    return res
      .status(400)
      .send('State must be exactly 2 characters long')
  }

  if (zip.length !== 5 || typeof parseInt(zip) !== 'number') {
    return res
      .status(400)
      .send('Zip must be exactly 5 digits long')
  }

  const id = uuid();
  const newAddress = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  };
  address.push(newAddress);


  res
    .status(201)
    .location(`http://localhost:8000/address/${id}`)
    .json(newAddress)

})
app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})
app.use(cors())

module.exports = app