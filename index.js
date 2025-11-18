import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

const pool = new pg.Pool(
    {
        user: 'postgres',
        host: 'localhost',
        database: 'trivia',
        password: 'licence black supply',
        port: 5432,
    }
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("index.ejs");
});

app.get('/login', (req, res) => {
  res.render("login.ejs");
});

app.get('/create-questions', (req, res) => {
  res.redirect('/');
});

app.get('/browse-questions', (req, res) => {
  res.redirect('/');
});

app.get('/create-games', (req, res) => {
  res.redirect('/');
});

app.get('/browse-games', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});