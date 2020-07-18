import { Drawer, Toolbar } from "@material-ui/core";
import React from "react";
import ReactGA from "react-ga";
import { useDispatch, useSelector } from "react-redux";
import TotalTabs, { Tab } from "../../components/TotalTabs/TotalTabs";
import { selectFilteredSumData } from "../countries/countriesSlice";
import { Status } from "../countries/countriesTypes";
import { CountriesTable } from "../countriesTable/CountriesTable";
import { COLORS_BY_FILTER_TYPE } from "../map/mapUtils";
import useStyles from "./sideBar.styles";
import { selectFilterBy, setFilterBy } from "./sideBarSlice";
import { FilterBy } from "./sideBarTypes";

const tabs: Tab[] = [
  { key: Status.Confirmed, label: "Confirmed", value: null },
  { key: Status.Recovered, label: "Recovered", value: null },
  { key: Status.Deaths, label: "Deaths", value: null },
  { key: Status.Active, label: "Active", value: null },
];

const SideBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterBy: FilterBy = useSelector(selectFilterBy);
  const sumData = useSelector(selectFilteredSumData);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Toolbar />
      <TotalTabs
        onChange={(tab: Tab) => {
          ReactGA.event({
            action: "Filter By Status",
            category: "Countries",
            label: tab.key,
          });

          dispatch(
            setFilterBy({
              status: tab.key as Status,
              favorite: filterBy.favorite,
            })
          );
        }}
        tabs={tabs.map((tab: Tab) => ({
          ...tab,
          value: sumData[tab.key as Status].toLocaleString(),
        }))}
        tab={tabs.find((tab) => tab.key === filterBy.status) as Tab}
        tabTextColor="inherit"
        tabIndicatorColor={COLORS_BY_FILTER_TYPE[filterBy.status]}
      />
      <CountriesTable />
    </Drawer>
  );
};

export default SideBar;
