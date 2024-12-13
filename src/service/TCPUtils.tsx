import { Alert } from "react-native";
import { useChunkStore } from "../database/chunkStore";
import { produce } from "immer";

export const receiveFileAck = async (data: any, socket: any, setReceivedFiles: any) => {
    const { setChunkStore, chunkStore } = useChunkStore.getState();
    if (chunkStore) {
        Alert.alert('File already exists');
        return;
    }
    setReceivedFiles((prev: any) => 
        produce(prev, (draft: any) => {
            draft.push(data);
        })
    );

    setChunkStore({
        id: data.id,
        totalChunks: data?.totalChunks,
        name: data?.name,
        size: data?.size,
        mimeType: data?.mimeType,
        chunkArray: [],
    });

    if (!socket) {
        console.error('socket not found');
        return;
    }
    try {
        await new Promise((resolve) => setTimeout(resolve, 10));
        const chunkNo = 0; // Initialize chunkNo
        console.log('requested for next chunk ack', chunkNo + 1);
        socket.write(JSON.stringify({ event: 'send_chunk_ack', chunkNo: chunkNo + 1 }));
        console.log('requested for first chunk ack');
    } catch (error) {
        console.error('error sending file data', error);
    }
};

export const sendChunkAck = async (data: any, socket: any, setTotalSentBytes: any, setSentFiles: any) => {
    const { currentChunkSet, resetCurrentChunkSet } = useChunkStore.getState();
    if (!currentChunkSet) {
        console.error('no current chunk set');
        return;
    }
    if (!socket) {
        console.error('socket not found');
        return;
    }
    const totalChunks = currentChunkSet.totalChunks;
    try {
        await new Promise((resolve) => setTimeout(resolve, 10));
        console.log('sending next chunk');
        const chunkIndex = data.chunkNo;
        socket.write(JSON.stringify({ event: 'send_chunk_ack', chunk: currentChunkSet.chunkArray[chunkIndex].toString('base64'), chunkNo: data.chunkNo + 1 }));
        setTotalSentBytes((prev: number) => prev + currentChunkSet.chunkArray[chunkIndex].length);
        if (chunkIndex + 2 > totalChunks) {
            console.log('all chunk sent');
            setSentFiles((prev: any[]) =>
                produce(prev, (draftFiles: any[]) => {
                    const fileIndex = draftFiles.findIndex((file) => file.id === currentChunkSet.id);
                    if (fileIndex !== -1) {
                        draftFiles[fileIndex].available = true;
                    }
                })
            );
            resetCurrentChunkSet();
        }
    } catch (error) {
        console.error('error sending file data', error);
    }
};

export const receiveChunkAck = async (chunk: any, socket: any, chunkNo: any, setTotalReceivedBytes: any, generateFile: any) => {
    const { chunkStore, resetChunkStore, setChunkStore } = useChunkStore.getState();
    if (!chunkStore) {
        console.error('no chunk store found');
        return;
    }
    try {
        const bufferChunk = Buffer.from(chunk, 'base64');
        const updatedChunkStore = [...(chunkStore.chunkArray || [])];
        updatedChunkStore[chunkNo] = bufferChunk;
        setChunkStore({
            ...chunkStore,
            chunkArray: updatedChunkStore
        });
        setTotalReceivedBytes((prev: number) => prev + bufferChunk.length);
    } catch (error) {
        console.error('error sending file data and updating chunk', error);
    }
    if (!socket) {
        console.error('socket not found');
        return;
    }
    if (chunkNo + 1 === chunkStore?.totalChunks) {
        console.log('all chunks received');
        generateFile();
        resetChunkStore();
        return;
    }
    try {
        await new Promise((resolve) => setTimeout(resolve, 10));
        socket.write(JSON.stringify({ event: 'send_chunk_ack', chunkNo: chunkNo + 1 }));
    } catch (error) {
        console.error('error sending file data', error);
    }
};