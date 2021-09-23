export function formatTime(time: number | undefined) {
    if (time === undefined) {
        return
    }
    return time.toLocaleString('en', { minimumIntegerDigits: 2})
}