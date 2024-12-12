import { Alert } from "react-native"
import { useChunkStore } from "../database/chunkStore"
import { current, produce } from "immer"

export const recieveFileAck = async (data: any, socket: any, setRecievedFiles: any) => {
    const { setChunkStore, chunkStore } = useChunkStore.getState()
    if (chunkStore) {
        Alert.alert('File already exists')
        return
    }
    setRecievedFiles((prev: any) => {
        produce(prev, (draft: any) => {
            draft.push(data)
        })
    })


    setChunkStore({
        id: data.id,
        totalChunks: data?.totalChunks,
        name: data?.name,
        size: data?.size,
        mimeType: data?.mimeType,
        chunkArray: [],
    })


    if (!socket) {
        console.error('socket not found')
        return
    }
    try {
        await new Promise((resolve) => setTimeout(resolve, 100))
        console.log('recieved file ack')
        socket.write(JSON.stringify({ event: 'send_chunk_ack', chunkNo: 0 }))
        console.log('requested for first  chunk ack')

    } catch (error) {
        console.error('error sending file data', error);
    }


}


export const sendChunkAck = async (data: any, socket: any, setTotalSentBytes: any, setSentFiles:any)=>{
    const { currentChunkSet, resetCurrentChunkSet } = useChunkStore.getState()
    if(!currentChunkSet){
        console.error('no current chunk set')
        return
    }
    if(!socket){
        console.error('socket not found')
        return
    }
    const totalChunks = currentChunkSet.totalChunks
    try{
        await new Promise((resolve) => setTimeout(resolve, 100))
       
            console.log('sending next chunk')
            const chunkIndex = data.chunkNo;
            socket.write(JSON.stringify({event:'send_chunk_ack', chunk: currentChunkSet.chunkArray[chunkIndex].toString('base64'), chunkNo: data.chunkNo+1}))   
        setTotalSentBytes((prev: number) => prev + currentChunkSet.chunkArray[chunkIndex].length)   
        if(chunkIndex+2>totalChunks){
            console.log('all chunk sent')
            setSentFiles((prevdile: any[]) => 
                produce(prevdile, (draftFiles: any[]) => {
                  const fileIndex = draftFiles.findIndex((file) => file.id === currentChunkSet.id);
                  if(fileIndex !== -1){
                      draftFiles[fileIndex].available = true;

                  }
                })
            );
            resetCurrentChunkSet()
        }
       
                
            
    }catch(error){  
        console.error('error sending file data', error);
    }
}

export const recieveChunkAck = async (chunk: any, socket: any, chunkNo: any,setTotalRecievedBytes:any, generateFile: any) => {

}