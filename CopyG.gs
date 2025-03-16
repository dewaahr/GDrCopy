function Get_Drive(){
  const sourceDriveID = DriveApp.getFolderById("") //
  const destinationDriveID = DriveApp.getFolderById("") 
  copyFolder(sourceDriveID,destinationDriveID)
}

function copyFolder(sourceFolder, destinationFolder) {
  var files = sourceFolder.getFiles()
  
  while (files.hasNext()) {
    var file = files.next();
    var newFile = file.makeCopy(destinationFolder)
    newFile.setName(file.getName())
  }

  var folders = sourceFolder.getFolders()
  while (folders.hasNext()) {
    var folder = folders.next()
    var newFolder = destinationFolder.createFolder(folder.getName())
    copy(folder, newFolder)
  }
}

