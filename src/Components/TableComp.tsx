import { Select, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TableComp() {
  const [columns, setColumns] = useState([
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
  ]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.escuelajs.co/api/v1/products")
      .then((res) => setDataSource(res.data));
  }, []);

  return (
    <div className="w-[80%] mx-auto my-14 overflow-x-auto">
      <h1 className="font-semibold text-center text-2xl my-12">
        Ant Design Table
      </h1>
      <div className="border-4 rounded-xl p-12 shadow-xl">
        <div className="flex justify-end p-5">
            <Select placeholder="Columns" style={{width:100,textAlign:"center",}} >
            {columns.map((column, i) => (
              <Select.Option key={i} value={column.title} >
                {column.title}
              </Select.Option>
            ))}            </Select>
        </div>
        <Table columns={columns} dataSource={dataSource}></Table>
      </div>
    </div>
  );
}
