import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  it("should handle onChange", () => {
    const onChange = jest.fn();
    const searchValue = "USA";

    const { getByPlaceholderText } = render(<SearchBar onChange={onChange} />);

    fireEvent.change(getByPlaceholderText("Search..."), {
      target: { value: searchValue },
    });

    expect(getByPlaceholderText("Search...")).toHaveValue(searchValue);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(searchValue);
  });
});
