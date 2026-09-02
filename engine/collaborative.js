// Collaborative Filtering Engine
// Calculates similarity between users based on their ratings to recommend movies

class CollaborativeEngine {
  constructor(allMovies, allUserRatings) {
    this.movies = allMovies;
    this.userRatings = allUserRatings; // { userId: { movieId: rating, ... } }
  }

  // Calculate Pearson correlation coefficient between two users
  calculatePearsonCorrelation(user1Ratings, user2Ratings) {
    // Find common movies rated by both users
    const commonMovies = [];
    for (const movieId in user1Ratings) {
      if (user2Ratings[movieId]) {
        commonMovies.push(movieId);
      }
    }

    const n = commonMovies.length;
    
    // If no common movies, they have no correlation
    if (n === 0) return 0;

    // Calculate sums
    let sum1 = 0, sum2 = 0;
    let sum1Sq = 0, sum2Sq = 0;
    let pSum = 0;

    for (const movieId of commonMovies) {
      const rating1 = user1Ratings[movieId];
      const rating2 = user2Ratings[movieId];
      
      sum1 += rating1;
      sum2 += rating2;
      sum1Sq += Math.pow(rating1, 2);
      sum2Sq += Math.pow(rating2, 2);
      pSum += rating1 * rating2;
    }

    // Calculate Pearson correlation
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) * (sum2Sq - Math.pow(sum2, 2) / n));

    if (den === 0) return 0;

    return num / den;
  }

  // Get recommendations for a target user based on other users' ratings
  getRecommendationsForUser(targetUserRatings, limit = 10) {
    // If user hasn't rated anything, we can't provide collaborative recommendations
    const ratedMovieIds = Object.keys(targetUserRatings).map(Number);
    if (ratedMovieIds.length === 0) return [];

    const similarities = {}; // Store similarity with other users
    
    // Calculate similarity with all other users
    for (const userId in this.userRatings) {
      const otherUserRatings = this.userRatings[userId];
      const sim = this.calculatePearsonCorrelation(targetUserRatings, otherUserRatings);
      
      // Only consider users with positive correlation
      if (sim > 0) {
        similarities[userId] = sim;
      }
    }

    const candidates = {}; // movie_id -> { totalWeightedRating, sumOfSimilarities }
    
    // Generate candidate recommendations
    for (const userId in similarities) {
      const sim = similarities[userId];
      const otherUserRatings = this.userRatings[userId];
      
      for (const movieId in otherUserRatings) {
        const id = Number(movieId);
        
        // Skip movies the target user has already rated
        if (ratedMovieIds.includes(id)) continue;
        
        const rating = otherUserRatings[movieId];
        
        if (!candidates[id]) {
          candidates[id] = { totalWeightedRating: 0, sumOfSimilarities: 0 };
        }
        
        // Weight rating by user similarity
        candidates[id].totalWeightedRating += rating * sim;
        candidates[id].sumOfSimilarities += sim;
      }
    }

    // Calculate predicted ratings
    const recommendations = [];
    
    for (const movieId in candidates) {
      const { totalWeightedRating, sumOfSimilarities } = candidates[movieId];
      
      if (sumOfSimilarities > 0) {
        const predictedRating = totalWeightedRating / sumOfSimilarities;
        
        // Normalize score between 0 and 1 (assuming max rating is 5)
        const score = predictedRating / 5;
        
        recommendations.push({
          movieId: Number(movieId),
          score: score,
          predictedRating: predictedRating
        });
      }
    }

    // Sort by predicted score descending
    recommendations.sort((a, b) => b.score - a.score);
    
    return recommendations.slice(0, limit);
  }
}
