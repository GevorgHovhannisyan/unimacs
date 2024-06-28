var ValidateIPaddress = function (ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return true
    }
    return false
}

var ValidatePinnPass = function (ipaddress) {
  if (/^\d{4,8}$/.test(ipaddress)) {
      return true
  }
  return false
}

export { ValidateIPaddress, ValidatePinnPass };

