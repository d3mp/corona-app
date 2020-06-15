import { getByTestId, render } from "@testing-library/react";
import moment, { Moment } from "moment";
import React from "react";
import { countriesByName } from "../../../features/countries/__mocks__/countries.mock";
import { HoveredCountry } from "../../../features/map/mapTypes";
import Tooltip from "../Tooltip";

describe("Tooltip", () => {
  it("should not render tooltip without hoveredCountry", () => {
    const date: Moment = moment("2020-04-20T00:00:00+00:00");
    const { container } = render(<Tooltip date={date} />);

    expect(container).toMatchSnapshot();
  });

  it("should render tooltip when hoveredCountry exists", () => {
    const date: Moment = moment("2020-04-20T00:00:00Z");
    const hoveredCountry: HoveredCountry = {
      country: countriesByName["USA"],
      offsetX: 0,
      offsetY: 0,
    };

    const { container, getAllByTestId } = render(
      <Tooltip date={date} hoveredCountry={hoveredCountry} />
    );
    const countryName = getByTestId(container, "tooltip-country");
    const [
      confirmedLabel,
      recoveredLabel,
      deathsLabel,
      activeLabel,
    ] = getAllByTestId("tooltip-label");
    const [
      confirmedValue,
      recoveredValue,
      deathsValue,
      activeValue,
    ] = getAllByTestId("tooltip-value");

    expect(countryName).toHaveTextContent("USA");

    expect(confirmedLabel).toHaveTextContent("Confirmed:");
    expect(confirmedValue).toHaveTextContent("784,326(+25,240)");

    expect(recoveredLabel).toHaveTextContent("Recovered:");
    expect(recoveredValue).toHaveTextContent("72,329(+1,992)");

    expect(deathsLabel).toHaveTextContent("Deaths:");
    expect(deathsValue).toHaveTextContent("42,094(+1,433)");

    expect(activeLabel).toHaveTextContent("Active:");
    expect(activeValue).toHaveTextContent("669,903(+21,815)");
  });
});
