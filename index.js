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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});