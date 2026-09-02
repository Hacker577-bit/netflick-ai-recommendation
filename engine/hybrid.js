// Hybrid Recommendation Engine
// Combines Content-Based and Collaborative Filtering results

class HybridEngine {
  constructor(contentEngine, collaborativeEngine) {
    this.contentEngine = contentEngine;
    this.collaborativeEngine = collaborativeEngine;
    
    // Weights for combining scores
    this.contentWeight = 0.6; // slightly favor content-based for better cold start
    this.collabWeight = 0.4;
  }

  getRecommendations(userRatings, limit = 10) {
    // If no ratings, return top-rated popular movies as fallback
    if (Object.keys(userRatings).length === 0) {
      return this.getPopularMoviesFallback(limit);
    }

    // Get recommendations from both engines
    const contentRecs = this.contentEngine.getRecommendationsForUser(userRatings, 20);
    const collabRecs = this.collaborativeEngine.getRecommendationsForUser(userRatings, 20);

    // Combine results
    const combinedScores = {};

    // Process content-based scores
    contentRecs.forEach(rec => {
      combinedScores[rec.movieId] = {
        contentScore: rec.score,
        collabScore: 0,
        movieId: rec.movieId
      };
    });

    // Process collaborative scores
    collabRecs.forEach(rec => {
      if (!combinedScores[rec.movieId]) {
        combinedScores[rec.movieId] = {
          contentScore: 0,
          collabScore: rec.score,
          movieId: rec.movieId
        };
      } else {
        combinedScores[rec.movieId].collabScore = rec.score;
      }
    });

    // Calculate hybrid scores
    const hybridRecs = Object.values(combinedScores).map(item => {
      // If a movie is only recommended by one engine, its score is naturally lower
      // due to the 0 from the other engine, which is desired behavior
      const hybridScore = (item.contentScore * this.contentWeight) + (item.collabScore * this.collabWeight);
      
      return {
        movieId: item.movieId,
        score: hybridScore,
        contentScore: item.contentScore,
        collabScore: item.collabScore
      };
    });

    // Sort by hybrid score descending
    hybridRecs.sort((a, b) => b.score - a.score);

    // Filter out items with very low scores to maintain quality
    const filteredRecs = hybridRecs.filter(r => r.score > 0.1);
    
    // If we filtered out too many, fall back to pure content-based
    if (filteredRecs.length < 3 && contentRecs.length > 0) {
      return contentRecs.map(r => ({ ...r, hybridFallback: true })).slice(0, limit);
    }

    return filteredRecs.slice(0, limit);
  }

  // Fallback for new users with no ratings
  getPopularMoviesFallback(limit) {
    // Just sort by base rating
    const sorted = [...this.contentEngine.movies].sort((a, b) => b.rating - a.rating);
    
    return sorted.slice(0, limit).map(m => ({
      movieId: m.id,
      score: m.rating / 10, // normalized
      isFallback: true
    }));
  }
}
