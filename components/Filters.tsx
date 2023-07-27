import { TireSets } from "../types/TireSets.type";
import styles from "../styles/Filters.module.css";
import { Filters as FilterType } from "../types/Filters.type";

interface FiltersProps {
  tireSets: TireSets | undefined;
  activeFilters: FilterType;
  applyFilter: (key: string, value: string) => void;
  resetFilters: () => void;
}

const Filters: React.FC<FiltersProps> = (props) => {
  if (!props.tireSets) return <></>;

  return (
    <div>
      {Object.keys(props.activeFilters).map((filterKey, idx) => {
        console.log({ filterKey, idx });
        return (
          <select key={filterKey + idx} onChange={(e) => props.applyFilter(filterKey, e.currentTarget.value)} className={styles.filterSelect}>
            <option value="">- Select A {filterKey} -</option>
            {props.tireSets?.[filterKey].map((value) => {
              return (
                <option
                  key={value}
                  value={value}
                  // selected={
                  //   props.activeFilters[filterKey] === value ? true : false
                  // }
                >
                  {value}
                </option>
              );
            })}
          </select>
        );
      })}
      <button className={styles.resetFilters} onClick={props.resetFilters}>
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
