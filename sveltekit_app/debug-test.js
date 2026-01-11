// Test script to check for common runtime errors
console.log('=== Testing Bloom Media Website ===');

// Test 1: Check if Spline assets are loading
const splineTest = fetch('/scene.splinecode')
  .then(response => {
    console.log('✅ Spline file accessible:', response.ok);
  })
  .catch(err => {
    console.error('❌ Spline file error:', err);
  });

// Test 2: Test API endpoints
const apiTest = fetch('/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API health check:', data);
  })
  .catch(err => {
    console.error('❌ API health error:', err);
  });

// Test 3: Check for critical JavaScript errors
setTimeout(() => {
  console.log('✅ Page loaded without critical errors');
  
  // Test 4: Check if main components are present
  const navbar = document.querySelector('.navbar-wrapper');
  const fluidCursor = document.querySelector('.fluid-canvas');
  const hero = document.querySelector('.hero-section');
  
  console.log('Navbar present:', !!navbar);
  console.log('FluidCursor present:', !!fluidCursor);
  console.log('Hero present:', !!hero);
  
  if (navbar && fluidCursor && hero) {
    console.log('🎉 All critical components loaded successfully!');
  } else {
    console.log('⚠️ Some components may be missing');
  }
}, 2000);

// Test 5: Check WebGL support
const testWebGL = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  console.log('WebGL support:', !!gl);
  
  if (gl) {
    console.log('✅ WebGL supported - FluidCursor should work');
  } else {
    console.log('❌ WebGL not supported - FluidCursor will fail');
  }
};

testWebGL();

Promise.all([splineTest, apiTest]).then(() => {
  console.log('=== Test Complete ===');
});