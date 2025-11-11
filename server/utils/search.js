import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fuse from 'fuse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/miningActs.json');
const miningActs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Enhanced search options with better fuzzy matching
const options = {
  includeScore: true,
  threshold: 0.6, // More lenient matching for better recall
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'text', weight: 0.4 },
    { name: 'tags', weight: 0.2 }
  ]
};

const fuse = new Fuse(miningActs, options);

// Query preprocessing with extensive synonyms
const preprocessQuery = (query) => {
  const synonyms = {
    'safety': ['security', 'protection', 'safe', 'danger', 'hazard', 'what should i do', 'what to do', 'procedure', 'action'],
    'health': ['medical', 'hygiene', 'welfare', 'wellness'],
    'accident': ['incident', 'mishap', 'injury', 'casualty', 'happen', 'occurs', 'there is', 'if'],
    'notice': ['inform', 'report', 'notify', 'tell', 'alert'],
    'mine': ['mining', 'mines', 'colliery', 'pit'],
    'worker': ['employee', 'person', 'laborer', 'staff', 'workman'],
    'regulation': ['rule', 'law', 'act', 'provision', 'requirement'],
    'ventilation': ['air', 'fresh air', 'circulation', 'breathing'],
    'explosive': ['blasting', 'dynamite', 'bomb', 'detonation'],
    'fire': ['blaze', 'flame', 'burn', 'combustion'],
    'water': ['drinking', 'potable', 'hydration'],
    'hours': ['time', 'shift', 'duration', 'period'],
    'leave': ['vacation', 'holiday', 'rest', 'time off'],
    'compensation': ['payment', 'wages', 'salary', 'remuneration'],
    'inspection': ['examination', 'check', 'audit', 'review'],
    'training': ['education', 'instruction', 'coaching', 'learning'],
    'equipment': ['machinery', 'tools', 'gear', 'apparatus'],
    'emergency': ['crisis', 'disaster', 'urgent', 'rescue'],
    'environment': ['pollution', 'contamination', 'degradation'],
    'waste': ['garbage', 'refuse', 'disposal', 'dumping'],
    'closure': ['shutdown', 'termination', 'ending'],
    'certificate': ['license', 'permit', 'authorization', 'qualification']
  };

  let processedQuery = query.toLowerCase();
  
  // Replace synonyms
  Object.keys(synonyms).forEach(key => {
    synonyms[key].forEach(synonym => {
      processedQuery = processedQuery.replace(new RegExp(synonym, 'g'), key);
    });
  });

  return processedQuery;
};

const search = (query) => {
  if (!query || query.trim().length < 2) {
    return {
      success: false,
      error: "Query too short. Please provide a more detailed question."
    };
  }

  // Try multiple search strategies in order of preference
  let results = [];
  
  // Strategy 1: Search with key phrases first
  const keyPhrases = extractKeyPhrases(query);
  const phraseResults = [];
  
  keyPhrases.forEach(phrase => {
    const phraseResult = fuse.search(phrase);
    phraseResults.push(...phraseResult);
  });
  
  if (phraseResults.length > 0) {
    // Remove duplicates and sort by relevance
    const uniquePhraseResults = [];
    const seen = new Set();
    
    phraseResults.sort((a, b) => a.score - b.score).forEach(result => {
      const key = `${result.item.act}-${result.item.section}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePhraseResults.push(result);
      }
    });
    
    if (uniquePhraseResults.length > 0) {
      results = uniquePhraseResults;
    }
  }

  // Strategy 2: If no results from phrases, try individual important words
  if (results.length === 0) {
    const importantWords = ['accident', 'safety', 'ventilation', 'hours', 'water', 'first-aid', 'fire', 'explosive'];
    const words = query.toLowerCase().split(/\s+/);
    const wordResults = [];
    
    words.forEach(word => {
      if (importantWords.includes(word) || word.length > 3) {
        const wordResult = fuse.search(word);
        wordResults.push(...wordResult);
      }
    });
    
    // Remove duplicates and sort by relevance
    const uniqueResults = [];
    const seen = new Set();
    
    wordResults.sort((a, b) => a.score - b.score).forEach(result => {
      const key = `${result.item.act}-${result.item.section}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(result);
      }
    });
    
    if (uniqueResults.length > 0) {
      results = uniqueResults;
    }
  }

  // Strategy 3: Try preprocessed query
  if (results.length === 0) {
    const processedQuery = preprocessQuery(query);
    results = fuse.search(processedQuery);
  }

  // Strategy 4: Try original query as fallback
  if (results.length === 0) {
    results = fuse.search(query.toLowerCase());
  }

  if (results.length === 0) {
    return {
      success: false,
      error: "I couldn't find specific information about that topic. However, I can help you with questions about mining safety regulations, worker welfare, accident procedures, ventilation requirements, working hours, and other mining-related laws. Please try rephrasing your question or ask about a specific aspect of mining regulations."
    };
  }

  return formatResults(results);
};

// Extract key phrases from query
const extractKeyPhrases = (query) => {
  const phrases = [];
  const lowerQuery = query.toLowerCase();
  
  // Common mining-related key phrases
  const keyPhraseMap = {
    'accident': ['mine accident', 'mining accident', 'accident in mine', 'accident occurs', 'accident happens'],
    'notice': ['notice of accident', 'report accident', 'inform authorities', 'notify management'],
    'safety': ['safety requirements', 'safety measures', 'safety procedures', 'safety regulations'],
    'ventilation': ['mine ventilation', 'ventilation requirements', 'air circulation', 'fresh air'],
    'hours': ['working hours', 'work hours', 'shift hours', 'daily hours'],
    'water': ['drinking water', 'potable water', 'water supply', 'water requirements'],
    'first-aid': ['first aid', 'medical aid', 'emergency aid', 'first aid station']
  };
  
  // Add the full query as a phrase
  phrases.push(lowerQuery);
  
  // Add individual words
  const words = lowerQuery.split(/\s+/);
  phrases.push(...words.filter(word => word.length > 2));
  
  // Add key phrases if they match the query
  Object.keys(keyPhraseMap).forEach(category => {
    keyPhraseMap[category].forEach(phrase => {
      if (lowerQuery.includes(phrase)) {
        phrases.push(phrase);
      }
    });
  });
  
  return [...new Set(phrases)]; // Remove duplicates
};

const formatResults = (results) => {
  // Return top 3 most relevant results
  const topResults = results.slice(0, 3);
  
  const formattedResults = topResults.map(result => ({
    act: result.item.act,
    section: result.item.section,
    title: result.item.title,
    answer: result.item.text,
    relevance: Math.round((1 - result.score) * 100)
  }));

  return {
    success: true,
    results: formattedResults,
    totalFound: results.length
  };
};

export default search;


