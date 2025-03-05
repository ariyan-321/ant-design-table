import { Table, Checkbox, Dropdown, Menu, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";

interface Product {
  id: number;
  title: string;
  price: number;
}

interface ColumnType {
  title: string;
  dataIndex: keyof Product;
}

export default function TableComp() {
  // Define columns as a constant since they don't need to be dynamically updated
  const columns: ColumnType[] = [
    { title: "Id", dataIndex: "id" },
    { title: "Title", dataIndex: "title" },
    { title: "Price", dataIndex: "price" },
  ];

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // For storing data
  const [dataSource, setDataSource] = useState<Product[]>([]);

  // Storing visible columns in localStorage
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("visibleColumns") || "[]").length > 0
      ? JSON.parse(localStorage.getItem("visibleColumns") || "[]")
      : columns.map((col) => col.dataIndex)
  );
  

  // Data fetching
  useEffect(() => {
    setLoading(true);
    axios
      .get<Product[]>("https://api.escuelajs.co/api/v1/products")
      .then((res) => setDataSource(res.data))
      .finally(() => setLoading(false)); // Ensure loading is false once data is fetched
  }, []);

  // Toggle visibility of columns
  const handleToggle = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const newVisibleColumns = prev.includes(columnKey)
        ? prev.filter((col) => col !== columnKey)
        : [...prev, columnKey];
      localStorage.setItem("visibleColumns", JSON.stringify(newVisibleColumns));
      return newVisibleColumns;
    });
  };

  // Filter columns based on visibility
  const filteredColumns = columns.filter((col) =>
    visibleColumns.includes(col.dataIndex)
  );

  // Column menu for toggling visibility
  const columnMenu = (
    <Menu>
      {columns.map((col) => (
        <Menu.Item key={col.dataIndex}>
          <Checkbox
            checked={visibleColumns.includes(col.dataIndex)}
            onChange={() => handleToggle(col.dataIndex)}
          >
            {col.title}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="w-[80%] mx-auto my-14 overflow-x-auto">
      <h1 className="font-semibold text-center text-2xl my-12">
        Ant Design Table
      </h1>
      <div className="border-4 rounded-xl p-12 shadow-xl">
        <div className="flex justify-end p-5">
          {/* Dropdown for toggling columns */}
          <Dropdown overlay={columnMenu} trigger={["click"]}>
            <Button>
              Columns <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        {/* Table */}
        <Table
          columns={filteredColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="id"
          
        />
      </div>
    </div>
  );
}
