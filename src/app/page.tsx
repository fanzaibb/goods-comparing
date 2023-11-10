"use client";
// import Image from "next/image";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHandHoldingMedical,
//   faPaintbrush,
// } from "@fortawesome/free-solid-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import styles from "./page.module.css";

import * as XLSX from "xlsx";
import React, { useState, ChangeEvent } from "react";
interface ExcelRow {
  ["商品編號"]: string;
  ["商品名稱"]: string;
  ["進價"]: string;
  ["售價(含稅)"]: string;
  ["市價"]: string;
  ["成本"]: string;
  ["定價"]: string;
  ["參考市價(建議售價)"]: string;
}

interface Item {
  id: string;
  name: string;
  cost: string;
  price: string;
  marketPrice: string;
  newName: string;
  newCost: string;
  newPrice: string;
  newMarketPrice: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  const handleMomoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    // 假设你的工作表名为 "Sheet1"
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 假设你要渲染的列名为 "Name" 和 "Value"
    setItems(
      jsonData.map((row: ExcelRow) => ({
        id: row["商品編號"],
        name: row["商品名稱"],
        cost: row["進價"],
        price: row["售價(含稅)"],
        marketPrice: row["市價"],
      }))
    );
  };
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    // 假设你的工作表名为 "Sheet1"
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id == jsonData[1]["商品編號"]) {
          console.log(item.id, jsonData[1]["商品編號"]);
        }
        const row = jsonData.find(
          (row: any) => String(row["商品編號"]) === item.id
        );
        if (row) {
          return {
            ...item,
            newName: String(row["商品名稱"]),
            newCost: String(row["成本"]),
            newPrice: String(row["定價"]),
            newMarketPrice: String(row["參考市價(建議售價)"]),
          };
        }
        return item;
      });

      return updatedItems;
    });
  };
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>今天要吃啥？</h1>
      {/* <FontAwesomeIcon icon={faHandHoldingMedical} className={styles.center} />
      <FontAwesomeIcon icon={faPaintbrush} rotation={180} /> */}
      <div className={styles.box}>
        <label htmlFor="item-file" className={styles.upload}>
          上傳商品清單
        </label>
        <input
          id="item-file"
          type="file"
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          onChange={handleMomoUpload}
        ></input>
        <label htmlFor="momo-file" className={styles.upload}>
          上傳MOMO商品內容
        </label>
        <input
          id="momo-file"
          type="file"
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        ></input>
      </div>
      <div>
        {items.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>編號</th>
                <th>名稱</th>
                <th>成本</th>
                <th>售價</th>
                <th>市價</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>
                    {item.name}
                    {item.newName && item.name !== item.newName && (
                      <span style={{ color: "red" }}> ({item.newName})</span>
                    )}
                  </td>
                  <td>
                    {item.cost}
                    {item.newCost && item.cost !== item.newCost && (
                      <span style={{ color: "red" }}> ({item.newCost})</span>
                    )}
                  </td>
                  <td>
                    {item.price}
                    {item.newPrice && item.price !== item.newPrice && (
                      <span style={{ color: "red" }}> ({item.newPrice})</span>
                    )}
                  </td>
                  <td>
                    {item.marketPrice}
                    {item.newMarketPrice &&
                      item.marketPrice !== item.newMarketPrice && (
                        <span style={{ color: "red" }}>
                          {" "}
                          ({item.newMarketPrice})
                        </span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
