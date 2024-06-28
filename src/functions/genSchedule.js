const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

const week_data = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7,
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
}

let attendance_timeframes = []

var generateTimeframes = function (res) {
    attendance_timeframes = []
    if (res.type == "weekly") {
        let weeks = [...weekDays]
        weeks.forEach((day) => {
            attendance_timeframes.push({
                name: day,
                original_name: week_data[day],
                time: [],
            });
        });
        if (res.timeframes.length) {
            res.timeframes.forEach((time) => {
                let hasDay = attendance_timeframes.find(
                    (s) => s.original_name == time.name
                );
                if (hasDay) {
                    hasDay.time.push({
                        start: time.start,
                        end: time.end,
                    });
                }
            });
        }
        return attendance_timeframes
    } else if (res.type == "daily") {
        attendance_timeframes = [
            {
                name: "Day-1",
                original_name: 1,
                time: [],
            },
        ];
        if (res.timeframes.length) {
            res.timeframes.forEach((time) => {
                let hasDay = attendance_timeframes.find(
                    (s) => s.original_name == time.name
                );
                if (hasDay) {
                    hasDay.time.push({
                        start: time.start,
                        end: time.end,
                    });
                }
            });
        }
        return attendance_timeframes
    } else if (res.type == "flexitime") {
        let filterData = [];

        if (res.timeframes && res.timeframes.length) {
            res.timeframes.forEach((timeframe) => {
                let hasname = filterData.find(
                    (i) => i.name == timeframe.name
                );
                if (!hasname) {
                    filterData.push({
                        name: timeframe.name,
                        time: [{ start: timeframe.start, end: timeframe.end }],
                    });
                } else {
                    hasname.time.push({
                        start: timeframe.start,
                        end: timeframe.end,
                    });
                }
            });
        }

        return filterData

    } else if (res.type == "specific") {
        let filterData = [];

        if (res.timeframes && res.timeframes.length) {
            res.timeframes.forEach((timeframe) => {
                let hasname = filterData.find(
                    (i) => i.name == timeframe.name
                );
                if (!hasname) {
                    filterData.push({
                        name: timeframe.name,
                        time: [{ start: timeframe.start, end: timeframe.end }],
                    });
                } else {
                    hasname.time.push({
                        start: timeframe.start,
                        end: timeframe.end,
                    });
                }
            });
        }
        return filterData
    }
}

export { generateTimeframes }