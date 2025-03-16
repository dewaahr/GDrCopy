
function Get_Drive() {
  const sourceDriveID = DriveApp.getFolderById("15_Gis-ppEBHCS4cyyAygcZfmjkaxoVo9");
  const destinationDriveID = DriveApp.getFolderById("1m7b-1C71iLJ_-lgexg_s8UP0FyeYbOQV");

  console.log("Memulai proses sinkronisasi folder...");
  copyFolder(sourceDriveID, destinationDriveID);

  var sourceSize = getFolderSize(sourceDriveID);
  var destinationSize = getFolderSize(destinationDriveID);

  console.log(`Perbandingan Total Ukuran Folder:`);
  console.log(`📂 Sumber      : ${formatSize(sourceSize)}`);
  console.log(`📂 Tujuan      : ${formatSize(destinationSize)}`);

  if (sourceSize === destinationSize) {
    console.log("✅ Sinkronisasi selesai!");
  } else {
    console.log("⚠️ Failed.");
  }
}

function copyFolder(sourceFolder, destinationFolder) {
  var sourceFiles = sourceFolder.getFiles();
  var destinationFiles = destinationFolder.getFiles();
  var sourceFolders = sourceFolder.getFolders();
  var destinationFolders = destinationFolder.getFolders();

  var sourceFileCount = countItems(sourceFiles);
  var destinationFileCount = countItems(destinationFiles);
  var sourceFolderCount = countItems(sourceFolders);
  var destinationFolderCount = countItems(destinationFolders);

  console.log(`📂 Memeriksa folder: ${sourceFolder.getName()}`);
  console.log(`🔍 File: ${sourceFileCount} di sumber, ${destinationFileCount} di tujuan`);
  console.log(`🔍 Folder: ${sourceFolderCount} di sumber, ${destinationFolderCount} di tujuan`);

  if (sourceFileCount !== destinationFileCount || sourceFolderCount !== destinationFolderCount) {
    var files = sourceFolder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      if (!isFileExists(destinationFolder, file.getName())) {
        var newFile = file.makeCopy(destinationFolder);
        newFile.setName(file.getName());
        console.log(`✅ File dicopy: ${file.getName()} (${formatSize(file.getSize())})`);
      } else {
        console.log(`⚠️ File sudah ada: ${file.getName()}`);
      }
    }

    var folders = sourceFolder.getFolders();
    while (folders.hasNext()) {
      var folder = folders.next();
      if (!isFolderExists(destinationFolder, folder.getName())) {
        var newFolder = destinationFolder.createFolder(folder.getName());
        console.log(`📂 Folder dibuat: ${folder.getName()}`);
        copyFolder(folder, newFolder);
      } else {
        console.log(`⚠️ Folder sudah ada: ${folder.getName()}`);
      }
    }
  } else {
    console.log(`✅ Folder ${sourceFolder.getName()} sudah sinkron.`);
  }
}

function countItems(iterator) {
  var count = 0;
  while (iterator.hasNext()) {
    iterator.next();
    count++;
  }
  return count;
}

function isFileExists(destinationFolder, fileName) {
  var files = destinationFolder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getName() === fileName) {
      return true;
    }
  }
  return false;
}

function isFolderExists(destinationFolder, folderName) {
  var folders = destinationFolder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    if (folder.getName() === folderName) {
      return true;
    }
  }
  return false;
}

function getFolderSize(folder) {
  var totalSize = 0;
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    totalSize += file.getSize(); 
  }
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    totalSize += getFolderSize(folders.next()); 
  }
  return totalSize;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  let kB = bytes / 1024;
  if (kB < 1024) return kB.toFixed(2) + " KB";
  let MB = kB / 1024;
  if (MB < 1024) return MB.toFixed(2) + " MB";
  let GB = MB / 1024;
  return GB.toFixed(2) + " GB";
}
