var id = 1;

var upperCaseToSpace = function (modelName) {
  let name = "";
  const char = modelName;
  if (char === char.toUpperCase()) {
    name = name + char.toLowerCase();
  } else {
    name = name + char;
  }
  name = name.replace(/([A-Z])/g, " $1").trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

var recurseData = function (data, pid, fieldArr) {
  if (Object.keys(data).length) {
    Object.keys(data).forEach(function (node) {
      var obj = {};
      obj.name = upperCaseToSpace(node);
      obj.original_name = node
      obj.id = id;

      if (Object.keys(data[node]).length) {
        obj.hasChild = true;
        if (pid) {
          obj.pid = pid;
        }
        if (typeof data[node] == "boolean") {
          obj.isChecked = data[node];
        }
        id++;
        fieldArr.push(obj);
        recurseData(data[node], obj.id, fieldArr);
      } else {
        obj.name = upperCaseToSpace(node);
        obj.original_name = node

        obj.isChecked = false;
        if (pid) {
          obj.pid = pid;
        }
        if (typeof data[node] == "boolean") {
          obj.isChecked = data[node];
        }
        id++;
        fieldArr.push(obj);

        recurseData(data[node], obj.id, fieldArr);
      }
    });
  }

  return fieldArr
}

export { recurseData };
