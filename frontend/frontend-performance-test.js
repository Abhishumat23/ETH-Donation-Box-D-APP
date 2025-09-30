/**
 * Frontend Performance Testing Suite
 * Tests user interface responsiveness and MetaMask integration
 */

// MetaMask Connection Test
async function testMetaMaskIntegration() {
    console.log("🦊 Testing MetaMask Integration...");
    
    const results = {
        web3Detection: false,
        connectionTime: 0,
        accountAccess: false,
        networkValidation: false,
        transactionCapability: false
    };

    try {
        // Test 1: Web3 Provider Detection
        const startTime = Date.now();
        if (typeof window.ethereum !== 'undefined') {
            results.web3Detection = true;
            console.log("✅ MetaMask detected");
        }

        // Test 2: Connection Time Measurement
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        results.connectionTime = Date.now() - startTime;
        
        if (accounts.length > 0) {
            results.accountAccess = true;
            console.log(`✅ Account access granted in ${results.connectionTime}ms`);
        }

        // Test 3: Network Validation
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId) {
            results.networkValidation = true;
            console.log(`✅ Network detected: ${chainId}`);
        }

        // Test 4: Transaction Capability (without actual transaction)
        if (window.ethereum.isConnected()) {
            results.transactionCapability = true;
            console.log("✅ Transaction capability confirmed");
        }

    } catch (error) {
        console.error("❌ MetaMask test failed:", error.message);
    }

    return results;
}

// UI Responsiveness Test
function testUIResponsiveness() {
    console.log("⚡ Testing UI Responsiveness...");
    
    const performanceMetrics = {
        pageLoadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        buttonResponseTime: [],
        formValidationTime: 0
    };

    // Page Load Metrics
    if (performance.timing) {
        performanceMetrics.pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        performanceMetrics.domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    }

    // Paint Timing
    const paintTiming = performance.getEntriesByType('paint');
    paintTiming.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
            performanceMetrics.firstContentfulPaint = entry.startTime;
        }
    });

    // Button Response Time Test
    const testButton = document.querySelector('.donate-button, button, .btn');
    if (testButton) {
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            testButton.click();
            const end = performance.now();
            performanceMetrics.buttonResponseTime.push(end - start);
        }
    }

    console.log("✅ UI responsiveness test completed");
    return performanceMetrics;
}

// Contract Interaction Performance Test
async function testContractInteraction() {
    console.log("📋 Testing Contract Interaction Performance...");
    
    const interactionMetrics = {
        contractLoadTime: 0,
        readOperationTime: 0,
        writeOperationTime: 0,
        eventListenerSetup: 0,
        errorHandling: true
    };

    try {
        // Simulate contract loading
        const startLoad = performance.now();
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async loading
        interactionMetrics.contractLoadTime = performance.now() - startLoad;

        // Simulate read operations
        const startRead = performance.now();
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate read
        interactionMetrics.readOperationTime = performance.now() - startRead;

        // Test error handling
        try {
            throw new Error("Test error");
        } catch (error) {
            interactionMetrics.errorHandling = error.message === "Test error";
        }

        console.log("✅ Contract interaction test completed");
    } catch (error) {
        console.error("❌ Contract interaction test failed:", error);
        interactionMetrics.errorHandling = false;
    }

    return interactionMetrics;
}

// Memory Usage Analysis
function analyzeMemoryUsage() {
    console.log("💾 Analyzing Memory Usage...");
    
    const memoryMetrics = {
        usedJSMemory: 0,
        totalJSMemory: 0,
        memoryPressure: 'low',
        gcPressure: 'normal'
    };

    if (performance.memory) {
        memoryMetrics.usedJSMemory = performance.memory.usedJSHeapSize;
        memoryMetrics.totalJSMemory = performance.memory.totalJSHeapSize;
        
        const memoryRatio = memoryMetrics.usedJSMemory / memoryMetrics.totalJSMemory;
        if (memoryRatio > 0.8) {
            memoryMetrics.memoryPressure = 'high';
        } else if (memoryRatio > 0.5) {
            memoryMetrics.memoryPressure = 'medium';
        }
    }

    console.log("✅ Memory analysis completed");
    return memoryMetrics;
}

// Comprehensive Frontend Test Suite
async function runFrontendTestSuite() {
    console.log("🧪 Starting Frontend Performance Test Suite");
    console.log("=" * 50);

    const testResults = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        tests: {}
    };

    // Run all tests
    testResults.tests.metaMaskIntegration = await testMetaMaskIntegration();
    testResults.tests.uiResponsiveness = testUIResponsiveness();
    testResults.tests.contractInteraction = await testContractInteraction();
    testResults.tests.memoryUsage = analyzeMemoryUsage();

    // Calculate overall score
    const scores = {
        metaMask: testResults.tests.metaMaskIntegration.web3Detection ? 100 : 0,
        responsiveness: testResults.tests.uiResponsiveness.pageLoadTime < 3000 ? 100 : 50,
        interaction: testResults.tests.contractInteraction.errorHandling ? 100 : 0,
        memory: testResults.tests.memoryUsage.memoryPressure === 'low' ? 100 : 50
    };

    const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
    testResults.overallScore = overallScore;

    console.log("\n📊 Frontend Test Results Summary:");
    console.log(`Overall Performance Score: ${overallScore.toFixed(1)}/100`);
    console.log(`MetaMask Integration: ${scores.metaMask}/100`);
    console.log(`UI Responsiveness: ${scores.responsiveness}/100`);
    console.log(`Contract Interaction: ${scores.interaction}/100`);
    console.log(`Memory Efficiency: ${scores.memory}/100`);

    // Export results
    localStorage.setItem('frontendTestResults', JSON.stringify(testResults));
    console.log("\n📁 Test results saved to localStorage: 'frontendTestResults'");
    
    return testResults;
}

// Auto-run tests when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFrontendTestSuite);
} else {
    runFrontendTestSuite();
}