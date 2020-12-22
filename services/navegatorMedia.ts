export const getMyMediaWebCam = callback => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(stream => {
      return callback(null, stream);
    });
};
