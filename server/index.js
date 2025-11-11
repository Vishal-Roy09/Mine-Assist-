import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import search from './utils/search.js';

// Helper function to provide contextual help based on regulation type
const getContextualHelp = (title, act, section) => {
  if (title.toLowerCase().includes('accident')) {
    return {
      type: 'accident',
      help: 'Remember: In case of any mine accident, immediately ensure safety of personnel, provide first aid if needed, and notify the appropriate authorities as required by law.',
      nextSteps: ['Ensure the area is safe', 'Provide first aid if trained', 'Notify management immediately', 'Document the incident']
    };
  } else if (title.toLowerCase().includes('safety') || title.toLowerCase().includes('ventilation')) {
    return {
      type: 'safety',
      help: 'Safety regulations are designed to prevent accidents and protect workers. Always follow established procedures.',
      nextSteps: ['Review safety procedures regularly', 'Report any safety concerns', 'Use proper protective equipment']
    };
  } else if (title.toLowerCase().includes('hours') || title.toLowerCase().includes('rest')) {
    return {
      type: 'work_hours',
      help: 'Work hour regulations protect worker health and ensure adequate rest periods.',
      nextSteps: ['Track your work hours', 'Take required rest breaks', 'Report violations to management']
    };
  } else if (title.toLowerCase().includes('welfare') || title.toLowerCase().includes('canteen') || title.toLowerCase().includes('water')) {
    return {
      type: 'welfare',
      help: 'Welfare facilities are essential for worker well-being and must be maintained according to regulations.',
      nextSteps: ['Use facilities properly', 'Report any issues with facilities', 'Maintain cleanliness']
    };
  }
  return null;
};

// Smart suggestions based on query content
const getSmartSuggestions = (query) => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('accident') || queryLower.includes('incident')) {
    return [
      "What should be done immediately after a mine accident?",
      "Who should be notified about mining accidents?",
      "What are the reporting requirements for mine accidents?",
      "What first aid facilities should be available in mines?",
      "What are the safety requirements in mines?"
    ];
  } else if (queryLower.includes('safety') || queryLower.includes('danger')) {
    return [
      "What are the safety requirements in mines?",
      "What ventilation requirements exist for mines?",
      "What are the rules about explosives in mining?",
      "What fire safety measures are required?",
      "What first aid facilities should be available?"
    ];
  } else if (queryLower.includes('hours') || queryLower.includes('work') || queryLower.includes('time')) {
    return [
      "What are the working hours for mine workers?",
      "What is the weekly day of rest requirement?",
      "What are the overtime regulations?",
      "What are the rest break requirements?",
      "What are the shift duration limits?"
    ];
  } else if (queryLower.includes('welfare') || queryLower.includes('facility') || queryLower.includes('water')) {
    return [
      "What welfare facilities should be provided?",
      "What are the drinking water requirements?",
      "What canteen facilities are required?",
      "What first aid facilities should be available?",
      "What sanitation facilities are required?"
    ];
  }
  
  // Default suggestions
  return [
    "What are the safety requirements in mines?",
    "What are the working hours for mine workers?",
    "What should be done in case of an accident?",
    "What are the ventilation requirements?",
    "What welfare facilities should be provided?",
    "What are the rules about explosives?"
  ];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/query', (req, res) => {
  const { query } = req.body;
  
  if (!query || !query.trim()) {
    return res.status(400).json({ 
      answer: "Please provide a question about mining regulations. I can help you with topics like safety requirements, worker welfare, accident procedures, ventilation, working hours, and other mining laws."
    });
  }

  try {
    const result = search(query);
    
    if (result.success) {
      // Format multiple results into a comprehensive response
      if (result.results.length === 1) {
        const singleResult = result.results[0];
        res.json({
          act: singleResult.act,
          section: singleResult.section,
          answer: singleResult.answer,
          title: singleResult.title,
          relevance: singleResult.relevance,
          // Add helpful context for specific regulations
          context: getContextualHelp(singleResult.title, singleResult.act, singleResult.section)
        });
      } else {
        // Multiple results - combine them into a comprehensive answer
        let combinedAnswer = `Based on your question about "${query}", I found ${result.results.length} relevant regulations:\n\n`;
        
        result.results.forEach((item, index) => {
          combinedAnswer += `${index + 1}. **${item.title}** (${item.act} - ${item.section})\n`;
          combinedAnswer += `   ${item.answer}\n\n`;
        });
        
        combinedAnswer += `These regulations are ${Math.round(result.results.reduce((sum, item) => sum + item.relevance, 0) / result.results.length)}% relevant to your query on average.`;
        
        res.json({
          answer: combinedAnswer,
          multipleResults: true,
          results: result.results,
          totalFound: result.totalFound
        });
      }
    } else {
      // No results found - provide helpful fallback
      res.json({
        answer: result.error,
        suggestions: getSmartSuggestions(query)
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      answer: "I encountered an error while processing your question. Please try again with a different phrasing or contact support if the problem persists."
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


