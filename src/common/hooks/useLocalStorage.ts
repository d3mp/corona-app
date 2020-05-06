import { useCallback, useState } from "react";
import { Nullable } from "../../genericTypes";

export default function useLocalStorage<T>(key: string, initialValue?: T) {
  const [data, setData] = useState<T>(() => {
    try {
      const dataJson: Nullable<string> = localStorage.getItem(key);

      if (dataJson) {
        return JSON.parse(dataJson);
      }

      return initialValue;
    } catch (ex) {
      console.warn(ex);
      return initialValue;
    }
  });

  const setLocalStorage = useCallback(
    (data: T) => {
      try {
        setData(data);
        localStorage.setItem(key, JSON.stringify(data));
      } catch (ex) {
        console.warn(ex);
      }
    },
    [key, setData]
  );

  return [data, setLocalStorage] as [T, (data: T) => void];
}
