import { httpsCallable} from 'firebase/functions';
import { functions } from './firebase';



const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
    id?:string,
    uid?:string,
    filename?:string,
    status?: "processing"| "processed",
    title?: string,
    description?: string
}

type UploadUrlResponse = {
    data: {
      url: string;
    };
  };

export async function uploadVideo (file: File){
    const response = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    })as UploadUrlResponse;

    //Upload the file via the signed url
    await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-type' : file.type
        }
    });

    return;
}


export async function getVideos(){
    const response =  await getVideosFunction();
    return response.data as Video[];
}