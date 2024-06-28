import moment from "moment";
const correctDate = function (configs) {
  const onlyStart = ["current_day", "previous_day"];
  const date = {
    start: "",
    end: "",
  };

  if (onlyStart.includes(configs.name)) {
    if (configs.name === "current_day") {
      date.start =
        moment().format("DD MMM YYYY dddd") + " " + configs.start_time;
      date.end = moment().format("DD MMM YYYY dddd") + " " + configs.end_time;
    } else {
      date.start =
        moment().subtract(1, "days").format("DD MMM YYYY dddd") +
        " " +
        configs.start_time;
      date.end =
        moment().subtract(1, "days").format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    }
  } else if (configs.name === "current_week") {
    date.start =
      moment().startOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.start_time;
    date.end =
      moment().endOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.end_time;
  } else if (configs.name === "previous_week") {
    date.start =
      moment().subtract(7, "days").startOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.start_time;
    date.end =
      moment().subtract(7, "days").endOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.end_time;
  } else if (configs.name === "current_month") {
    date.start =
      moment().startOf("month").format("DD MMM YYYY") +
      " " +
      configs.start_time;
    date.end =
      moment().endOf("month").format("DD MMM YYYY") + " " + configs.end_time;
  } else if (configs.name === "previous_month") {
    date.start =
      moment().subtract(1, "months").startOf("month").format("DD MMM YYYY") +
      " " +
      configs.start_time;
    date.end =
      moment().subtract(1, "months").endOf("month").format("DD MMM YYYY") +
      " " +
      configs.end_time;
  } else if (configs.name === "target_day") {
    if (configs.val.target_day) {
      date.start =
        moment(configs.val.target_day).format("DD MMM YYYY dddd") +
        " " +
        configs.start_time;
      date.end =
        moment(configs.val.target_day).format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    } else {
      date.start = date.end = "No selected date ";
    }
  } else if (configs.name === "target_month") {
    if (configs.val.target_month) {
      date.start =
        moment(configs.val.target_month)
          .startOf("month")
          .format("DD MMM YYYY dddd") +
        " " +
        configs.start_time;

      date.end =
        moment(configs.val.target_month)
          .endOf("month")
          .format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    } else {
      date.start = date.end = "No selected date ";
    }
  } else if (configs.name === "target_period") {
    if (configs.val.target_period.start_date) {
      date.start =
        moment(configs.val.target_period.start_date).format(
          "DD MMM YYYY dddd"
        ) +
        " " +
        configs.start_time;
    } else {
      date.start = "No selected date ";
    }
    if (configs.val.target_period.end_date) {
      date.end =
        moment(configs.val.target_period.end_date).format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    } else {
      date.end = "No selected date ";
    }
  }

  return date;
};

const correctEditDate = function (configs) {
  const onlyStart = ["current_day", "previous_day"];
  const date = {
    start: "",
    end: "",
  };

  if (onlyStart.includes(configs.key)) {
    if (configs.key === "current_day") {
      date.start =
        moment().format("DD MMM YYYY dddd") + " " + configs.start_time;
      date.end = moment().format("DD MMM YYYY dddd") + " " + configs.end_time;
    } else {
      date.start =
        moment().subtract(1, "days").format("DD MMM YYYY dddd") +
        " " +
        configs.start_time;
      date.end =
        moment().subtract(1, "days").format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    }
  } else if (configs.key === "current_week") {
    date.start =
      moment().startOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.start_time;
    date.end =
      moment().endOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.end_time;
  } else if (configs.key === "previous_week") {
    date.start =
      moment().subtract(7, "days").startOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.start_time;
    date.end =
      moment().subtract(7, "days").endOf("week").format("DD MMM YYYY dddd") +
      " " +
      configs.end_time;
  } else if (configs.key === "current_month") {
    date.start =
      moment().startOf("month").format("DD MMM YYYY") +
      " " +
      configs.start_time;
    date.end =
      moment().endOf("month").format("DD MMM YYYY") + " " + configs.end_time;
  } else if (configs.key === "previous_month") {
    date.start =
      moment().subtract(1, "months").startOf("month").format("DD MMM YYYY") +
      " " +
      configs.start_time;
    date.end =
      moment().subtract(1, "months").endOf("month").format("DD MMM YYYY") +
      " " +
      configs.end_time;
  } else if (configs.key === "target_day") {
    if (configs.val.target_day) {
      date.start =
        moment(configs.val.target_day).format("DD MMM YYYY dddd") +
        " " +
        configs.start_time;
      date.end =
        moment(configs.val.target_day).format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    } else {
      date.start = date.end = "No selected date ";
    }
  } else if (configs.key === "target_month") {
    if (configs.val.target_month) {
      date.start =
        moment(configs.val.target_month)
          .startOf("month")
          .format("DD MMM YYYY dddd") +
        " " +
        configs.start_time;

      date.end =
        moment(configs.val.target_month)
          .endOf("month")
          .format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    } else {
      date.start = date.end = "No selected date ";
    }
  } else if (configs.key === "target_period") {
    if (configs.val && configs.val.start_date) {
      date.start =
        moment(configs.val.start_date).format("DD MMM YYYY dddd") +
        " " +
        configs.start_time;
    } else {
      date.start = "No selected date ";
    }
    if (configs.val.end_date) {
      date.end =
        moment(configs.val.end_date).format("DD MMM YYYY dddd") +
        " " +
        configs.end_time;
    } else {
      date.end = "No selected date ";
    }
  }

  return date;
};

export { correctDate, correctEditDate };
