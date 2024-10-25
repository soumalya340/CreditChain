'use client';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [borrowAmount, setBorrowAmount] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setLoading(false);
      // Generate a 5-digit random number
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setRandomNumber(randomNum);
      // Retrieve borrowAmount from local storage
      const amount = localStorage.getItem('borrowAmount');
      setBorrowAmount(amount);
    }, 3000);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#003241',
        height: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Display the image at the center top */}
     
      {loading ? (
        // Show loading text while loading is true
        <div style={{ textAlign: 'center' }}>
            
            <center>
            <img
        src="https://global.discourse-cdn.com/sitepoint/original/3X/e/3/e352b26bbfa8b233050087d6cb32667da3ff809c.gif"
        alt="Top Image"
        style={{ top: '200px', width: '100px',height:'100' }}
      />
            </center>
          <div className="loader"></div>
          <p style={{ marginTop: '20px',fontSize:'30px' }}>Calculating your Credibility score...</p>
        </div>
      ) : (
        // Show success content when loading is false
        <div style={{ textAlign: 'center' }}>
          <center><img
            src="https://cdn.dribbble.com/users/4358240/screenshots/14825308/media/84f51703b2bfc69f7e8bb066897e26e0.gif"
            alt="Success"
            style={{ width: '400px', borderRadius: '10px' }}
          /></center>
          <h1 style={{ marginTop: '20px', fontSize:'30px' }}>Your Loan Approved</h1>
          <h1 style={{fontSize:'35px'}}>Your Reference Number: {randomNumber}</h1>
          <h1 style={{fontSize:'35px'}}>Loan Amount: {borrowAmount || 'Not Available'}</h1>
        </div>
      )}
    </div>
  );
}
