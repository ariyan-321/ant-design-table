import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Table, Dropdown, Menu, Button } from 'antd';
import type { CheckboxOptionType, TableColumnsType } from 'antd';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';

interface Product {
  id: number;
  title: string;
  price: number;
}

const columns: TableColumnsType<Product> = [
  { title: 'Product ID', dataIndex: 'id', key: 'id' },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Price', dataIndex: 'price', key: 'price' },
];

const defaultCheckedList = columns
  .filter(item => item.key)  
  .map(item => item.key as string);  

const TableComp: React.FC = () => {
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);
  const [dataSource, setDataSource] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<Product[]>('https://api.escuelajs.co/api/v1/products')
      .then((response) => {
        setDataSource(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  const newColumns = columns
    .filter((item) => item.key)  
    .map((item) => ({
      ...item,
      hidden: !checkedList.includes(item.key as string), 
    }));

  const columnMenu = (
    <Menu>
      <Menu.Item key="checkbox-group">
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column' }}
          value={checkedList}
          options={options as CheckboxOptionType[]}
          onChange={(value) => {
            setCheckedList(value as string[]);
          }}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Divider>Columns displayed</Divider>
      <div className="flex justify-end items-end m-5">
        <Dropdown overlay={columnMenu} trigger={['click']}>
          <Button icon={<DownOutlined />}>Select Columns</Button>
        </Dropdown>
      </div>
      <Table<Product>
        columns={newColumns.filter((col) => !col.hidden)} // Only show visible columns
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        style={{ marginTop: 24 }}
      />
    </>
  );
};

export default TableComp;
