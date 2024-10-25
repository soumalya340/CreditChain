'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, Input, Slider } from 'antd';
import { DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';

import { useAccount, useConnect } from 'wagmi';

// import '../css/style.css';

const images = {
  one: '/assets/1.png',
  two: '/assets/2.png',
  three: '/assets/3.png',
  four: '/assets/4.png',
  five: '/assets/5.png',
  six: '/assets/6.png',
  seven: '/assets/7.png',
  eight: '/assets/8.png',
  nine: '/assets/9.png',
  ten: '/assets/10.png',
  eleven: '/assets/11.png',
};

const { TabPane } = Tabs;

export default function Home() {
  const { address } = useAccount();

  const [borrowAmount, setBorrowAmount] = useState('');
  const [borrowMonths, setBorrowMonths] = useState(1);
  const [borrowOutput, setBorrowOutput] = useState<string | null>(null);
  const [lendingAmount, setLendingAmount] = useState('');
  const [lendingMonths, setLendingMonths] = useState(1);
  const [lendingOutput, setLendingOutput] = useState<string | null>(null);

  const formatDuration = (months: number) => {
    if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} year${years > 1 ? 's' : ''}${
        remainingMonths > 0
          ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
          : ''
      }`.trim();
    }
  };

  useEffect(() => {
    if (borrowAmount && borrowMonths) {
      const amount = parseFloat(borrowAmount);
      const interestRate = 0.48 / 12;
      const interest = amount * interestRate * borrowMonths;
      setBorrowOutput((amount + interest).toFixed(2));
    } else {
      setBorrowOutput(null);
    }
  }, [borrowAmount, borrowMonths]);

  useEffect(() => {
    if (lendingAmount && lendingMonths) {
      const amount = parseFloat(lendingAmount);
      const returnRate = 0.4 / 12;
      const returnAmount = amount * returnRate * lendingMonths;
      setLendingOutput((amount + returnAmount).toFixed(2));
    } else {
      setLendingOutput(null);
    }
  }, [lendingAmount, lendingMonths]);


  const borrow = () =>{
    console.log('borrow clicked');
    localStorage.setItem('borrowAmount', borrowAmount);
    localStorage.setItem('borrowMonths', borrowMonths.toString());
    window.location.href = '/createaccount';
  
  }

  const renderBar = (amount: number, extra: number) => {
    const total = amount + extra;
    const percentAmount = ((amount / total) * 100).toFixed(2);
    const percentExtra = ((extra / total) * 100).toFixed(2);

    return (
      <div className="w-full h-4 bg-gray-200 rounded overflow-hidden mt-2">
        <div
          className="h-full bg-blue-600"
          style={{ width: `${percentAmount}%` }}
        ></div>
        <div
          className="h-full bg-yellow-400"
          style={{ width: `${percentExtra}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        marginTop: '-300px',
        backgroundImage:
          'linear-gradient(#ecf4ff 1px, transparent 1px), linear-gradient(to right, #ecf4ff 1px, transparent 1px)',
        backgroundSize: '34px 34px',
      }}
    >
      <div className="text-center background-pattern">
        <Navbar />
        <p
          className="text-6xl font-extrabold text-blue-600"
          style={{ marginTop: '200px', paddingTop: '200px' }}
        >
          CREDIT CHAIN
        </p>
        <p className="text-2xl font-medium text-black mt-4">
          Collateral free Borrowing and Lending Platform
        </p>
      </div>

      <div className="flex justify-center mt-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg w-full max-w-md">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Borrow" key="1">
              <Input
                placeholder="Enter Amount"
                prefix={<DollarOutlined />}
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="mb-5"
              />
              <div className="flex items-center mb-2">
                <CalendarOutlined className="mr-2" />
                <span>Select Number of Months:</span>
              </div>
              <Slider
                min={1}
                max={6}
                value={borrowMonths}
                onChange={(value) => setBorrowMonths(value)}
              />
              <div className="mb-4">{formatDuration(borrowMonths)}</div>
              {borrowOutput && (
                <>
                  <div className="text-lg mb-2">
                    Final Amount:{' '}
                    <span className="text-2xl text-blue-600 font-bold">
                      ₹{borrowOutput}
                    </span>
                  </div>
                  {renderBar(
                    parseFloat(borrowAmount),
                    parseFloat(borrowOutput) - parseFloat(borrowAmount)
                  )}

                  {address && (
                    <button onClick={borrow} className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-full">
                      Borrow Now
                    </button>
                  )}
                </>
              )}
              <div className="mt-5 flex items-center">
                <div className="h-3 w-3 bg-blue-600 rounded-full mr-2"></div>
                <p className="font-bold">Total Amount Borrowing</p>
              </div>
              <div className="mt-2 flex items-center">
                <div className="h-3 w-3 bg-yellow-400 rounded-full mr-2"></div>
                <p className="font-bold">Total Interest - 48%</p>
              </div>
            </TabPane>

            <TabPane tab="Lending" key="2">
              <Input
                placeholder="Enter Amount for Lending"
                prefix={<DollarOutlined />}
                value={lendingAmount}
                onChange={(e) => setLendingAmount(e.target.value)}
                className="mb-5"
              />
              <div className="flex items-center mb-2">
                <CalendarOutlined className="mr-2" />
                <span>Select Number of Months:</span>
              </div>
              <Slider
                min={1}
                max={6}
                value={lendingMonths}
                onChange={(value) => setLendingMonths(value)}
              />
              <div className="mb-4">{formatDuration(lendingMonths)}</div>
              {lendingOutput && (
                <>
                  <div className="text-lg mb-2">
                    Final Amount:{' '}
                    <span className="text-2xl text-blue-600 font-bold">
                      ₹{lendingOutput}
                    </span>
                  </div>
                  {renderBar(
                    parseFloat(lendingAmount),
                    parseFloat(lendingOutput) - parseFloat(lendingAmount)
                  )}

                  {address && (
                    <button className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-full">
                      Lend Now
                    </button>
                  )}
                </>
              )}
              <div className="mt-5 flex items-center">
                <div className="h-3 w-3 bg-blue-600 rounded-full mr-2"></div>
                <p className="font-bold">Total Amount Lending</p>
              </div>
              <div className="mt-2 flex items-center">
                <div className="h-3 w-3 bg-yellow-400 rounded-full mr-2"></div>
                <p className="font-bold">Total Return - 40%</p>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <div className="flex justify-around w-full max-w-4xl space-x-4">
          <div className="feature flex flex-col items-center justify-center h-52 w-64 bg-white shadow-lg rounded-2xl p-5">
            <Image
              src={images.nine}
              alt="Collateral Free"
              height={100}
              width={100}
            />
            <p className="mt-5 text-xl font-bold text-center">
              Collateral free Borrowing
            </p>
          </div>

          <div className="feature flex flex-col items-center justify-center h-52 w-64 bg-white shadow-lg rounded-2xl p-5">
            <Image
              src={images.four}
              alt="Trusted Lending"
              height={100}
              width={100}
            />
            <p className="mt-5 text-xl font-bold text-center">
              Trusted Lending
            </p>
          </div>

          <div className="feature flex flex-col items-center justify-center h-52 w-64 bg-white shadow-lg rounded-2xl p-5">
            <Image
              src={images.eleven}
              alt="p2p Transactions"
              height={100}
              width={100}
            />
            <p className="mt-5 text-xl font-bold text-center">
              p2p Based Transaction
            </p>
          </div>

          <div className="feature flex flex-col items-center justify-center h-52 w-64 bg-white shadow-lg rounded-2xl p-5">
            <Image
              src={images.six}
              alt="Secure Process"
              height={100}
              width={100}
            />
            <p className="mt-5 text-xl font-bold text-center">
              End to End Secure Process
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


