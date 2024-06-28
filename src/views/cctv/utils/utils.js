export const isCreateCctvValid = (deviceData) => {
  if (
    !deviceData.name ||
    !deviceData.connection_type ||
    !deviceData.username ||
    !deviceData.password ||
    !deviceData.device_type
  ) {
    return false;
  }

  // Check the connection type and the corresponding fields
  if (deviceData.connection_type === "Cloud") {
    if (!deviceData.serial_number) {
      return false;
    }
  } else {
    if (!deviceData.domain || !deviceData.port) {
      return false;
    }
  }

  return true;
}
