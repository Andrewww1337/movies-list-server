import express, { response } from "express";
import axios from "axios";
const PORT = 5001;
const moviesLibrary = [];

const app = express();
app.use(express.json());

const addNewMovie = (req, res) => {
  const replacedKeyword = req.query.keyword.replace(/ /g, "+");

  axios
    .get(`https://www.omdbapi.com/?apikey=4523a71b&i&t=${replacedKeyword}`)
    .then(function (response) {
      if (response.data.Response === "False") {
        res.status(400).json("фильм не найден или неправильное название");
      } else {
        moviesLibrary.unshift(response.data);
        res.status(200).json({
          objects: moviesLibrary.slice(
            4 * req.query.page,
            4 * req.query.page + 4
          ),
          total: moviesLibrary.length,
        });
      }
    })
    .catch(function (error) {
      res.status(400).json(error);
    });
};

function addMovie() {
  try {
    app.post("/movie", (req, res) => {
      try {
        addNewMovie(req, res);
      } catch (e) {
        res.status(400).json("Такого фильма нет");
      }
    });
  } catch (e) {
    res.status(400).json("error3");
  }
}

addMovie();

function getMovie() {
  try {
    app.get("/movies", (req, res) => {
      if (req.query.catalogues && !req.query.keyword) {
        const filteredArray = moviesLibrary.filter((movie) =>
          movie.Genre.includes(req.query.catalogues)
        );
        try {
          res.status(200).json({
            objects: filteredArray.slice(
              4 * req.query.page,
              4 * req.query.page + 4
            ),
            total: filteredArray.length,
          });
        } catch (error) {
          res.status(400).json("error");
        }
      } else if (req.query.keyword?.length > 2 && !req.query.catalogues) {
        const filteredArray = moviesLibrary.filter((movie) =>
          movie.Title?.toLowerCase().includes(req.query.keyword?.toLowerCase())
        );

        try {
          res.status(200).json({
            objects: filteredArray.slice(
              4 * req.query.page,
              4 * req.query.page + 4
            ),
            total: filteredArray.length,
          });
        } catch (error) {
          res.status(400).json("error");
        }
      } else if (req.query.keyword?.length > 2 && req.query.catalogues) {
        const filteredArray = moviesLibrary
          .filter((movie) =>
            movie.Title?.toLowerCase().includes(
              req.query.keyword?.toLowerCase()
            )
          )
          .filter((movie) => movie.Genre.includes(req.query.catalogues));

        try {
          res.status(200).json({
            objects: filteredArray.slice(
              4 * req.query.page,
              4 * req.query.page + 4
            ),
            total: filteredArray.length,
          });
        } catch (error) {
          res.status(400).json("error");
        }
      } else {
        try {
          res.status(200).json({
            objects: moviesLibrary.slice(
              4 * req.query.page,
              4 * req.query.page + 4
            ),
            total: moviesLibrary.length,
          });
        } catch (error) {
          res.status(400).json("error");
        }
      }
    });
  } catch (e) {
    res.status(400).json("error");
  }
}
getMovie();

function delMovie() {
  try {
    app.delete("/delete/:id", (req, res) => {
      const deleteMovie = moviesLibrary.splice(
        moviesLibrary.findIndex((movie) => movie.imdbID === req.params.id),
        1
      );
      try {
        res.status(200).json({
          objects: moviesLibrary.slice(0, 4),
          total: moviesLibrary.length,
        });
      } catch (error) {
        res.status(400).json("error");
      }
    });
  } catch (e) {
    res.status(400).json("error");
  }
}

delMovie();

function rateMovie() {
  try {
    app.put("/movies/:id", (req, res) => {
      const rerateeMovie = (moviesLibrary[
        moviesLibrary.findIndex((movie) => movie.imdbID === req.params.id)
      ].imdbRating = String(req.query.grade));

      try {
        res.status(200).json({
          result: "success",
        });
      } catch (error) {
        res.status(400).json("error");
      }
    });
  } catch (e) {
    res.status(400).json("error");
  }
}

rateMovie();

function getFavorite() {
  try {
    app.get("/favorite", (req, res) => {
      const filteredArray = moviesLibrary.filter((movie) =>
        req.query.search.includes(movie.imdbID)
      );
      console.log(filteredArray);
      try {
        res.status(200).json({
          objects: filteredArray,
          total: 0,
        });
      } catch (error) {
        res.status(400).json("error");
      }
    });
  } catch (e) {
    res.status(400).json("error");
  }
}
getFavorite();

function getCatalogues() {
  try {
    app.get("/genres", (req, res) => {
      res.status(200).json([
        {
          id: 1,
          key: "Adventure",
          title: "Приключения",
        },
        {
          id: 2,
          key: "Comedy",

          title: "Комедия",
        },
        {
          id: 3,
          key: "Action",

          title: "Экшен",
        },
        {
          id: 4,
          key: "Horror",
          title: "Ужасы",
        },
        {
          id: 5,
          key: "Drama",
          title: "Драма",
        },
      ]);
    });
  } catch (e) {
    res.status(400).json("error");
  }
}

getCatalogues();

app.listen(PORT, () => console.log("privet" + PORT));
