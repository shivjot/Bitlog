
let peerConnection;
let dataChannel;
const chatLog = document.getElementById('chatLog');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const jsonBox = document.getElementById('jsonBox');

sendButton.onclick = () => {
  const message = messageInput.value;
  if (message && dataChannel && dataChannel.readyState === 'open') {
    dataChannel.send(message);
    chatLog.value += 'You: ' + message + '\n';
    messageInput.value = '';
  }
};

document.getElementById('createOfferBtn').onclick = async () => {
  peerConnection = new RTCPeerConnection();
  dataChannel = peerConnection.createDataChannel("chat");

  dataChannel.onmessage = (event) => {
    chatLog.value += 'Stranger: ' + event.data + '\n';
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate === null) {
      jsonBox.value = JSON.stringify(peerConnection.localDescription);
    }
  };
};

document.getElementById('acceptOfferBtn').onclick = async () => {
  peerConnection = new RTCPeerConnection();
  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    dataChannel.onmessage = (e) => {
      chatLog.value += 'Stranger: ' + e.data + '\n';
    };
  };

  const offer = JSON.parse(jsonBox.value);
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate === null) {
      jsonBox.value = JSON.stringify(peerConnection.localDescription);
    }
  };
};

document.getElementById('acceptAnswerBtn').onclick = async () => {
  const answer = JSON.parse(jsonBox.value);
  await peerConnection.setRemoteDescription(answer);
};
