import { Injectable } from '@angular/core';
import { FilesystemDirectory, Plugins } from "@capacitor/core";

const { Filesystem } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FileWriterService {

  constructor() { }

  async saveTemporaryImage(temporaryImageUri: string) {
    const readFile =  await Filesystem.readFile({
      path: temporaryImageUri
    });

    let savedFile = await Filesystem.writeFile({
      path: new Date().getTime() + '.jpeg',
      data: readFile.data,
      directory: FilesystemDirectory.Data
    });
    return savedFile.uri;
  }
}
