import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import moment, { Moment } from "moment";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabsContext } from "../../contexts/TabsContext";
import { selectFilteredStartTimelineDate } from "../../features/countries/countriesSlice";
import {
  selectMomentTimelineDate,
  setTimelineDate,
} from "../../features/sideBar/sideBarSlice";
import TimelinePanel from "../TimelinePanel/TimelinePanel";
import useStyles from "./bottomTabs.styles";

type Tab = {
  label: string;
  panel: React.ReactElement;
};

type Props = {
  tabs: Tab[];
};

const BottomTabs = ({ tabs }: Props) => {
  const dispatch = useDispatch();
  const theme: Theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const handleChange = useCallback(
    (e, newValue: number) => setValue(newValue),
    []
  );
  const largeScreen: boolean = useMediaQuery(theme.breakpoints.up("md"));
  const date: Moment = useSelector(selectMomentTimelineDate);
  const startDate: Moment = useSelector(selectFilteredStartTimelineDate);

  return (
    <TabsContext.Provider value={{ tab: value, setTab: setValue }}>
      <div className={classes.panels}>
        {tabs.map((tab: Tab, idx) => (
          <div
            key={tab.label}
            className={classes.panel}
            hidden={!largeScreen && value !== idx}
          >
            {tab.panel}
          </div>
        ))}
      </div>
      <TimelinePanel
        date={date}
        onChange={(date) => dispatch(setTimelineDate(date.format()))}
        minDate={startDate}
        maxDate={moment().set({
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })}
      />
      <Paper className={classes.root}>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          centered
          TabIndicatorProps={{ className: classes.indicator }}
        >
          {tabs.map((tab: Tab) => (
            <Tab
              key={tab.label}
              className={classes.tab}
              label={
                <Container>
                  <Box className={classes.tabLabel}>{tab.label}</Box>
                </Container>
              }
            />
          ))}
        </Tabs>
      </Paper>
    </TabsContext.Provider>
  );
};

export default BottomTabs;
