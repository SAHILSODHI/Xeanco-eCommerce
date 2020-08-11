require('dotenv').config({ path: './env' })
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')



//app
const app = express()

// db, in the second parameter, values are given to get rid of the deprecation warnings
// MONGO_URI=mongodb://localhost/nodeapi 
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log("DB is Connected"));

// to get error
mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});


//routes
// Without using express router
// app.get('/', (req, res) => {
//     res.send('hi from app.js')
// })


//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

// request response cycle
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
