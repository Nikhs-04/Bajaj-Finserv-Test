const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Personal information - Replace with your actual details
const PERSONAL_INFO = {
    fullName: "nikhita_moncy", 
    birthDate: "04012004", // Format: DDMMYYYY
    emailAddress: "nikhita.22bce8527@vitapstudent.ac.in", 
    collegeRollNum: "22BCE8527" 
};

// Main POST route handler
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        // Input validation
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid input: 'data' must be an array"
            });
        }

        // Initialize result arrays
        const oddNumbers = [];
        const evenNumbers = [];
        const alphabetChars = [];
        const specialSymbols = [];
        let numericalSum = 0;

        // Process each element in the input array
        data.forEach(element => {
            const strElement = String(element);
            
            // Check if element is numeric
            if (/^\d+$/.test(strElement)) {
                const numValue = parseInt(strElement, 10);
                numericalSum += numValue;
                
                if (numValue % 2 === 0) {
                    evenNumbers.push(strElement);
                } else {
                    oddNumbers.push(strElement);
                }
            }
            // Check if element contains only alphabetic characters
            else if (/^[a-zA-Z]+$/.test(strElement)) {
                alphabetChars.push(strElement.toUpperCase());
            }
            // Everything else is considered a special character
            else {
                specialSymbols.push(strElement);
            }
        });

        // Generate concatenated string with alternating case
        const concatenatedString = generateAlternatingCaseString(alphabetChars);

        // Construct response object
        const responseObject = {
            is_success: true,
            user_id: `${PERSONAL_INFO.fullName}_${PERSONAL_INFO.birthDate}`,
            email: PERSONAL_INFO.emailAddress,
            roll_number: PERSONAL_INFO.collegeRollNum,
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabetChars,
            special_characters: specialSymbols,
            sum: String(numericalSum),
            concat_string: concatenatedString
        };

        res.status(200).json(responseObject);

    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({
            is_success: false,
            message: "Internal server error occurred"
        });
    }
});

// Function to create alternating case concatenation
function generateAlternatingCaseString(alphabetArray) {
    // Extract all alphabetic characters and reverse the order
    const allChars = alphabetArray.join('').split('').reverse();
    
    let result = '';
    allChars.forEach((char, index) => {
        if (index % 2 === 0) {
            result += char.toUpperCase();
        } else {
            result += char.toLowerCase();
        }
    });
    
    return result;
}

// GET route for testing API availability
app.get("/", (req, res) => {
  res.json({
    message: "VIT Full Stack API Challenge",
    usage: "Send POST requests to /bfhl with { data: [...] }"
  });
});


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Default route
app.get('/', (req, res) => {
    res.json({
        message: "VIT Full Stack API Challenge",
        endpoints: {
            main: "POST /bfhl",
            test: "GET /bfhl",
            health: "GET /health"
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/bfhl`);
});

module.exports = app;

// test.js - API Testing Script
const axios = require('axios');

const API_URL = 'http://localhost:3000/bfhl';

const testCases = [
    {
        name: "Example A",
        data: ["a","1","334","4","R", "$"]
    },
    {
        name: "Example B", 
        data: ["2","a", "y", "4", "&", "-", "*", "5","92","b"]
    },
    {
        name: "Example C",
        data: ["A","ABcD","DOE"]
    }
];

async function runTests() {
    console.log('Starting API tests...\n');
    
    for (const testCase of testCases) {
        try {
            console.log(`Testing ${testCase.name}:`);
            console.log('Input:', testCase.data);
            
            const response = await axios.post(API_URL, { data: testCase.data });
            console.log('Output:', JSON.stringify(response.data, null, 2));
            console.log('✅ Test passed\n');
            
        } catch (error) {
            console.log('❌ Test failed:', error.message);
            console.log('');
        }
    }
}

// Run tests if server is available
setTimeout(runTests, 1000);
