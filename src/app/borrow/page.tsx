"use client";

import React from 'react';
import { Table, Button } from 'antd';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ColumnsType } from 'antd/es/table';
// import '../css/Borrow.css';

interface DataType {
  key: number;
  id: number;
  collection: string;
  availablePool: string;
  bestOffer: string;
  interest: string;
  duration: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Collection',
    dataIndex: 'collection',
    key: 'collection',
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: 'Available Pool',
    dataIndex: 'availablePool',
    key: 'availablePool',
  },
  {
    title: 'Best Offer',
    dataIndex: 'bestOffer',
    key: 'bestOffer',
  },
  {
    title: 'Interest',
    dataIndex: 'interest',
    key: 'interest',
    render: (text: string) => <span style={{ color: 'green', fontWeight: 'bold' }}>{text}</span>,
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Link href={`/borrow/${record.id}`}>
        <Button type="primary">Borrow</Button>
      </Link>
    ),
  },
];

const data: DataType[] = Array.from({ length: 10 }, (_, index) => ({
  key: index,
  id: index,
  collection: `sharx - ${index % 2 === 0 ? '3d' : '16d'}`,
  availablePool: index % 2 === 0 ? '16.88' : '37.84',
  bestOffer: index % 2 === 0 ? '0.85' : '0.74',
  interest: index % 2 === 0 ? '0.0097 (1.14%)' : '0.037 (5.09%)',
  duration: index % 2 === 0 ? '3d' : '16d',
}));

const Borrow: React.FC = () => {
  return (
    <div className='borrow-main' style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      <Navbar />
      <div className="borrow-table" style={{ paddingTop: '140px', width: '90%', margin: '0 auto', justifyContent: 'center' }}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
};

export default Borrow;
