import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import Filters from "../components/Filters";
import styles from "../styles/Home.module.css";
import { Filters as FiltersType } from "../types/Filters.type";
import { Sheet1 } from "../types/Sheet1.type";
import { TireSets } from "../types/TireSets.type";

const Home: NextPage = () => {
  const [tireData, setTireData] = useState<Sheet1[] | []>([]);
  const [tireSets, setTireSets] = useState<TireSets | undefined>(undefined);
  const [displayData, setDisplayData] = useState<Sheet1[] | []>([]);
  const [activeFilters, setActiveFilters] = useState<FiltersType>({
    Model: undefined,
    Width: undefined,
    Profile: undefined,
    Diameter: undefined,
  });

  // useEffect(() => {
  //   console.log(tireSets);
  //   console.log(tireData);
  //   console.log(displayData);
  //   console.log(activeFilters);
  // });

  useEffect(() => {
    setDisplayData([]);
  }, [activeFilters]);

  const applyFilter = (key: string, value: string) => {
    let tempActiveFilters = activeFilters;
    if (!value.length) {
      tempActiveFilters[key] = undefined;
    } else {
      let tempValue: number | string = value;
      switch (key) {
        case "Width":
        case "Diameter":
        case "Profile":
          tempValue = Number(tempValue);
          break;
      }
      tempActiveFilters[key] = tempValue;
    }

    let filtersExist = false;
    for (const filter in tempActiveFilters) {
      if (tempActiveFilters[filter]) filtersExist = true;
    }

    if (!filtersExist) return resetFilters();

    let tempDisplayData: Sheet1[] = [];
    if (filtersExist) {
      tempDisplayData = tireData.filter((item) => {
        for (const filter in tempActiveFilters) {
          if (
            tempActiveFilters[filter] &&
            tempActiveFilters[filter] !== item[filter]
          )
            return false;
        }
        return true;
      });
    }

    setDisplayData(tempDisplayData);
    setActiveFilters(tempActiveFilters);
  };

  const resetFilters = () => {
    setActiveFilters({
      Model: undefined,
      Width: undefined,
      Profile: undefined,
      Diameter: undefined,
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Tire Pricing App</title>
        <meta
          name="description"
          content="Elite Used Tires pricing application"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Tire Pricing App</h1>
        <FileUpload getTireSets={setTireSets} getTireData={setTireData} />
        <Filters
          activeFilters={activeFilters}
          tireSets={tireSets}
          applyFilter={applyFilter}
          resetFilters={resetFilters}
        />
        {displayData.length > 0 && (
          <table className={styles.displayDataContainer}>
            <thead>
              <tr className={styles.displayDataContainerHeader}>
                <th className={styles.displayDataHeaderCell}>Part #</th>
                <th className={styles.displayDataHeaderCell}>Tread Depth</th>
                <th className={styles.displayDataHeaderCell}>Condition</th>
                <th className={styles.displayDataHeaderCell}>Brand</th>
                <th className={styles.displayDataHeaderCell}>Model</th>
                <th className={styles.displayDataHeaderCell}>Width</th>
                <th className={styles.displayDataHeaderCell}>Profile</th>
                <th className={styles.displayDataHeaderCell}>Diameter</th>
                <th className={styles.displayDataHeaderCell}>ZR/R</th>
                <th className={styles.displayDataHeaderCell}>LTP</th>
                <th className={styles.displayDataHeaderCell}>Load</th>
                <th className={styles.displayDataHeaderCell}>Speed</th>
                <th className={styles.displayDataHeaderCell}>Quantity</th>
                <th className={styles.displayDataHeaderCell}>Price</th>
                <th className={styles.displayDataHeaderCell}>Best Offer</th>
              </tr>
            </thead>
            <tbody className={styles.displayMain}>
              {displayData.map((item, idx) => {
                return (
                  <tr
                    key={item["part #"] + idx}
                    className={styles.displayMainRow}
                  >
                    <td className={styles.displayMainCell}>{item["part #"]}</td>
                    <td className={styles.displayMainCell}>
                      {item["Tread Depth"]}
                    </td>
                    <td className={styles.displayMainCell}>
                      {item["Condition"]}
                    </td>
                    <td className={styles.displayMainCell}>{item["Brand"]}</td>
                    <td className={styles.displayMainCell}>{item["Model"]}</td>
                    <td className={styles.displayMainCell}>{item["Width"]}</td>
                    <td className={styles.displayMainCell}>
                      {item["Profile"]}
                    </td>
                    <td className={styles.displayMainCell}>
                      {item["Diameter"]}
                    </td>
                    <td className={styles.displayMainCell}>{item["ZR/R"]}</td>
                    <td className={styles.displayMainCell}>{item["LTP"]}</td>
                    <td className={styles.displayMainCell}>{item["Load"]}</td>
                    <td className={styles.displayMainCell}>{item["Speed"]}</td>
                    <td className={styles.displayMainCell}>
                      {item["Quantity"]}
                    </td>
                    <td className={styles.displayMainCell}>{item["Price"]}</td>
                    <td className={styles.displayMainCell}>
                      {item["Best Offer"]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!displayData.length && <p>No results match current filtering</p>}
      </main>
    </div>
  );
};

export default Home;
