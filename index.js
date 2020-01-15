const app = require('./server')

const port = 5000 || process.env.PORT;

app.listen(port, () => {
    console.log(`App running on port : ${port}`)
})