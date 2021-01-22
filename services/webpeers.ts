import { joinRoom } from './websocket';

let Peer;
let myPeer;

const peerHost = process.env.PEER_URL;
const peerPort = process.env.PEER_PORT || 5000;

const stunServer = process.env.STUN_SERVER;
const turnServer = process.env.TURN_SERVER;
const turnUsername = process.env.TURN_USERNAME;
const turnCredential = process.env.TURN_CREDENTIAL;

const createMyPeer = () => {
  if (typeof window !== 'undefined') {
    const { Peer: PeerGlobal }: any = window;
    Peer = PeerGlobal;

    const securePeer = peerHost !== 'localhost';

    const optionsPeer = {
      debug: 0,
      path: '/peerjs',
      host: peerHost,
      port: peerPort,
      secure: securePeer,
      config: {
        iceServers: [],
      },
    };

    if (stunServer) {
      optionsPeer.config.iceServers.push({ url: stunServer });
    }

    if (turnServer) {
      optionsPeer.config.iceServers.push({
        url: turnServer,
        username: turnUsername,
        credential: turnCredential,
      });
    }

    myPeer = new Peer(null, optionsPeer);
  }
};

export const showPeer = () => {
  if (myPeer) {
    return myPeer;
  }
  return false;
};

export const openPeer = ({ room, name }) => {
  createMyPeer();

  if (myPeer) {
    myPeer.on('open', id => {
      joinRoom(room, id, name);
    });
  }
  return false;
};

export const subscribeCall = callback => {
  if (myPeer) {
    myPeer.on('call', call => {
      return callback(null, call);
    });
  }

  return false;
};

export const peerCall = (userId, stream) => {
  return myPeer.call(userId, stream);
};

export const peerDataConnect = (userId, name) => {
  return myPeer.connect(userId, { label: name });
};

export const subscribePeerDataConnect = callback => {
  if (myPeer) {
    return myPeer.on('connection', conn => {
      return callback(null, conn);
    });
  }

  return false;
};

export const myPeerId = () => {
  if (myPeer) {
    return myPeer.id;
  }
  return false;
};

export const subscribeError = callback => {
  if (myPeer) {
    return myPeer.on('error', errorPeer => {
      return callback(null, errorPeer);
    });
  }

  return false;
};
