const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs'
}))
app.set('view engine', 'hbs');
app.use(express.static('./public/'));

app.get('/index.html', (req, res) => {
    res.render('home');
})
app.use('/', require('./routers/register.router'));

app.listen(port, () => {
    console.log(`Server start port at http://localhost:${port}`);
})
