const FileSaver = require("file-saver");

export const screenShot = (imgData) => {



  var arr = imgData.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], "screen", { type: mime });
  FileSaver.saveAs(file, "myFile.png");

  return {file}
};
