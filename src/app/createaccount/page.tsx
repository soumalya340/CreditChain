'use client';

import { useEffect, useState } from 'react';
import { Steps, Form, Input, Button, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import Checkbox from 'antd/es/checkbox/Checkbox';

const { Step } = Steps;
const { Option } = Select;

export default function CreateAccount() {
  // State variables for the current step and verification clients
  const [current, setCurrent] = useState(0);
  const [aadharClient, setAadharClient] = useState<ReclaimProofRequest | null>(
    null
  );
  const [linkedInClient, setLinkedInClient] =
    useState<ReclaimProofRequest | null>(null);
  const [instagramClient, setInstagramClient] =
    useState<ReclaimProofRequest | null>(null);
  const [xUsernameClient, setXUsernameClient] =
    useState<ReclaimProofRequest | null>(null);

  // State variables for storing proofs
  const [aadharProof, setAadharProof] = useState<any>(null);
  const [linkedInProof, setLinkedInProof] = useState<any>(null);
  const [instagramProof, setInstagramProof] = useState<any>(null);
  const [xUsernameProof, setXUsernameProof] = useState<any>(null);

  useEffect(() => {
    const loanamount = localStorage.getItem('loanAmount')
  });

  const doneclick = () => {
    window.location.href = '/success';
  }

  // Verification handler functions
  const handleAadharVerification = async () => {
    const aadharUrl = await aadharClient?.getRequestUrl();
    if (aadharUrl) {
      try {
        window.open(aadharUrl, '_blank');
      } catch {
        console.error('Failed to open Aadhar verification URL');
      }
    }
    if (aadharClient) {
      await aadharClient.startSession({
        onSuccess: async (proof) => {
          console.log('Aadhar verification successful', proof);
          setAadharProof(proof);
          console.log('Aadhar proof saved: ', proof);
        },
        onError: (error) => {
          console.log('Aadhar verification failed', error);
        },
      });
    }
  };

  const handleLinkedInVerification = async () => {
    const linkedInUrl = await linkedInClient?.getRequestUrl();
    if (linkedInUrl) {
      try {
        window.open(linkedInUrl, '_blank');
      } catch {
        console.error('Failed to open LinkedIn verification URL');
      }
    }
    if (linkedInClient) {
      await linkedInClient.startSession({
        onSuccess: (proof) => {
          console.log('LinkedIn verification successful', proof);
          setLinkedInProof(proof);
        },
        onError: (error) => {
          console.log('LinkedIn verification failed', error);
        },
      });
    }
  };

  const handleInstagramVerification = async () => {
    const instagramUrl = await instagramClient?.getRequestUrl();
    if (instagramUrl) {
      try {
        window.open(instagramUrl, '_blank');
      } catch {
        console.error('Failed to open Instagram verification URL');
      }
    }
    if (instagramClient) {
      await instagramClient.startSession({
        onSuccess: (proof) => {
          console.log('Instagram verification successful', proof);
          setInstagramProof(proof);
        },
        onError: (error) => {
          console.log('Instagram verification failed', error);
        },
      });
    }
  };

  const handleXUsernameVerification = async () => {
    const xUsernameUrl = await xUsernameClient?.getRequestUrl();
    if (xUsernameUrl) {
      try {
        window.open(xUsernameUrl, '_blank');
      } catch {
        console.error('Failed to open X username verification URL');
      }
    }
    if (xUsernameClient) {
      await xUsernameClient.startSession({
        onSuccess: (proof) => {
          console.log('X username verification successful', proof);
          setXUsernameProof(proof);
        },
        onError: (error) => {
          console.log('X username verification failed', error);
        },
      });
    }
  };

  // Steps for the multi-step form
  const steps = [
    {
      title: 'Human Verification',
      content: (
        <Form layout="vertical">
          <Form.Item label="Full Name">
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item label="Nationality">
            <Select placeholder="Select your nationality">
              <Option value="indian">Indian</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Upload ID Proof">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'KYC Verification',
      content: (
        <Form layout="vertical">
          <Form.Item label="Aadhaar Card Number">
            <Input placeholder="Enter your Aadhaar number" />
          </Form.Item>
          <Form.Item label="PAN Card Number">
            <Input placeholder="Enter your PAN number" />
          </Form.Item>
          <Form.Item label="Address Proof">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Social Verification',
      content: (
        <Form layout="vertical">
          <Form.Item label="LinkedIn Profile URL">
            <Input placeholder="Enter your LinkedIn URL" />
          </Form.Item>
          <Form.Item label="Twitter Profile URL">
            <Input placeholder="Enter your Twitter URL" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Bank Verification',
      content: (
        <Form layout="vertical">
          <Form.Item label="Bank Account Number">
            <Input placeholder="Enter your bank account number" />
          </Form.Item>
          <Form.Item label="IFSC Code">
            <Input placeholder="Enter your bank IFSC code" />
          </Form.Item>
          <Form.Item label="Upload Bank Statement">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Reclaim Verification',
      content: (
        <Form layout="vertical">
          <Form.Item label="Aadhar Verification">
            <Button type="primary" onClick={handleAadharVerification}>
              Proceed to Aadhar Verification
            </Button>
          </Form.Item>
          <Form.Item label="LinkedIn usage verification">
            <Button type="primary" onClick={handleLinkedInVerification}>
              Proceed to LinkedIn Verification
            </Button>
          </Form.Item>
          <Form.Item label="X username verification">
            <Button type="primary" onClick={handleXUsernameVerification}>
              Proceed to X Username Verification
            </Button>
          </Form.Item>
          <Form.Item label="Instagram verification">
            <Button type="primary" onClick={handleInstagramVerification}>
              Proceed to Instagram Verification
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Confirm',
      content: (
        <Form layout="vertical">
  <Form.Item label="Loan Amount">
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Checkbox>
        By checking this, you are confirming that you are agreeing to our{' '}
        <span style={{ color: 'blue', textDecoration: 'underline' }}>
          terms and conditions
        </span>
      </Checkbox>
    </div>
  </Form.Item>
</Form>
      ),
    },
  ];

  // Background images for each step
  const backgroundImages = [
    '/assets/KYC.png',
    '/assets/CITIZEN.png',
    '/assets/SOCIAL.png',
    '/assets/BANK.png',
    '/assets/PAYBACK.png',
  ];

  // Fetch verification request URLs and initialize clients
  useEffect(() => {
    getVerificationRequest();
  }, []);

  const getVerificationRequest = async () => {
    const APP_ID = '0x821d5bf69e5Fc096A790b4801365aA98151480Ce';
    const APP_SECRET =
      '0x6d3a37a201583ef41b654dcbf47a9c4f92005fb93e5ccd0a8a1ad0711016c078';
    const AADHAR_PROVIDER = '5e1302ca-a3dd-4ef8-bc25-24fcc97dc800';
    const LINKEDIN_PROVIDER = '9ae104a3-7e44-4973-a462-31a33c11ffc7';
    const X_USERNAME_PROVIDER = '475b5501-427b-47c8-b007-fb7837cd8b5c';
    const INSTAGRAM_PROVIDER = '3ad6946f-88f4-4958-9a8e-5271a831b5b8';

    // Initialize clients
    const aadharReclaimClient = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      AADHAR_PROVIDER
    );
    const linkedinReclaimClient = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      LINKEDIN_PROVIDER
    );
    const xUsernameReclaimClient = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      X_USERNAME_PROVIDER
    );
    const instagramReclaimClient = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      INSTAGRAM_PROVIDER
    );

    // Set clients in state
    setAadharClient(aadharReclaimClient);
    setLinkedInClient(linkedinReclaimClient);
    setXUsernameClient(xUsernameReclaimClient);
    setInstagramClient(instagramReclaimClient);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImages[current]})` }}
    >
      <Navbar />
      <div className="flex flex-col items-center w-full max-w-2xl p-6 bg-white bg-opacity-70 rounded-lg shadow-lg">
        <Steps current={current} className="w-full">
          {steps.map((item, index) => (
            <Step key={index} title={item.title} />
          ))}
        </Steps>

        <div className="mt-8 w-full">{steps[current].content}</div>

        <div className="mt-6 flex justify-between w-full">
          {current > 0 && (
            <Button
              onClick={() => setCurrent(current - 1)}
              className="bg-gray-500 text-white"
            >
              Previous
            </Button>
          )}
          {current < steps.length - 1 ? (
            <Button
              onClick={() => setCurrent(current + 1)}
              className="bg-blue-500 text-white"
            >
              Next
            </Button>
          ) : (
            <Button onClick={doneclick} className="bg-green-500 text-white">Done</Button>
          )}
        </div>
      </div>
    </div>
  );
}
