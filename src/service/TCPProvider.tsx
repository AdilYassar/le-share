import React, { createContext, FC, useContext, ReactNode, useState, useCallback } from "react";
import { useChunkStore } from "../database/chunkStore";
import TcpSocket from 'react-native-tcp-socket';
import Socket from "react-native-tcp-socket/lib/types/Socket";
import DeviceInfo from "react-native-device-info";
import { Alert, Platform } from "react-native";
import { Buffer } from "buffer";
import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { produce } from 'immer';
import { receiveChunkAck, receiveFileAck, sendChunkAck } from "./TCPUtils";

interface TCPContextType {
    server: any;
    client: any;
    isConnected: boolean;
    connectedDevice: any;
    sentFiles: any[];
    recievedFiles: any[];
    totalSentBytes: number;
    totalRecievedBytes: number;
    startServer: (port: number) => void;
    connectToServer: (host: string, port: number, deviceName: string) => void;
    sendMessages: (message: string | Buffer) => void;
    sendFileAck: (file: any, type: 'file' | 'image') => void;
    disconnect: () => void;
}

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTcp = (): TCPContextType => {
    const context = useContext(TCPContext);
    if (!context) {
        throw new Error('useTcp must be used within a TCPProvider');
    }
    return context;
}

const options = {
    keystore: require('../../tls_certs/server-keystore.p12')
}

export const TCPProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [server, setServer] = useState<Socket | TcpSocket.TLSServer | null>(null);
    const [client, setClient] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [serverSocket, setServerSocket] = useState<any>(null);
    const [connectedDevice, setConnectedDevice] = useState<any>(null);
    const [sentFiles, setSentFiles] = useState<any[]>([]);
    const [recievedFiles, setRecievedFiles] = useState<any[]>([]);
    const [totalSentBytes, setTotalSentBytes] = useState<number>(0);
    const [totalRecievedBytes, setTotalRecievedBytes] = useState<number>(0);

    const { setChunkStore, currentChunkSet, setCurrentChunkSet } = useChunkStore();

    const startServer = useCallback((port: number) => {
        if (server) {
            return;
        }
        const newServer = TcpSocket.createTLSServer(options, (socket: any) => {
            console.log('server connected');
            setServerSocket(socket);
            socket.setNoDelay(true);
            socket.readableHighWaterMark = 1024 * 1024 * 1;
            socket.writableHighWaterMark = 1024 * 1024 * 1;
            socket.on('data', async (data: any) => {
                console.log('server data', data.toString());
                const parsedData = JSON.parse(data.toString());
                if (parsedData.event === 'connect') {
                    setConnectedDevice(parsedData?.deviceName);
                    setIsConnected(true);
                }
                if (parsedData.event === 'file_ack') {
                    receiveFileAck(parsedData.file, socket, setRecievedFiles);
                }
                if (parsedData.event === 'send_chunk') {
                    sendChunkAck(parsedData.chunk, socket, parsedData.chunkNo, setTotalRecievedBytes);
                }
                if (parsedData.event === 'receive_chunk_ack') {
                    receiveChunkAck(parsedData.chunk, socket, parsedData.chunkNo, setTotalSentBytes, generateFile);
                }
            });
            socket.on('close', () => {
                console.log('server closed');
                setRecievedFiles([]);
                setTotalRecievedBytes(0);
                setSentFiles([]);
                setCurrentChunkSet(null);
                setChunkStore(null);
                setIsConnected(false);
                disconnect();
            });
            socket.on('error', (error: any) => {
                console.log('server error', error);
            });
        });
        newServer.listen({ port: port, host: '0.0.0.0' }, () => {
            const address = newServer.address();
            console.log('server listening on address', address);
        });
        newServer.on('error', (error: any) => { console.error('server error', error); });

        setServer(newServer);
    }, [server]);

    const connectToServer = useCallback((host: string, port: number, deviceName: string) => {
        if (client) {
            return;
        }
        const newClient = TcpSocket.connectTLS({ port: port, host: host, cert: true, ca: require('../../tls_certs/server-cert.pem') }, () => {
            setConnectedDevice(deviceName);
            const myDeviceName = DeviceInfo.getDeviceNameSync();
            console.log('client connected');
            newClient.setNoDelay(true);
            newClient.write(JSON.stringify({ deviceName: myDeviceName, event: 'connect' }));
            setIsConnected(true);
            newClient.readableHighWaterMark = 1024 * 1024 * 1;
            newClient.writableHighWaterMark = 1024 * 1024 * 1;
        });
        newClient.on('data', async (data: any) => {
            const parsedData = JSON.parse(data?.toString());
            console.log('client data', data.toString());
            if (data.toString().includes('file')) {
                const file = JSON.parse(data.toString());
                setRecievedFiles((prev) => [...prev, file]);
                setTotalRecievedBytes((prev) => prev + file.size);
            }
            if (parsedData.event === 'file_ack') {
                receiveFileAck(parsedData.file, newClient, setRecievedFiles);
            }
            if (parsedData.event === 'send_chunk') {
                sendChunkAck(parsedData.chunk, newClient, parsedData.chunkNo, setTotalRecievedBytes);
            }
            if (parsedData.event === 'receive_chunk_ack') {
                receiveChunkAck(parsedData.chunk, newClient, parsedData.chunkNo, setTotalSentBytes, generateFile);
            }
        });
        newClient.on('close', () => {
            console.log('client closed');
            setRecievedFiles([]);
            setTotalRecievedBytes(0);
            setSentFiles([]);
            setCurrentChunkSet(null);
            setChunkStore(null);
            setIsConnected(false);
        });
        newClient.on('error', (error: any) => {
            console.log('client error', error);
        });
        setClient(newClient);
    }, [client]);

    const disconnect = useCallback(() => {
        if (server) {
            if (server instanceof TcpSocket.TLSServer) {
                server.close();
            }
            setServer(null);
        }
        if (client) {
            client.destroy();
            setClient(null);
        }
        setRecievedFiles([]);
        setTotalRecievedBytes(0);
        setSentFiles([]);
        setCurrentChunkSet(null);
        setChunkStore(null);
        setIsConnected(false);
    }, [server, client]);

    const sendMessages = useCallback((message: string | Buffer) => {
        if (client) {
            client.write(JSON.stringify({ message }));
            console.log('message sent from client');
        } else if (server) {
            serverSocket.write(JSON.stringify({ message }));
            console.log('message sent from server');
        } else {
            console.error('no client or server connected');
        }
    }, [client, server]);

    const sendFileAck = async (file: any, type: 'file' | 'image') => {
        if (currentChunkSet !== null) {
            Alert.alert('Please wait for the current file to finish sending');
            return;
        }
        const normalizedPath = Platform.OS === 'ios' ? file?.uri?.replace('file://', '') : file?.uri;
        const fileData = await RNFS.readFile(normalizedPath, 'base64');
        const buffer = Buffer.from(fileData, 'base64');
        const CHUNK_SIZE = 1024 * 8;
        let totalChunks = 0;
        let chunkArray = [];
        let offset = 0;

        while (offset < buffer.length) {
            const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
            chunkArray.push(chunk);
            offset += chunk.length;
        }

        const rawData = {
            id: uuidv4(),
            name: type === 'file' ? file?.name : file?.filename,
            size: type === 'file' ? file?.size : file?.fileSize,
            mimeType: type === 'file' ? 'file' : '.jpg',
            totalChunks
        };
        setCurrentChunkSet({ id: rawData.id, totalChunks, chunkArray });

        setSentFiles((prevData: any[]) =>
            produce(prevData, (draft: any[]) => {
                draft.push({
                    ...rawData,
                    uri: file.uri,
                });
            })
        );

        const socket = client || serverSocket;
        if (!socket) {
            return;
        }
        try {
            socket.write(JSON.stringify({ event: 'file_ack', file: rawData }));
            console.log('file data sent ack');
        } catch (error) {
            console.error('error sending file data', error);
        }
        totalChunks = chunkArray.length;
    };

    const generateFile = async (chunk: any, chunkNo: number) => {
        const { chunkStore, resetChunkStore } = useChunkStore.getState();
        if (!chunkStore) {
            console.error('no chunk store found');
            return;
        }
        if (chunkStore?.totalChunks !== chunkStore.chunkArray.length) {
            console.error('chunk array length does not match total chunks');
        }
        try {
            const combinedChunks = Buffer.concat(chunkStore.chunkArray);
            const platformPath = Platform.OS == 'ios' ? `${RNFS.DownloadDirectoryPath}` : `${RNFS.DocumentDirectoryPath}`;
            const filePath = `${platformPath}/${chunkStore.name}`;
            await RNFS.writeFile(filePath, combinedChunks?.toString('base64'), 'base64');
            setRecievedFiles((prev: any[]) =>
                produce(prev, (draft: any[]) => {
                    const fileIndex = draft?.findIndex((f: any) => f.id === chunkStore.id);
                    if (fileIndex !== -1) {
                        draft[fileIndex] = {
                            ...draft[fileIndex],
                            uri: filePath,
                            available: true
                        };
                    }
                })
            );
            console.log('file saved successfully', filePath);
            resetChunkStore();
        } catch (error) {
            console.log('error combining Chunks or saving file', error);
        }
    };

    return (
        <TCPContext.Provider value={{
            server,
            client,
            isConnected,
            connectedDevice,
            sentFiles,
            recievedFiles,
            totalSentBytes,
            totalRecievedBytes,
            startServer,
            connectToServer,
            disconnect,
            sendMessages,
            sendFileAck
        }}>
            {children}
        </TCPContext.Provider>
    );
};