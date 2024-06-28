const treeData = function (array) {
  let filterData = [];
  if (array.length) {
    array.forEach((item) => {
      let obj = {};
      obj.data = item;
      obj.id = typeof item.id == 'string' ? item.id : String(item.id);
      obj.name = item.name;

      obj.item_type = item.item_type;

      let hasChild = array.filter((a) => a.parent_id == item.id);
      if (hasChild.length) {
        obj.hasChild = true;
      }
      if (item.hasAttribute) {
        obj.hasAttribute = item.hasAttribute
      }

      if (item.parent_id) {
        obj.pid = item.parent_id;
      }
      if (item.pid) {
        obj.pid = item.pid;
      }

      if (item.expanded) {
        obj.expanded = true;
      }

      filterData.push(obj);
    });
    return filterData;
  }
}

const zoneTree = function(groups) {
  var map = {},
  node,
  roots = [],
  i;

for (i = 0; i < groups.length; i += 1) {
  map[groups[i].id] = i;
  let filter = groups.filter((g) => g.parent_id == groups[i].id);
  if (filter && filter.length) {
    groups[i].children = [];
  }
}

for (i = 0; i < groups.length; i += 1) {
  groups[i].label = groups[i].name;
  node = groups[i];
  if (node.parent_id != null) {
    groups[map[node.parent_id]].children.push(node);
  } else {
    roots.push(node);
  }
}
 return  roots;
}


export { treeData, zoneTree };