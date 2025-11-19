import express from "express";
import pg from "pg";

const app = express();
const port = 3000;
var pool = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon
    },
  });
} else {
  pool = new pg.Pool({
    host: process.env.PGHOST || "localhost",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "licence black supply",
    database: process.env.PGDATABASE || "trivia",
    port: Number(process.env.PGPORT) || 5432,
  });
}

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/create-questions", (req, res) => {
  res.render("create-questions.ejs");
});

app.post("/create-questions", async (req, res) => {
  const newQuestion = req.body;
  var message = "";

  if (newQuestion.question === "") {
    message = "Question cannot be empty.";
    res.render("create-questions.ejs", { message: message });
    return;
  }

  if (newQuestion.answer === "") {
    message = "Answer cannot be empty.";
    res.render("create-questions.ejs", { message: message });
    return;
  }

  await pool.query(
    "INSERT INTO questions (question, answer) VALUES ($1, $2)",
    [newQuestion.question, newQuestion.answer],
    (err, queryRes) => {
      if (err) {
        console.error(err.stack);
        message = "Failed to add question.";
      } else {
        console.log(`Added question: ${JSON.stringify(newQuestion)}`);
        message = "Question added successfully.";
      }
      res.render("create-questions.ejs", { message: message });
    }
  );
});

app.get("/browse-questions", async (req, res) => {
  const queryRes = await pool.query("SELECT * FROM questions");
  const questions = queryRes.rows;
  res.render("browse-questions.ejs", { questions: questions });
});

app.get("/create-games", async (req, res) => {
  const queryRes = await pool.query("SELECT * FROM questions");
  const questions = queryRes.rows;

  if (req.query.message) {
    res.render("create-games.ejs", {
      questions: questions,
      message: req.query.message,
    });
  } else {
    res.render("create-games.ejs", { questions: questions });
  }
});

app.post("/create-games", async (req, res) => {
  const newGame = req.body;
  var message = "";

  if (newGame.title === "") {
    message = "Title cannot be empty.";
    res.redirect(`/create-games?message=${message}`);
    return;
  }

  if (!newGame.questions) {
    message = "At least 1 question must be included.";
    res.redirect(`/create-games?message=${message}`);
    return;
  }

  var question_ids = [];
  if (newGame.questions.length === 1) {
    question_ids = [Number(newGame.questions)];
  } else {
    newGame.questions.forEach((q) => {
      question_ids.push(Number(q));
    });
  }

  await pool.query(
    "INSERT INTO games (title, question_ids) VALUES ($1, $2)",
    [newGame.title, question_ids],
    (err, queryRes) => {
      if (err) {
        console.error(err.stack);
        message = "Failed to add game.";
      } else {
        console.log(`Added games: ${JSON.stringify(newGame)}`);
        message = "Game added successfully.";
      }
      res.redirect(`/create-games?message=${message}`);
    }
  );
});

app.get("/browse-games", async (req, res) => {
  const queryRes = await pool.query("SELECT * FROM games");
  const games = queryRes.rows;
  res.render("browse-games.ejs", { games: games });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
