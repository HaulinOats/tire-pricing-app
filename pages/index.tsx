import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import Filters from "../components/Filters";
import styles from "../styles/Home.module.css";
import { Filters as FiltersType } from "../types/Filters.type";
import { Sheet1 } from "../types/Sheet1.type";
import { TireSets } from "../types/TireSets.type";

const activeFiltersDefault = {
  Model: undefined,
  Width: undefined,
  Profile: undefined,
  Diameter: undefined
};

const Home: NextPage = () => {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [tireData, setTireData] = useState<Sheet1[] | []>([]);
  const [tireSets, setTireSets] = useState<TireSets | undefined>(undefined);
  const [displayData, setDisplayData] = useState<Sheet1[] | []>([]);
  const [activeFilters, setActiveFilters] = useState<FiltersType>(activeFiltersDefault);
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    getTireData();

    let keysPressed = new Set();
    function handleKeyDown(e: KeyboardEvent) {
      keysPressed.add(e.key);
      if (keysPressed.has("Shift") && keysPressed.has("T")) {
        toggleShowPrice();
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      keysPressed.delete(e.key);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const getTireData = async () => {
    try {
      const response = await fetch("2.0 Used Tire Upload B.xlsx");
      const rawData = await response.arrayBuffer();
      const workbook = read(rawData);

      let tireSets: any = {
        Model: [],
        Width: [],
        Profile: [],
        Diameter: []
      };

      let tireData: Sheet1[] = [];

      for (const sheet in workbook.Sheets) {
        let sheetArr: any = utils.sheet_to_json(workbook.Sheets[sheet]);
        switch (sheet) {
          case "sheet 1":
            for (let i = 0; i < sheetArr.length; i++) {
              tireData.push(sheetArr[i]);
              ["Model", "Width", "Profile", "Diameter"].forEach((key) => {
                if (sheetArr[i][key]) tireSets[key].push(sheetArr[i][key]);
              });
            }
            break;
          default:
        }
      }
      for (const key in tireSets) {
        tireSets[key] = Array.from(new Set(tireSets[key])).sort((a: any, b: any) => {
          if (a.toString() < b.toString()) return -1;
          if (a.toString() > b.toString()) return 1;
          return 0;
        });
      }
      setTireData(tireData);
      setTireSets(tireSets);
      setIsLoadingData(false);
    } catch (err) {
      alert(`there was an error grabbing the file: ${err}`);
    }
  };

  const toggleShowPrice = () => {
    console.log("toggle show price");
    setShowPrice(!showPrice);
  };

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
          if (tempActiveFilters[filter] && tempActiveFilters[filter] !== item[filter]) return false;
        }
        return true;
      });
    }

    setDisplayData(tempDisplayData);
    setActiveFilters(tempActiveFilters);
  };

  const resetFilters = () => {
    setActiveFilters({ ...activeFiltersDefault });
  };

  const getThresholdHTML = (price: number) => {
    if (price > 74)
      return (
        <span className={`${styles.threshold} ${styles.thresholdAbove}`}>
          <span>&#10003;</span>
        </span>
      );
    return (
      <span className={`${styles.threshold} `}>
        <span>&#10006;</span>
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Tire Pricing App</title>
        <meta name="description" content="Elite Used Tires pricing application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Tire Pricing App</h1>
        {/* <FileUpload getTireSets={setTireSets} getTireData={setTireData} /> */}
        <Filters activeFilters={activeFilters} tireSets={tireSets} applyFilter={applyFilter} resetFilters={resetFilters} />
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
                  <tr key={item["Part #"] + idx} className={styles.displayMainRow}>
                    <td className={styles.displayMainCell}>{item["Part #"]}</td>
                    <td className={styles.displayMainCell}>{item["Tread Depth"]}</td>
                    <td className={styles.displayMainCell}>{item["Condition"]}</td>
                    <td className={styles.displayMainCell}>{item["Brand"]}</td>
                    <td className={styles.displayMainCell}>{item["Model"]}</td>
                    <td className={styles.displayMainCell}>{item["Width"]}</td>
                    <td className={styles.displayMainCell}>{item["Profile"]}</td>
                    <td className={styles.displayMainCell}>{item["Diameter"]}</td>
                    <td className={styles.displayMainCell}>{item["ZR/R"]}</td>
                    <td className={styles.displayMainCell}>{item["LTP"]}</td>
                    <td className={styles.displayMainCell}>{item["Load"]}</td>
                    <td className={styles.displayMainCell}>{item["Speed"]}</td>
                    <td className={styles.displayMainCell}>{item["Quantity"]}</td>
                    <td className={styles.displayMainCell}>{showPrice ? <span>{item["Price"]}</span> : getThresholdHTML(item["Price"])}</td>
                    <td className={styles.displayMainCell}>{item["Best Offer"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!displayData.length && <p>No results match current filtering</p>}
        {isLoadingData && <div className={styles.ldsHourglass}></div>}
      </main>
    </div>
  );
};

export default Home;
