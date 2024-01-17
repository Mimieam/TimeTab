export function msToTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) {
        if (hours > 0) {
            return `${days} day${days > 1 ? 's' : ''} and ${hours} hr${hours > 1 ? 's' : ''} ago`;
        }
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    if (hours > 0) {
        if (minutes > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} and ${minutes} min${minutes > 1 ? 's' : ''} ago`;
        }
        return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    }

    if (minutes > 0) {
        if (seconds > 0) {
            return `${minutes} min${minutes > 1 ? 's' : ''} and ${seconds} sec${seconds > 1 ? 's' : ''} ago`;
        }
        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }

    if (seconds > 0) {
        return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
    }

    return '...';
}

export function trimTimeString(_str) {
    return _str.replaceAll(' ', '')
        .replaceAll('and', '').replaceAll('ago', '')
        .replace('days', 'd ').replace('day', 'd ')
        .replace('hrs', 'h').replace('hr', 'h')
        .replace('mins', 'm').replace('min', 'm')
        .replace('secs', 's').replace('sec', 's')

}

export function elapsedTime(lastTime, minimized = false, truncate=false) {
    if (!lastTime){
        return null
    }
    const now = Date.now();
    const elapsed = now - lastTime;
    const timeString = msToTime(elapsed);
    let output = minimized ? trimTimeString(timeString) : timeString
    output = truncate ? output.substring(0,3): output
    return output
}

export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
            console.log('debounced')
            func.apply(this, args);
        }, delay);
    };
}

// https://gist.github.com/iperelivskiy/4110988
// https://www.partow.net/programming/hashfunctions/index.html
export const hashThis = function(s) {

    for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
        h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    return (h ^ h >>> 16) >>> 0;
};