const moviesData = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genre: ["Sci-Fi", "Action", "Thriller"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    rating: 8.8,
    duration: "2h 28m",
    poster: "https://image.tmdb.org/t/p/w500/8IB2e4R45Td2U39g0gC3pQc1x65.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    tags: ["mind-bending", "dreams", "heist", "subconscious"]
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama", "Thriller"],
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    rating: 9.0,
    duration: "2h 32m",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
    tags: ["superhero", "dc comics", "villain", "dark"]
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    rating: 8.6,
    duration: "2h 49m",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QlsUUHXjNpeXac6nB2FPA68.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjEVA14qLvwM6KqK5b.jpg",
    tags: ["space travel", "black hole", "time dilation", "future"]
  },
  {
    id: 4,
    title: "The Matrix",
    year: 1999,
    genre: ["Action", "Sci-Fi"],
    director: "Lana Wachowski, Lilly Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    description: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    rating: 8.7,
    duration: "2h 16m",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/icMNCcgLHE6vnSYLW279j7Y3LIf.jpg",
    tags: ["virtual reality", "artificial intelligence", "dystopia", "martial arts"]
  },
  {
    id: 5,
    title: "Pulp Fiction",
    year: 1994,
    genre: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    description: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    rating: 8.9,
    duration: "2h 34m",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    tags: ["nonlinear timeline", "black comedy", "hitman", "los angeles"]
  },
  {
    id: 6,
    title: "Parasite",
    year: 2019,
    genre: ["Comedy", "Thriller", "Drama"],
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    description: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    rating: 8.5,
    duration: "2h 12m",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoZPhKwX8IJj.jpg",
    tags: ["class differences", "social satire", "seoul", "dark comedy"]
  },
  {
    id: 7,
    title: "Avengers: Endgame",
    year: 2019,
    genre: ["Adventure", "Sci-Fi", "Action"],
    director: "Anthony Russo, Joe Russo",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
    rating: 8.4,
    duration: "3h 1m",
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    tags: ["superhero", "marvel", "time travel", "ensemble cast"]
  },
  {
    id: 8,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    genre: ["Action", "Adventure", "Animation", "Sci-Fi"],
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
    description: "Struggling to find his place in the world while juggling school and family, Brooklyn teenager Miles Morales is unexpectedly bitten by a radioactive spider and develops unfathomable powers just like the one and only Spider-Man.",
    rating: 8.4,
    duration: "1h 57m",
    poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7d6EY00g1c39SGZOoCJ5Py9nNth.jpg",
    tags: ["superhero", "multiverse", "animation", "coming of age"]
  },
  {
    id: 9,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "Daniel Kwan, Daniel Scheinert",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan"],
    description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
    rating: 7.9,
    duration: "2h 19m",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/t0f0gM1W1e2i1xst5Y0nU0O8Z6V.jpg",
    tags: ["multiverse", "surreal", "family relationships", "action comedy"]
  },
  {
    id: 10,
    title: "Gladiator",
    year: 2000,
    genre: ["Action", "Drama", "Adventure"],
    director: "Ridley Scott",
    cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
    description: "In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus is one of the Roman army's most capable and trusted generals and a key advisor to the emperor.",
    rating: 8.5,
    duration: "2h 35m",
    poster: "https://image.tmdb.org/t/p/w500/ty8Gx2LQG14r5rJ83H6Jd649y8x.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/hQ4pYsIbP22TMXOUdSfC2cbWonr.jpg",
    tags: ["ancient rome", "gladiator", "revenge", "epic"]
  },
  {
    id: 11,
    title: "Mad Max: Fury Road",
    year: 2015,
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "George Miller",
    cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
    description: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life.",
    rating: 8.1,
    duration: "2h 0m",
    poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/gL968YEvsI8tQz9K7vN34h38z9h.jpg",
    tags: ["post-apocalyptic", "car chase", "dystopia", "feminist"]
  },
  {
    id: 12,
    title: "The Silence of the Lambs",
    year: 1991,
    genre: ["Crime", "Drama", "Thriller", "Horror"],
    director: "Jonathan Demme",
    cast: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn"],
    description: "Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, serving life behind bars for various acts of murder and cannibalism.",
    rating: 8.6,
    duration: "1h 58m",
    poster: "https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/mfwq2nMBzArzQOcbZXErCQrzZOV.jpg",
    tags: ["serial killer", "fbi", "psychological thriller", "cannibalism"]
  }
];

// Provide some mock ratings matrix for collaborative filtering
// Users 1-5 represent the "other users" in the system
const mockUserRatings = {
  1: { 1: 5, 2: 5, 3: 4, 4: 5, 7: 5, 11: 4 }, // Likes Action/Sci-Fi (Nolan fan)
  2: { 5: 5, 6: 5, 9: 4, 12: 5, 10: 4 },      // Likes Crime/Drama/Thriller (Tarantino/Bong Joon-ho fan)
  3: { 7: 5, 8: 5, 2: 4, 9: 4 },              // Likes Superheroes/Animation
  4: { 1: 4, 3: 5, 4: 4, 9: 5, 11: 5 },       // Likes Sci-Fi/Mind-bending
  5: { 2: 5, 5: 4, 10: 5, 12: 4, 1: 3 }       // Likes Action/Crime Epics
};
