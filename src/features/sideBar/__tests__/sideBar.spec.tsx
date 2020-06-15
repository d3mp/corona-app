import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render } from "@testing-library/react";
import moment, { Moment } from "moment";
import React from "react";
import { Provider } from "react-redux";
import App from "../../../app/App";
import getStore from "../../../app/store";
import { Status } from "../../countries/countriesTypes";
import { countriesByName } from "../../countries/__mocks__/countries.mock";
import SideBar from "../SideBar";

const { store: initialStore, storeConfig } = getStore();

describe("SideBar", () => {
  const date: Moment = moment("2020-04-20T00:00:00");
  let store: any;

  beforeEach(() => {
    const initialState = initialStore.getState();
    store = configureStore({
      ...storeConfig,
      preloadedState: {
        ...initialState,
        countries: {
          ...initialState.countries,
          countriesByName: countriesByName,
        },
        sideBar: {
          ...initialState.sideBar,
          timelineDate: date.format(),
        },
      },
    });
  });

  it("should display totals filtered by statuses", () => {
    const { getAllByTestId } = render(
      <Provider store={store}>
        <SideBar />
      </Provider>
    );

    const [
      confirmedLabel,
      recoveredLabel,
      deathsLabel,
      activeLabel,
    ] = getAllByTestId("totals-tab-label");
    const [
      confirmedValue,
      recoveredValue,
      deathsValue,
      activeValue,
    ] = getAllByTestId("totals-tab-value");

    expect(confirmedLabel).toHaveTextContent("Confirmed");
    expect(confirmedValue).toHaveTextContent("1,035,300");

    expect(recoveredLabel).toHaveTextContent("Recovered");
    expect(recoveredValue).toHaveTextContent("185,861");

    expect(deathsLabel).toHaveTextContent("Deaths");
    expect(deathsValue).toHaveTextContent("70,732");

    expect(activeLabel).toHaveTextContent("Active");
    expect(activeValue).toHaveTextContent("778,707");

    // Check that Confirmed filter selected by default
    expect(store.getState().sideBar.filterBy.status).toEqual(Status.Confirmed);
    // Check that filtering by Recovered works
    fireEvent.click(recoveredLabel);
    expect(store.getState().sideBar.filterBy.status).toEqual(Status.Recovered);
    // Check that filtering by Deaths works
    fireEvent.click(deathsLabel);
    expect(store.getState().sideBar.filterBy.status).toEqual(Status.Deaths);
    // Check that filtering by Active works
    fireEvent.click(activeLabel);
    expect(store.getState().sideBar.filterBy.status).toEqual(Status.Active);
  });

  // it("should display totals based on timeline", () => {
  //   const { getByTestId, getAllByTestId, getByLabelText, getByText } = render(
  //     <Provider store={store}>
  //       <App />
  //     </Provider>
  //   );
  //   const prevDay = date.clone().subtract(1, "day");

  //   const [
  //     confirmedLabel,
  //     recoveredLabel,
  //     deathsLabel,
  //     activeLabel,
  //   ] = getAllByTestId("totals-tab-label");
  //   const [
  //     confirmedValue,
  //     recoveredValue,
  //     deathsValue,
  //     activeValue,
  //   ] = getAllByTestId("totals-tab-value");

  //   // Check that default date is correct
  //   const timelineInput = getByTestId("timeline-slider");
  //   expect(timelineInput).toBeInTheDocument();

  //   fireEvent.onChange(timelineInput, {
  //     target: { value: prevDay.dayOfYear() },
  //   });
  //   expect(getByLabelText(prevDay.format("LL"))).toBeInTheDocument();

  //   expect(confirmedLabel).toHaveTextContent("Confirmed");
  //   expect(confirmedValue).toHaveTextContent("1,007,804");

  //   expect(recoveredLabel).toHaveTextContent("Recovered");
  //   expect(recoveredValue).toHaveTextContent("182,011");

  //   expect(deathsLabel).toHaveTextContent("Deaths");
  //   expect(deathsValue).toHaveTextContent("68,845");

  //   expect(activeLabel).toHaveTextContent("Active");
  //   expect(activeValue).toHaveTextContent("756,948");
  // });

  it("should display totals based on search filter", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const [
      confirmedLabel,
      recoveredLabel,
      deathsLabel,
      activeLabel,
    ] = getAllByTestId("totals-tab-label");
    const [
      confirmedValue,
      recoveredValue,
      deathsValue,
      activeValue,
    ] = getAllByTestId("totals-tab-value");
    // Check that default date is correct
    const searchInput = getByPlaceholderText("Search...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).not.toHaveValue();

    fireEvent.change(searchInput, {
      target: { value: "USA" },
    });

    expect(searchInput).toHaveValue("USA");

    expect(confirmedLabel).toHaveTextContent("Confirmed");
    expect(confirmedValue).toHaveTextContent("784,326");

    expect(recoveredLabel).toHaveTextContent("Recovered");
    expect(recoveredValue).toHaveTextContent("72,329");

    expect(deathsLabel).toHaveTextContent("Deaths");
    expect(deathsValue).toHaveTextContent("42,094");

    expect(activeLabel).toHaveTextContent("Active");
    expect(activeValue).toHaveTextContent("669,903");
  });
});
