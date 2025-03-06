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

const defaultCheckedList = columns.map((item) => item.key);

const TableComp: React.FC = () => {
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);
  const [dataSource, setDataSource] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from the API
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

  // Filter columns based on checkedList
  const newColumns = columns.map((item) => ({
    ...item,
    // Show or hide columns based on the checkedList
    hidden: !checkedList.includes(item.key),
  }));

  const columnMenu = (
    <Menu style={{display:"flex"}} >
      <Menu.Item key="checkbox-group" >
        <Checkbox.Group
        style={{display:"flex",flexDirection:"column"}}
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
      <Dropdown overlay={columnMenu} trigger={['click']}>
        <Button icon={<DownOutlined />}>Select Columns</Button>
      </Dropdown>
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
