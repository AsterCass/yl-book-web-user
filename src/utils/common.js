const audioContext = new window.AudioContext();

export function rawPCMToAudioBuffer(arrayBuffer, sampleRate = 24000) {
    const pcmData = new Int16Array(arrayBuffer);
    const float32Data = new Float32Array(pcmData.length);

    // int16 -> float32 归一化（这是最快的转换）
    for (let i = 0; i < pcmData.length; i++) {
        float32Data[i] = pcmData[i] / 32768;
    }

    const audioBuffer = audioContext.createBuffer(1, float32Data.length, sampleRate);
    audioBuffer.copyToChannel(float32Data, 0);
    return audioBuffer;
}

export function checkLoginFromCookie() {
    const token = getCookie('YToken')
    return !!token;
}

export function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
}

export function deleteCookie(name = 'YToken') {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

