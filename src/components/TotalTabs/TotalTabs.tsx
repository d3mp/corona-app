import { Container, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import React from "react";
import { Nullable } from "../../genericTypes";
import useStyles from "./TotalTabs.styles";

export type Tab = {
  key: string;
  label: string;
  value: Nullable<number | string>;
};

type Props = {
  onChange: (value: Tab) => void;
  tab: Tab;
  tabs: Tab[];
  tabTextColor: "inherit" | "secondary" | "primary" | undefined;
  tabIndicatorColor: string;
};

const TotalTabs = ({
  onChange,
  tabs,
  tab,
  tabTextColor,
  tabIndicatorColor,
}: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Tabs
        className={classes.tabs}
        value={tabs.findIndex((item) => item.key === tab.key)}
        onChange={(_, idx: number) => onChange(tabs[idx])}
        textColor={tabTextColor}
        TabIndicatorProps={{
          style: {
            backgroundColor: tabIndicatorColor,
          },
        }}
        centered
      >
        {tabs.map(({ key, label, value }) => (
          <Tab
            className={classes.tab}
            key={key}
            label={
              <Container>
                <Typography
                  className={classes.tabLabel}
                  component="div"
                  data-testid="totals-tab-label"
                >
                  {label}
                </Typography>
                <Typography
                  className={classes.tabSubLabel}
                  component="div"
                  data-testid="totals-tab-value"
                >
                  {value}
                </Typography>
              </Container>
            }
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default TotalTabs;
