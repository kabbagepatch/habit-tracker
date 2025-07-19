export function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculateStreak(checkInMasks: { [key: string]: string }): number {
    const date = new Date();
    if (!checkInMasks || !checkInMasks[date.getFullYear()]) return 0;
    const year = date.getFullYear();
    const mask = checkInMasks[year];
    if (!mask) return 0;

    let streak = 0;
    for (let i = getDayOfYear(date); i > 0; i--) {
        if (mask[i - 1] === '1') {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}
