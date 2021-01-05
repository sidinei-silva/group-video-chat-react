import { joinRoom } from './websocket';

let Peer;
let myPeer;

const peerHost = process.env.PEER_URL;
const peerPort = process.env.PEER_PORT || 5000;

const createMyPeer = () => {
  if (typeof window !== 'undefined') {
    const { Peer: PeerGlobal }: any = window;
    Peer = PeerGlobal;
    const securePeer = peerPort === '443';
    // myPeer = new Peer(undefined, {
    //   path: '/peerjs',
    //   host: peerHost,
    //   port: peerPort,
    //   secure: securePeer,
    //   debug: 3,
    //   config: {
    //     iceServers: [
    //       { url: 'stun:108.177.98.127:19302' },
    //       { url: 'stun:stun.l.google.com:19302' },
    //       {
    //         url: 'turn:numb.viagenie.ca',
    //         credential: 'muazkh',
    //         username: 'webrtc@live.com',
    //       },
    //     ],
    //   },
    // });
    myPeer = new Peer(null, { debug: 1 });
  }
};

export const showPeer = () => {
  return myPeer;
};

export const openPeer = ({ room, name }) => {
  createMyPeer();

  if (myPeer) {
    myPeer.on('open', id => {
      joinRoom(room, id, name);
    });
  }
};

export const subscribeCall = callback => {
  myPeer.on('call', call => {
    return callback(null, call);
  });

  return false;
};

export const peerCall = (userId, stream) => {
  return myPeer.call(userId, stream);
};

export const myPeerId = () => {
  return myPeer.id;
};
