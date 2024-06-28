const reader_type = {
  RFID: 1,
  KEYPAD: 1,
  FINGER: 1,
  FACE: 1,
};

const checkOutput = (access_points, active_reader) => {
  const resources = [];
  if (access_points && Object.keys(access_points).length) {
    for (const key in access_points) {
      const readers = access_points[key].readers;
      if (readers && Object.keys(readers).length) {
        for (const keys in readers) {
          if (
            keys !== active_reader &&
            readers[keys].reader_info &&
            "output" in readers[keys].reader_info
          ) {
            resources.push(readers[keys].reader_info.output);
          }
        }
      }
    }
  }
  return resources;
};

const checkOutputArr = (data, active_reader, hasCompSource) => {
  const resourcesArr = [];
  if (data.access_points.length) {
    for (let i = 0; i < data.access_points.length; i++) {
      const resources = data.access_points[i].resources;
      const new_resources = data.access_points[i].new_readers;
      if (resources && Object.keys(resources).length) {
        for (const key in resources) {
          const resource_name = active_reader.split("-")[1];

          if (
            key !== resource_name &&
            "output" in resources[key] &&
            (!hasCompSource
              ? !resources[key].component_source
              : resources[key].component_source)
          ) {
            resourcesArr.push(resources[key].output);
          }
        }
      }

      if (new_resources && Object.keys(new_resources).length) {
        for (const key in new_resources) {
          if (
            key !== active_reader &&
            new_resources[key].reader_info &&
            "output" in new_resources[key].reader_info &&
            (!hasCompSource
              ? !new_resources[key].component_source
              : new_resources[key].component_source)
          ) {
            resourcesArr.push(new_resources[key].reader_info.output);
          }
        }
      }
    }
  }

  if (data.new_access_points && Object.keys(data.new_access_points).length) {
    const new_ac_points = data.new_access_points;
    for (const key in new_ac_points) {
      const resources = new_ac_points[key].readers;
      if (resources && Object.keys(resources).length) {
        for (const key in resources) {
          if (
            key !== active_reader &&
            resources[key].reader_info &&
            "output" in resources[key].reader_info &&
            (!hasCompSource
              ? !resources[key].component_source
              : resources[key].component_source)
          ) {
            resourcesArr.push(resources[key].reader_info.output);
          }
        }
      }
    }
  }
  return resourcesArr;
};

const checkInputArr = (data, active_reader, hasCompSource) => {
  const resourcesArr = [];
  if (data.access_points.length) {
    for (let i = 0; i < data.access_points.length; i++) {
      const resources = data.access_points[i].resources;
      const new_resources = data.access_points[i].new_readers;
      if (resources && Object.keys(resources).length) {
        for (const key in resources) {
          const resource_name = active_reader.split("-")[1];

          if (
            key !== resource_name &&
            "input" in resources[key] &&
            (!hasCompSource
              ? !resources[key].component_source
              : resources[key].component_source)
          ) {
            resourcesArr.push(resources[key].input);
          }
        }
      }

      if (new_resources && Object.keys(new_resources).length) {
        for (const key in new_resources) {
          if (
            key !== active_reader &&
            new_resources[key].reader_info &&
            "input" in new_resources[key].reader_info &&
            (!hasCompSource
              ? !new_resources[key].component_source
              : new_resources[key].component_source)
          ) {
            resourcesArr.push(new_resources[key].reader_info.input);
          }
        }
      }
    }
  }

  if (data.new_access_points && Object.keys(data.new_access_points).length) {
    const new_ac_points = data.new_access_points;
    for (const key in new_ac_points) {
      const resources = new_ac_points[key].readers;
      if (resources && Object.keys(resources).length) {
        for (const key in resources) {
          if (
            key !== active_reader &&
            resources[key].reader_info &&
            "input" in resources[key].reader_info &&
            (!hasCompSource
              ? !resources[key].component_source
              : resources[key].component_source)
          ) {
            resourcesArr.push(resources[key].reader_info.input);
          }
        }
      }
    }
  }
  return resourcesArr;
};

const checkInput = (access_points, active_reader) => {
  const resources = [];
  if (access_points && Object.keys(access_points).length) {
    for (const key in access_points) {
      const readers = access_points[key].readers;
      if (readers && Object.keys(readers).length) {
        for (const keys in readers) {
          if (
            keys !== active_reader &&
            readers[keys].reader_info &&
            "input" in readers[keys].reader_info
          ) {
            resources.push(readers[keys].reader_info.input);
          }
        }
      }
    }
  }
  return resources;
};

const checkLimitInput = (access_points) => {
  const resources = [];
  if (access_points && Object.keys(access_points).length) {
    for (const key in access_points) {
      const readers = access_points[key].readers;

      if (readers && Object.keys(readers).length) {
        for (const keys in readers) {
          if (
            readers[keys].reader_info &&
            "input" in readers[keys].reader_info
          ) {
            resources.push(readers[keys].reader_info.input);
          }
        }
      }
    }
  }
  return resources;
};

const checkDirPorts = (data, active_point, active_reader) => {
  const resourcesArr = [];
  const findAp = data.access_points.find((p) => p.id == +active_point);
  if (findAp && findAp.type == "turnstile_two_side") {
    if (findAp.new_readers && Object.keys(findAp.new_readers).length) {
      for (const key in findAp.new_readers) {
        if (findAp.new_readers[key].id != active_reader) {
          if (
            findAp.new_readers[key].reader_info &&
            "direction" in findAp.new_readers[key].reader_info
          ) {
            const dir = findAp.new_readers[key].reader_info.direction;
            if (Number.isInteger(dir)) {
              resourcesArr.push(+dir);
            }
          }
        }
      }
    }

    if (findAp.readers && findAp.readers.length) {
      for (let i = 0; i < findAp.readers.length; i++) {
        if (
          findAp.readers[i].id != +active_reader &&
          !findAp.readers[i].deleted
        ) {
          if (findAp.readers[i] && "direction" in findAp.readers[i]) {
            const dir = findAp.readers[i].direction;
            if (Number.isInteger(dir)) {
              resourcesArr.push(+dir);
            }
          }
        }
      }
    }
  } else if (
    data.new_access_points &&
    Object.keys(data.new_access_points).length
  ) {
    const findAp = data.new_access_points[active_point];

    if (
      findAp &&
      findAp.real_type == "turnstile_two_side" &&
      findAp.readers &&
      Object.keys(findAp.readers).length
    ) {
      for (const key in findAp.readers) {
        if (findAp.readers[key].id != active_reader) {
          if (
            findAp.readers[key].reader_info &&
            "direction" in findAp.readers[key].reader_info
          ) {
            const dir = findAp.readers[key].reader_info.direction;
            resourcesArr.push(+dir);
          }
        }
      }
    }
  }
  return resourcesArr;
};

const checkAddDirPorts = (data, active_point, active_reader) => {
  const resourcesArr = [];
  const findAp = data.access_points[active_point];
  if (findAp && findAp.real_type == "turnstile_two_side") {
    if (findAp.readers && Object.keys(findAp.readers).length) {
      for (const key in findAp.readers) {
        if (findAp.readers[key].id != active_reader) {
          if (
            findAp.readers[key].reader_info &&
            "direction" in findAp.readers[key].reader_info
          ) {
            const dir = findAp.readers[key].reader_info.direction;
            if (Number.isInteger(dir)) {
              resourcesArr.push(+dir);
            }
          }
        }
      }
    }
  }
  return resourcesArr;
};

const checkPorts = (data, active_reader) => {
  const resourcesArr = [];
  if (data.access_points.length) {
    for (let i = 0; i < data.access_points.length; i++) {
      const readers = data.access_points[i].readers;
      const new_readers = data.access_points[i].new_readers;

      if (readers && readers.length) {
        for (let i = 0; i < readers.length; i++) {
          if (readers[i].id != +active_reader) {
            resourcesArr.push(readers[i].port);
          }
        }
      }

      if (new_readers && Object.keys(new_readers).length) {
        for (const key in new_readers) {
          if (
            key !== active_reader &&
            reader_type[new_readers[key].name] &&
            "port" in new_readers[key].reader_info
          ) {
            resourcesArr.push(new_readers[key].reader_info.port);
          }
        }
      }
    }
  }

  if (data.new_access_points && Object.keys(data.new_access_points).length) {
    const new_ac_points = data.new_access_points;
    for (const key in new_ac_points) {
      const readers = new_ac_points[key].readers;
      if (readers && Object.keys(readers).length) {
        for (const key in readers) {
          if (
            key !== active_reader &&
            readers[key].reader_info &&
            "port" in readers[key].reader_info
          ) {
            resourcesArr.push(readers[key].reader_info.port);
          }
        }
      }
    }
  }
  return resourcesArr;
};

export {
  checkOutput,
  checkInput,
  checkLimitInput,
  checkOutputArr,
  checkInputArr,
  checkPorts,
  checkDirPorts,
  checkAddDirPorts
};
