const axios = require('axios');

// Change this to your deployed API URL
const BASE_URL = 'https://your-api-url.vercel.app'; // Update this!
const ENDPOINT = `${BASE_URL}/bfhl`;

// Test data sets
const testScenarios = [
    {
        testName: "Standard Mixed Input",
        inputData: ["a","1","334","4","R", "$"],
        expectedOddCount: 1,
        expectedEvenCount: 2
    },
    {
        testName: "Complex Mixed Data",
        inputData: ["2","a", "y", "4", "&", "-", "*", "5","92","b"],
        expectedOddCount: 1,
        expectedEvenCount: 3
    },
    {
        testName: "Only Alphabets",
        inputData: ["A","ABcD","DOE"],
        expectedOddCount: 0,
        expectedEvenCount: 0
    },
    {
        testName: "Numbers and Symbols",
        inputData: ["123", "456", "@", "#", "%"],
        expectedOddCount: 1,
        expectedEvenCount: 1
    },
    {
        testName: "Empty Array",
        inputData: [],
        expectedOddCount: 0,
        expectedEvenCount: 0
    }
];

// Function to validate response structure
function validateResponse(responseData, testName) {
    const requiredFields = [
        'is_success', 'user_id', 'email', 'roll_number',
        'odd_numbers', 'even_numbers', 'alphabets', 
        'special_characters', 'sum', 'concat_string'
    ];

    const missingFields = requiredFields.filter(field => !(field in responseData));
    
    if (missingFields.length > 0) {
        console.log(`❌ ${testName}: Missing fields: ${missingFields.join(', ')}`);
        return false;
    }

    if (responseData.is_success !== true) {
        console.log(`❌ ${testName}: is_success should be true`);
        return false;
    }

    return true;
}

// Main testing function
async function executeAPITests() {
    console.log('🚀 Starting API Testing Suite\n');
    console.log(`Testing endpoint: ${ENDPOINT}\n`);

    let passedTests = 0;
    const totalTests = testScenarios.length;

    for (const scenario of testScenarios) {
        try {
            console.log(`📋 Running: ${scenario.testName}`);
            console.log(`Input: [${scenario.inputData.join(', ')}]`);

            const startTime = Date.now();
            const apiResponse = await axios.post(ENDPOINT, { 
                data: scenario.inputData 
            });
            const responseTime = Date.now() - startTime;

            if (apiResponse.status === 200) {
                const responseBody = apiResponse.data;
                
                if (validateResponse(responseBody, scenario.testName)) {
                    console.log('✅ Response structure valid');
                    console.log(`📊 Odd numbers: ${responseBody.odd_numbers.length}, Even numbers: ${responseBody.even_numbers.length}`);
                    console.log(`🔤 Alphabets: ${responseBody.alphabets.length}, Special chars: ${responseBody.special_characters.length}`);
                    console.log(`🔢 Sum: ${responseBody.sum}, Concat: "${responseBody.concat_string}"`);
                    console.log(`⚡ Response time: ${responseTime}ms`);
                    passedTests++;
                } else {
                    console.log('❌ Response validation failed');
                }
            } else {
                console.log(`❌ Unexpected status code: ${apiResponse.status}`);
            }

        } catch (error) {
            if (error.response) {
                console.log(`❌ API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else {
                console.log(`❌ Network Error: ${error.message}`);
            }
        }

        console.log('─'.repeat(60));
    }

    console.log(`\n📈 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests successful! API is ready for submission.');
    } else {
        console.log('⚠️  Some tests failed. Please check the implementation.');
    }
}

// Execute tests
executeAPITests().catch(error => {
    console.error('Test suite failed:', error);
});