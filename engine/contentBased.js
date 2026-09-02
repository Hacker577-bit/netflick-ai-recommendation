// Content-Based Filtering Engine
// Calculates similarity between movies based on features (genres, tags, directors)

class ContentBasedEngine {
  constructor(movies) {
    this.movies = movies;
    this.movieFeatures = this.buildFeatureVectors();
  }

  // Extract all unique features across all movies
  buildFeatureVectors() {
    const vectors = {};
    
    this.movies.forEach(movie => {
      // Combine genres, tags, and director into a feature array
      let features = [];
      
      if (movie.genre) features = [...features, ...movie.genre.map(g => `genre_${g}`)];
      if (movie.tags) features = [...features, ...movie.tags.map(t => `tag_${t}`)];
      if (movie.director) features.push(`director_${movie.director}`);
      
      // Convert to lowercase to ensure matching
      features = features.map(f => f.toLowerCase().replace(/\s+/g, '_'));
      
      vectors[movie.id] = features;
    });
    
    return vectors;
  }

  // Calculate Jaccard similarity between two feature sets
  calculateJaccardSimilarity(features1, features2) {
    if (!features1 || !features2 || features1.length === 0 || features2.length === 0) return 0;
    
    const set1 = new Set(features1);
    const set2 = new Set(features2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // Calculate similarity between a target movie and all other movies
  getSimilarMovies(movieId, limit = 5) {
    const targetFeatures = this.movieFeatures[movieId];
    if (!targetFeatures) return [];
    
    const similarities = [];
    
    this.movies.forEach(movie => {
      if (movie.id === movieId) return; // Skip self
      
      const features = this.movieFeatures[movie.id];
      const score = this.calculateJaccardSimilarity(targetFeatures, features);
      
      similarities.push({
        movieId: movie.id,
        score: score
      });
    });
    
    // Sort by score descending
    similarities.sort((a, b) => b.score - a.score);
    
    return similarities.slice(0, limit);
  }

  // Get recommendations for a user based on their liked/rated movies
  getRecommendationsForUser(userRatings, limit = 10) {
    // If no ratings, return empty
    const ratedMovieIds = Object.keys(userRatings).map(Number);
    if (ratedMovieIds.length === 0) return [];
    
    // Only consider positively rated movies (rating >= 3)
    const positiveRatings = ratedMovieIds.filter(id => userRatings[id] >= 3);
    if (positiveRatings.length === 0) return [];
    
    const movieScores = {};
    
    // For each candidate movie
    this.movies.forEach(movie => {
      // Skip if already rated
      if (ratedMovieIds.includes(movie.id)) return;
      
      let totalSimilarity = 0;
      let count = 0;
      
      // Compare candidate with all positively rated movies
      positiveRatings.forEach(ratedId => {
        const rating = userRatings[ratedId];
        // Weight the similarity by how much the user liked the reference movie
        const ratingWeight = (rating - 2) / 3; // Scales 3-5 rating to 0.33-1.0
        
        const simScore = this.calculateJaccardSimilarity(
          this.movieFeatures[movie.id],
          this.movieFeatures[ratedId]
        );
        
        totalSimilarity += simScore * ratingWeight;
        count++;
      });
      
      // Calculate average weighted similarity score
      movieScores[movie.id] = count > 0 ? totalSimilarity / count : 0;
    });
    
    // Convert to array and sort
    const recommendations = Object.keys(movieScores).map(id => ({
      movieId: Number(id),
      score: movieScores[id]
    }));
    
    recommendations.sort((a, b) => b.score - a.score);
    
    return recommendations.slice(0, limit);
  }
}
