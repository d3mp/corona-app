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
import React, { useCallback, useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../common/hooks/useDebounce";
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
  const largeScreen: boolean = useMediaQuery(theme.breakpoints.up("md"));
  const date: Moment = useSelector(selectMomentTimelineDate);
  const startDate: Moment = useSelector(selectFilteredStartTimelineDate);
  const [value, setValue] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debouncedTimelineDate, _, setDebouncedTimelineDate] = useDebounce<
    Moment
  >(startDate, 500);

  const handleChange = useCallback(
    (e, newValue: number) => setValue(newValue),
    [setValue]
  );

  useEffect(() => {
    if (debouncedTimelineDate) {
      ReactGA.event({
        action: "Filter By Date",
        category: "Countries",
        label: debouncedTimelineDate.format("LL"),
      });
    }
  }, [debouncedTimelineDate]);

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
        onChange={(date: Moment) => {
          setDebouncedTimelineDate(date);
          dispatch(setTimelineDate(date.format()));
        }}
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
