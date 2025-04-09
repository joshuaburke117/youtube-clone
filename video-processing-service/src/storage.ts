// 1. GCS file interactions
// 2. local file interactions


import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";
import { resolve } from "path";
import { rejects } from "assert";


const storage = new Storage();

const rawVideoBucketName = "jb117-yt-raw-videos";
const processedVideoBucketName = "jb117-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";
/**
 * Creates the local directories for raw and processed videos.
 */

export function setupDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);

}

/**
 *  @param rawVideoName  - The name of the file to conver from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localPrcessedVideoPath}
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve,reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf","scale =-1:360")
        .on("end",()=>{
            console.log("processing finished successfully.");
            resolve();
        })
        .on("error",(err)=>{
            console.log(`An error occurred: ${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })
    
}


/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} folder into the {@link localRawVideoPath}
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(filename: string){
    await storage.bucket(rawVideoBucketName)
        .file(filename)
        .download({destination: `${localRawVideoPath}/${filename}`});
    
    console.log(
        `gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}.`
    );
}

/**
 * @param fileName - the name of the file to upload from the
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(filename: string){
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${filename}`,{
        destination: filename

    });
    console.log( `gs://${localProcessedVideoPath}/${filename} uploaded to ${processedVideoBucketName}/${filename}.`);

    await bucket.file(filename).makePublic();
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteRawVideo(fileName: string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);

}

/**
 * @param fileName - The name of the file to delete from the 
 * {@link localPrcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteProcessedVideo(fileName: string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


/**
 * @param filepath - The path of the file to delete
 * @returns A promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string):Promise<void>{
    return new Promise((resolve,reject)=>{
        if (!fs.existsSync(filePath)){
            fs.unlink(filePath,(err)=>{
                if (err){
                    console.log(`Failed to delete the file at ${filePath}`,err);
                }else{
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
                

            })
        }else{
            console.log(`FIle not found at ${filePath}, skipping the delete.`);
            resolve();
        }
    });
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check
 */
function ensureDirectoryExistence(dirPath: string){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive: true}); // recursive : true enables creating nested directories
        console.log(`Directory created at ${dirPath}`);
    }
}