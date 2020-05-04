import { SearchOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onChange: (searchValue: string) => void;
}

export function SearchBar({ onChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const _onChange = useCallback(
    (e) => {
      setSearchValue(e.target.value);
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={styles.searchBar}>
      <input value={searchValue} onChange={_onChange} placeholder="Search..." />
      <SearchOutlined className={styles.searchIcon} />
    </div>
  );
}
