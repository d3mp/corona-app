import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { Status } from "../../../features/countries/countriesTypes";
import { COLORS_BY_FILTER_TYPE } from "../../../features/map/mapUtils";
import { TotalCount } from "../TotalCount";

describe("TotalCount", () => {
  it("shold display label and quantity", () => {
    const label = "Confirmed";
    const quantity = 1000000;

    const { container, getByTestId } = render(
      <TotalCount
        label={label}
        quantity={quantity}
        activeColor={COLORS_BY_FILTER_TYPE[Status.Confirmed]}
        isActive={false}
        onClick={() => {}}
      />
    );

    expect(getByTestId("total-count-label")).toHaveTextContent(label);
    expect(getByTestId("total-count-value")).toHaveTextContent(
      quantity.toLocaleString()
    );
    expect(container.childNodes[0]).not.toHaveStyle({
      color: COLORS_BY_FILTER_TYPE[Status.Confirmed],
    });
  });

  it("shold support active state", () => {
    const { container } = render(
      <TotalCount
        label={"Confirmed"}
        quantity={1000000}
        activeColor={COLORS_BY_FILTER_TYPE[Status.Confirmed]}
        isActive={true}
        onClick={() => {}}
      />
    );

    expect(container.firstChild).toHaveStyle({
      color: COLORS_BY_FILTER_TYPE[Status.Confirmed],
    });
  });

  it("should handle onClick", () => {
    const onClick = jest.fn();
    const label = "Confirmed";
    const quantity = 1000000;

    const { container } = render(
      <TotalCount
        label={label}
        quantity={quantity}
        activeColor={COLORS_BY_FILTER_TYPE[Status.Confirmed]}
        isActive={false}
        onClick={onClick}
      />
    );
    // using condition because firstChild can be null
    fireEvent.click(container.firstChild || container);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
