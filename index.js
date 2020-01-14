const app = require('./server')

const port = 5000;

app.listen(port, () => {
    console.log(`App running on port : ${port}`)
})