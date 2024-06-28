var scheduleTreeData = function(array) {
  let filterData = [];
  let dayNumberSpec = 1;
  let dayNumber = 1;

  if (array.length) {
    array.forEach(item => {
      if (item.type == "daily") {
        item.timeframe_name = `Day-1`;
        item.hasAttribute = { class: "day" };
      }

      if (item.type == "weekly") {
        item.hasAttribute = { class: "weekly" };
      }

      if (item.type == "flexitime") {
        item.hasAttribute = { class: "flexitime" };
      }

      if (item.type == "specific") {
        item.hasAttribute = { class: "specific" };
      }

      let hasParent = filterData.filter(i => i.id == item.id);
      if (!hasParent.length) {
        let obj = {};
        obj.id = item.id;
        obj.data = item;
        obj.name = item.name;
        obj.type = item.type;
        if (item.expanded) {
          obj.expaned = true;
        }

        if (item.hasAttribute) {
          obj.hasAttribute = item.hasAttribute;
        }

        if (item.timeframe_name && item.type !== "weekly") {
          let objChild = {};
          if (item.type == "specific" || item.type == "ordinal") {
            objChild.original_name = item.timeframe_name;

            if (item.type == "specific") {
              objChild.name = `D${dayNumberSpec}.${item.timeframe_name}`;
              dayNumberSpec++;
            } else {
              objChild.name = `D${dayNumber}.${item.timeframe_name}`;
              dayNumber++;
            }
          } else {
            objChild.name = item.timeframe_name;
            objChild.original_name = item.timeframe_name;
          }
          obj.hasChild = true;
          objChild.id = `${obj.id}_${item.timeframe_name}`;
          objChild.type = item.type;
          objChild.pid = obj.id;
          filterData.push(objChild);
        }

        filterData.push(obj);
      } else {
        if (item.type != "weekly") {
          let obj = {};
          obj.type = item.type;
          obj.id = `${item.id}_${item.timeframe_name}`;
          obj.data = item;
          if (item.expanded) {
            obj.expaned = true;
          }
          if (item.type == "specific" || item.type == "ordinal") {
            obj.original_name = item.timeframe_name;

            if (item.type == "specific") {
              obj.name = `D${dayNumberSpec}.${item.timeframe_name}`;
              dayNumberSpec++;
            } else {
              obj.name = `D${dayNumber}.${item.timeframe_name}`;
              dayNumber++;
            }
          } else {
            obj.name = item.timeframe_name;
            obj.original_name = item.timeframe_name;
          }

          obj.pid = item.id;
          filterData.push(obj);
        }
      }
    });
    return filterData;
  }
};

export { scheduleTreeData };
