// Netflick Application Logic

// API Configuration
const API_URL = '/api/chat';

// State
let userProfile = {
  name: "Movie Fan",
  ratings: {}, // movieId: rating (1-5)
  history: []  // timestamp, type, movieId
};

// Initialize Engines
const contentEngine = new ContentBasedEngine(moviesData);
const collabEngine = new CollaborativeEngine(moviesData, mockUserRatings);
const hybridEngine = new HybridEngine(contentEngine, collabEngine);

// Load user profile from local storage
function loadProfile() {
  const saved = localStorage.getItem('netflick_profile');
  if (saved) {
    userProfile = JSON.parse(saved);
    if (userProfile.name) document.getElementById('profile-name-input').value = userProfile.name;
    updateUserAvatar();
  }
}

function saveProfile() {
  localStorage.setItem('netflick_profile', JSON.stringify(userProfile));
  updateStats();
  renderHistory();
  updateRecommendations();
}

// Utility: get movie by ID
function getMovie(id) {
  return moviesData.find(m => m.id === Number(id));
}

// ==========================================
// GROQ AI INTEGRATION
// ==========================================

async function callGroqAPI(prompt, systemMsg = "You are an AI movie recommendation expert for a platform called Netflick.") {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, systemMsg })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq API Error:", error);
    return "The AI is currently analyzing data. Please try again later.";
  }
}

// ==========================================
// DOM MANIPULATION & RENDERING
// ==========================================

function renderMovieCard(movie, container, extraOverlay = '') {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.dataset.id = movie.id;
  
  const isLiked = userProfile.ratings[movie.id] >= 4;
  
  card.innerHTML = `
    <div class="card-poster">
      <img src="${movie.poster}" alt="${movie.title}" class="poster-image" onerror="this.closest('.movie-card').remove();" />
      <div class="card-rating">⭐ ${movie.rating}</div>
      <div class="card-overlay">
        <div class="overlay-play">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <div class="overlay-actions">
          <div class="overlay-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${movie.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div class="overlay-btn info-btn" data-id="${movie.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-title">${movie.title}</div>
      <div class="card-genre">${movie.genre.join(', ')}</div>
      ${extraOverlay}
    </div>
  `;
  
  // Events
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.overlay-btn')) {
      openModal(movie.id);
    }
  });
  
  const likeBtn = card.querySelector('.like-btn');
  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLike(movie.id);
    likeBtn.classList.toggle('liked');
  });

  container.appendChild(card);
}

function renderHomeRows() {
  const container = document.getElementById('home-rows');
  container.innerHTML = '';
  
  // Trending Now (Random subset for demo)
  const trendingMovies = [...moviesData].sort(() => 0.5 - Math.random()).slice(0, 8);
  createRow(container, '🔥 Trending Now', trendingMovies);
  
  // Action Thrillers
  const actionMovies = moviesData.filter(m => m.genre.includes('Action') || m.genre.includes('Thriller'));
  createRow(container, '💥 Action & Thrillers', actionMovies);
  
  // Sci-Fi Epics
  const scifiMovies = moviesData.filter(m => m.genre.includes('Sci-Fi'));
  createRow(container, '🚀 Sci-Fi Epics', scifiMovies);
}

function createRow(container, title, movies) {
  if (movies.length === 0) return;
  
  const rowHtml = document.createElement('div');
  rowHtml.className = 'movie-row';
  
  rowHtml.innerHTML = `
    <div class="row-header">
      <div class="row-title">${title}</div>
      <a href="#" class="row-see-all">See All</a>
    </div>
    <div class="movie-scroll"></div>
  `;
  
  const scrollContainer = rowHtml.querySelector('.movie-scroll');
  movies.forEach(movie => renderMovieCard(movie, scrollContainer));
  
  container.appendChild(rowHtml);
}

function updateHero() {
  // Pick random movie for hero
  const movie = moviesData[Math.floor(Math.random() * moviesData.length)];
  
  document.getElementById('hero-title').textContent = movie.title;
  document.getElementById('hero-desc').textContent = movie.description;
  document.querySelector('.hero-year').textContent = movie.year;
  document.querySelector('.hero-genre').textContent = movie.genre.join(' · ');
  document.querySelector('.hero-duration').textContent = movie.duration;
  document.querySelector('.hero-rating').textContent = `⭐ ${movie.rating}`;
  
  const heroSection = document.getElementById('hero-section');
  if (movie.backdrop && !movie.backdrop.includes('null')) {
    heroSection.style.backgroundImage = `url('${movie.backdrop}')`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center top';
  } else {
    heroSection.style.background = 'linear-gradient(135deg, #1a1a3e, #2d1b4e)';
  }
  
  const likeBtn = document.getElementById('hero-like-btn');
  likeBtn.dataset.movieId = movie.id;
  if (userProfile.ratings[movie.id] >= 4) {
    likeBtn.classList.add('liked');
  } else {
    likeBtn.classList.remove('liked');
  }

  // Fetch AI Tagline
  const prompt = `Give me a one-sentence punchy tagline for the movie "${movie.title}" (${movie.year}). Make it sound exciting and tailored for an OTT streaming platform hero banner.`;
  
  callGroqAPI(prompt, "You are a copywriter for Netflix. Write short, punchy marketing copy.").then(tagline => {
    document.getElementById('ai-tagline-text').textContent = tagline;
  });
}

function updateRecommendations(algo = 'hybrid') {
  const container = document.getElementById('recommendations-grid');
  container.innerHTML = '';
  
  let recs = [];
  
  if (Object.keys(userProfile.ratings).length === 0) {
    // Fallback if no ratings
    recs = hybridEngine.getPopularMoviesFallback(12);
  } else {
    if (algo === 'hybrid') recs = hybridEngine.getRecommendations(userProfile.ratings, 12);
    else if (algo === 'content') recs = contentEngine.getRecommendationsForUser(userProfile.ratings, 12);
    else if (algo === 'collaborative') recs = collabEngine.getRecommendationsForUser(userProfile.ratings, 12);
  }
  
  recs.forEach(rec => {
    const movie = getMovie(rec.movieId);
    if (!movie) return;
    
    // Add score bar overlay
    const scorePct = Math.min(100, Math.round((rec.score || 0) * 100));
    const extraOverlay = `
      <div class="rec-score-bar" title="AI Match Score: ${scorePct}%">
        <div class="rec-score-fill" style="width: ${scorePct}%"></div>
      </div>
    `;
    
    renderMovieCard(movie, container, extraOverlay);
  });
  
  updateAIInsight(recs);
}

async function updateAIInsight(recs) {
  const insightText = document.getElementById('ai-insight-text');
  
  if (Object.keys(userProfile.ratings).length === 0) {
    insightText.textContent = "Rate some movies to get personalized AI insights about your taste profile.";
    return;
  }
  
  // Get top 3 rated movies
  const sortedRatings = Object.entries(userProfile.ratings)
    .filter(([_, r]) => r >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, _]) => getMovie(id).title);
    
  if (sortedRatings.length === 0) {
    insightText.textContent = "We see you've rated some movies, but none highly. Like some movies to help us understand what you love.";
    return;
  }

  const recTitles = recs.slice(0, 3).map(r => getMovie(r.movieId).title);
  
  insightText.textContent = "Generating AI insight based on your recent activity...";
  
  const prompt = `A user loves these movies: ${sortedRatings.join(', ')}. Based on this, I recommended: ${recTitles.join(', ')}. In 2-3 sentences, briefly explain to the user WHY these recommendations fit their taste profile. Address the user directly (e.g. "Because you loved X...").`;
  
  const insight = await callGroqAPI(prompt);
  insightText.textContent = insight;
}

// ==========================================
// MODAL & INTERACTIVITY
// ==========================================

function openModal(movieId) {
  const movie = getMovie(movieId);
  if (!movie) return;
  
  const modal = document.getElementById('movie-modal');
  const overlay = document.getElementById('modal-overlay');
  
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-desc').textContent = movie.description;
  
  // Meta
  document.getElementById('modal-meta').innerHTML = `
    <span>${movie.year}</span>
    <span>${movie.duration}</span>
    <span>Dir: ${movie.director}</span>
    <span>Cast: ${movie.cast.slice(0, 2).join(', ')}</span>
  `;
  
  // Badges
  document.getElementById('modal-badges').innerHTML = `
    <span class="badge badge-rating">⭐ ${movie.rating}</span>
    ${movie.genre.map(g => `<span class="badge badge-genre">${g}</span>`).join('')}
  `;
  
  // Background
  const hero = document.getElementById('modal-hero');
  if (movie.backdrop && !movie.backdrop.includes('null')) {
    hero.style.backgroundImage = `url('${movie.backdrop}')`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center top';
  } else {
    hero.style.background = 'linear-gradient(135deg, #1a1a3e, #2d1b4e)';
  }
  
  // Star Rating
  setupStarRating(movieId);
  
  // Similar Movies Sidebar
  renderSimilarMovies(movieId);
  
  // Like Button State
  const likeBtn = document.getElementById('modal-like-btn');
  likeBtn.dataset.id = movie.id;
  if (userProfile.ratings[movie.id] >= 4) {
    likeBtn.classList.add('liked');
  } else {
    likeBtn.classList.remove('liked');
  }
  
  // Reset AI box
  document.getElementById('modal-ai-text').textContent = "Click to generate AI analysis...";
  const aiBtn = document.getElementById('modal-ai-btn');
  aiBtn.style.display = 'block';
  aiBtn.onclick = async () => {
    aiBtn.textContent = '✨ Analyzing...';
    aiBtn.disabled = true;
    
    const prompt = `Give me a short, fascinating trivia fact or deep dive analysis about the movie "${movie.title}" (${movie.year}) directed by ${movie.director}. Max 3 sentences.`;
    const analysis = await callGroqAPI(prompt);
    
    document.getElementById('modal-ai-text').textContent = analysis;
    aiBtn.style.display = 'none';
    aiBtn.disabled = false;
    aiBtn.textContent = '✨ Analyze with AI';
  };
  
  // Add to history if not just browsing
  logHistory('viewed', movie.id);
  
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function setupStarRating(movieId) {
  const container = document.getElementById('modal-star-rating');
  container.innerHTML = '';
  
  const currentRating = userProfile.ratings[movieId] || 0;
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = `star ${i <= currentRating ? 'active' : ''}`;
    star.textContent = '★';
    star.dataset.val = i;
    
    star.addEventListener('mouseenter', () => {
      // Highlight stars up to this one
      Array.from(container.children).forEach(s => {
        s.classList.toggle('hover', s.dataset.val <= i);
      });
    });
    
    star.addEventListener('mouseleave', () => {
      Array.from(container.children).forEach(s => s.classList.remove('hover'));
    });
    
    star.addEventListener('click', () => {
      rateMovie(movieId, i);
      setupStarRating(movieId); // re-render
    });
    
    container.appendChild(star);
  }
}

function renderSimilarMovies(movieId) {
  const container = document.getElementById('similar-list');
  container.innerHTML = '';
  
  const similar = contentEngine.getSimilarMovies(movieId, 4);
  
  similar.forEach(sim => {
    const movie = getMovie(sim.movieId);
    const scorePct = Math.round(sim.score * 100);
    
    const item = document.createElement('div');
    item.className = 'similar-item';
    item.innerHTML = `
      <div class="similar-emoji">🎬</div>
      <div class="similar-info">
        <div class="similar-title">${movie.title}</div>
        <div class="similar-genre">${movie.genre.slice(0, 2).join(', ')}</div>
        <div class="similar-score">${scorePct}% Match</div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      openModal(movie.id); // Open new modal inside modal
    });
    
    container.appendChild(item);
  });
}

// ==========================================
// USER ACTIONS & PROFILE
// ==========================================

function toggleLike(movieId) {
  const currentRating = userProfile.ratings[movieId] || 0;
  if (currentRating >= 4) {
    delete userProfile.ratings[movieId]; // unlike
    showToast("Removed from Liked");
  } else {
    userProfile.ratings[movieId] = 5; // like = max rating
    showToast("Added to Liked ❤️");
    logHistory('liked', movieId);
  }
  saveProfile();
}

function rateMovie(movieId, rating) {
  userProfile.ratings[movieId] = rating;
  showToast(`Rated ${rating} Stars ⭐`);
  logHistory('rated', movieId, rating);
  saveProfile();
}

function logHistory(action, movieId, value = null) {
  userProfile.history.unshift({
    timestamp: new Date().getTime(),
    action: action,
    movieId: movieId,
    value: value
  });
  
  // Keep last 50
  if (userProfile.history.length > 50) {
    userProfile.history.pop();
  }
  
  saveProfile();
}

function updateStats() {
  const ratedCount = Object.keys(userProfile.ratings).length;
  const likedCount = Object.values(userProfile.ratings).filter(r => r >= 4).length;
  
  document.getElementById('stat-rated').textContent = ratedCount;
  document.getElementById('stat-liked').textContent = likedCount;
  document.getElementById('stat-recommendations').textContent = 
    ratedCount > 0 ? hybridEngine.getRecommendations(userProfile.ratings, 50).length : 0;
    
  // Generate Mood Tags
  generateMoodTags();
}

function generateMoodTags() {
  const container = document.getElementById('mood-tags');
  container.innerHTML = '';
  
  const likedIds = Object.keys(userProfile.ratings).filter(id => userProfile.ratings[id] >= 4);
  
  if (likedIds.length === 0) {
    container.innerHTML = '<span class="empty-state">Like movies to unlock mood tags</span>';
    return;
  }
  
  const tagCounts = {};
  likedIds.forEach(id => {
    const movie = getMovie(id);
    if (movie && movie.tags) {
      movie.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  // Get top 6 tags
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(entry => entry[0]);
    
  sortedTags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'mood-tag';
    span.textContent = '#' + tag;
    container.appendChild(span);
  });
}

function renderHistory() {
  const container = document.getElementById('history-timeline');
  container.innerHTML = '';
  
  if (userProfile.history.length === 0) {
    container.innerHTML = '<p class="empty-state">No activity yet. Go watch some movies!</p>';
    return;
  }
  
  // Only show significant actions (likes, rates)
  const filteredHistory = userProfile.history.filter(h => h.action === 'liked' || h.action === 'rated');
  
  filteredHistory.slice(0, 15).forEach(item => {
    const movie = getMovie(item.movieId);
    if (!movie) return;
    
    const date = new Date(item.timestamp).toLocaleDateString();
    let actionText = '';
    
    if (item.action === 'liked') actionText = 'Liked';
    else if (item.action === 'rated') actionText = `Rated ${item.value} Stars`;
    
    const el = document.createElement('div');
    el.className = 'history-item';
    el.innerHTML = `
      <div class="history-dot"></div>
      <div class="history-body">
        <div class="history-title">${movie.title}</div>
        <div class="history-meta">${actionText} on ${date}</div>
        <div class="history-reason">AI adjusted hybrid weights based on this signal.</div>
      </div>
      <div class="history-score">${movie.genre[0]}</div>
    `;
    
    container.appendChild(el);
  });
}

function updateUserAvatar() {
  const initial = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';
  document.getElementById('user-initial').textContent = initial;
  document.getElementById('profile-initial').textContent = initial;
}

// ==========================================
// UTILS
// ==========================================

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ==========================================
// INIT & EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active nav state
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Switch section
      const targetId = `section-${link.dataset.section}`;
      document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
      
      // Section specific logic
      if (link.dataset.section === 'recommendations') {
        updateRecommendations(); // Refresh
      }
    });
  });
  
  // Recommendation Algo Tabs
  document.querySelectorAll('.algo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.algo-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const algo = tab.dataset.algo;
      updateRecommendations(algo);
      
      // Update explainer
      const explainer = document.getElementById('algo-explainer');
      if (algo === 'hybrid') {
        explainer.innerHTML = `<div class="algo-explainer-icon">🔀</div><div><strong>Hybrid Model</strong> — Combines collaborative filtering with content-based filtering.</div>`;
      } else if (algo === 'content') {
        explainer.innerHTML = `<div class="algo-explainer-icon">🏷️</div><div><strong>Content-Based</strong> — Recommends movies with similar genres, tags, and directors to what you like.</div>`;
      } else {
        explainer.innerHTML = `<div class="algo-explainer-icon">👥</div><div><strong>Collaborative Filtering</strong> — Finds other users with similar tastes and recommends what they liked.</div>`;
      }
    });
  });
  
  // Modal Close
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  });
  
  // Close modal on outside click
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) {
      document.getElementById('modal-overlay').classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  
  // Profile Name Input
  const nameInput = document.getElementById('profile-name-input');
  nameInput.addEventListener('change', (e) => {
    userProfile.name = e.target.value;
    updateUserAvatar();
    saveProfile();
    showToast("Profile Updated");
  });
  
  // Reset Profile
  document.getElementById('reset-profile-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset your taste profile? This will clear all ratings and history.")) {
      userProfile = { name: userProfile.name, ratings: {}, history: [] };
      saveProfile();
      showToast("Profile Reset");
      // Switch back to home
      document.querySelector('[data-section="home"]').click();
    }
  });
  
  // Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      document.getElementById('navbar').classList.add('scrolled');
    } else {
      document.getElementById('navbar').classList.remove('scrolled');
    }
  });

  // Settings / API Key prompt on avatar click
  document.getElementById('user-avatar-btn').addEventListener('click', () => {
    showToast("AI is connected securely via Vercel Backend! 🔒");
  });
  
  // Hero Buttons
  document.getElementById('hero-like-btn').addEventListener('click', function(e) {
    const id = this.dataset.movieId;
    if (id) {
      toggleLike(id);
      this.classList.toggle('liked');
    }
  });
  
  document.getElementById('hero-info-btn').addEventListener('click', () => {
    const id = document.getElementById('hero-like-btn').dataset.movieId;
    if (id) openModal(id);
  });
  
  // Initialize App
  loadProfile();
  updateHero();
  renderHomeRows();
});
