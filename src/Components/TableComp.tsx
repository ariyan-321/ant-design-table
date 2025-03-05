import { Select, Table } from "antd";
import axios from "axios";
import { Provider, useEffect, useState } from "react";


interface Product{
    id:number,
    title:string,
    price:number
}

interface ColumnType{
    title:string,
    dataIndex:keyof Product;
}


export default function TableComp() {
  const [columns, setColumns] = useState<ColumnType[]>([
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
  const [dataSource, setDataSource] = useState<Product[]>([]);


  const[visible,setVisible]=useState<string[]>(
    columns.map(col=> col.dataIndex)
  )


  const handleToggle=(columnKey:string)=>{
    setVisible(prev=>prev.includes(columnKey)? prev.filter(col=> col!==columnKey):[...prev,columnKey])
  }

  const filteredCol=columns.filter(col=> visible.includes(col.dataIndex))



  useEffect(() => {
    axios
      .get<Product[]>("https://api.escuelajs.co/api/v1/products")
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
