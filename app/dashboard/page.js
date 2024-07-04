"use client";
import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import {
  Grid,
  Typography,
  Box,
  Tab,
  Card,
  Avatar,
  Chip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
} from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  DoughnutController,
  ArcElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import LinearProgressComponent from "@/components/linearProgress/LinearProgress";
import { supabase } from "../../supabase/supabase";
import { Circle } from "@mui/icons-material";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/lib/redux/slices/userSlice";
import Loading from "@/components/loading/Loading";
// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  DoughnutController,
  ArcElement,
  Tooltip
);
const Dashboard = () => {
  const [value, setValue] = useState("1");
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const router = useRouter();
  const { setUser } = useAppContext();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.auth);
  const { user = {} } = userState;
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState([]);
  useEffect(() => {
    if (!user.id) {
      router.push("/auth/signin");
    }
    if (user.id) {
      setLoading(false);
    }
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const options = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(0) + "%";
          return percentage;
        },
        color: "#fff",
      },
    },
  };

  const doughnutData = {
    labels: ["Food", "Drinks"],
    datasets: [
      {
        data: [30, 70], // Percentage values for food and drinks
        backgroundColor: ["#FFCA40", "#C8161D"], // Colors for food and drinks
        hoverBackgroundColor: ["#FFCA40", "#C8161D"],
      },
    ],
  };

  const dummyData = [
    {
      id: 1,
      type: "food",
      item: "Fried Wings",
      price: 67,
      imge: "/images/chicken.png",
    },
    {
      id: 2,
      type: "food",
      item: "Cheeseburger",
      price: 67,
      imge: "/images/burger.png",
    },
    {
      id: 3,
      type: "drinks",
      item: "Cold Cofee",
      price: 67,
      imge: "/images/coffee.png",
    },
  ];
  const filterData = [
    {
      value: "Yesterday",
    },
    {
      value: "Today",
    },
    {
      value: "Week",
    },
    {
      value: "Month",
    },
  ];

  const getAllOrders = async () => {
    setLoading(true);
    try {
      let { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("waiter_id", user.id);

      setTotalOrders(orders);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllOrders();
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.analytics}>
          <Grid container className={styles.header}>
            <Grid item xs={8} md={8} className={styles.headerContent}>
              <Typography variant="h5" className={styles.title}>
                Dashboard
              </Typography>
            </Grid>
            <Grid item md={1} />
            <Grid item xs={4} md={3} className={styles.filterContainer}>
              <TextField
                id="outlined-select-currency"
                select
                fullWidth
                defaultValue={filterData[0].value}
                className={styles.selectField}
              >
                {filterData.map((option) => (
                  <MenuItem
                    className={styles.menu}
                    key={option.value}
                    value={option.value}
                  >
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4} className={styles.lineChart}>
              <Card elevation={2} className={styles.chartCard}>
                <Typography variant="h6" className={styles.title}>
                  Daily Sales
                </Typography>
                <div className={styles.chart}>
                  <Line
                    data={{
                      labels: [
                        "9:00 am",
                        "10:00 am",
                        "11:00 am",
                        "12:00 pm",
                        "1:00 pm",
                        "2:00 pm",
                      ],
                      datasets: [
                        {
                          data: [1000, 2000, 4000, 3000, 5000, 6000],
                          borderColor: "#c8161d",
                          borderWidth: 2, // Adjust the border width as needed
                          tension: 0.4, // Adjust the tension to make the curve smoother
                          borderCapStyle: "round", // Set border cap style to round
                          borderJoinStyle: "round",
                          pointRadius: 4, // Increase point radius to make the padding more visible
                          pointHoverBorderWidth: 10,
                        },
                      ],
                    }}
                  />
                </div>
              </Card>
            </Grid>
            <Grid item xs={4} md={4} sm={12} className={styles.doughnutChart}>
              <Card elevation={2} className={styles.chartCard}>
                <div className={styles.typeContainer}>
                  <Typography variant="h6" className={styles.title}>
                    Total income
                  </Typography>
                  <div
                    className={styles.type}
                    style={{ marginRight: "0.8rem" }}
                  >
                    <Circle sx={{ color: "#C8161D" }} className={styles.icon} />
                    <Typography variant="body2">Food</Typography>
                  </div>
                  <div className={styles.type}>
                    <Circle sx={{ color: "#FFCA40" }} className={styles.icon} />
                    <Typography variant="body2">Drinks</Typography>
                  </div>
                </div>
                <div className={styles.chart}>
                  <Doughnut
                    data={doughnutData}
                    title="doughnt"
                    options={options}
                  />
                </div>
              </Card>
            </Grid>
            <Grid item xs={4} md={4} sm={12} className={styles.trending}>
              <Card elevation={2} className={styles.chartCard}>
                <Typography variant="h6" className={styles.title}>
                  Trending Dishes
                </Typography>
                <div className={styles.headContainer}>
                  <Typography variant="body2" className={styles.head}>
                    Dishes
                  </Typography>
                  <Typography variant="body2" className={styles.head}>
                    Orders
                  </Typography>
                </div>
                <div className={styles.chart}>
                  <div className={styles.trendingTable}>
                    {dummyData.map((item, i) => (
                      <div className={styles.details}>
                        <div className={styles.itemDets}>
                          <Avatar
                            className={styles.avatar}
                            src={item.imge}
                          ></Avatar>
                          <div className={styles.specs}>
                            <Chip
                              label="Food"
                              variant="contained"
                              className={styles.chip}
                              color={item.color}
                            />
                            <Typography variant="body2" className={styles.item}>
                              {item.item}
                            </Typography>
                          </div>
                        </div>
                        <div className={styles.itemPrice}>₹36</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} sm={12} className={styles.progressChart}>
              <Card className={styles.chartCard}>
                <LinearProgressComponent
                  title={"Total Orders"}
                  data={totalOrders?.length}
                  progress={totalOrdersCount}
                  color={"#C8161D"}
                />
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default Dashboard;
