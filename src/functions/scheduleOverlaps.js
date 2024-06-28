const validateOverlaps = function(list, start, end) {

  var timeList = [];
  if (list.length) {
    list.forEach(l => {
      const ed = (l.endTime = l.end.split(":", 2).join(":"));
      const st = (l.startTime = l.start.split(":", 2).join(":"));
      timeList.push([st, ed]);
    });
  } else {
    return true;
  }
  timeList.push([start, end]);

  const bool = checkOverlap(timeList);
  return bool;
};

const checkOverlap = timeSegments => {
  if (timeSegments.length === 1) return true;

  timeSegments.sort((timeSegment1, timeSegment2) =>
    timeSegment1[0].localeCompare(timeSegment2[0])
  );

  for (let i = 0; i < timeSegments.length - 1; i++) {
    const currentEndTime = timeSegments[i][1];
    const nextStartTime = timeSegments[i + 1][0];

    if (currentEndTime > nextStartTime) {
      return false;
    }
  }

  return true;
};

export { validateOverlaps };
