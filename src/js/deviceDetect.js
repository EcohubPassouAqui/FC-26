function detectDeviceType() {
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hasNoHover = window.matchMedia('(hover: none)').matches;
    const isSmallScreen = window.innerWidth <= 1024;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const isTouch = (hasCoarsePointer || hasNoHover) && (isTouchDevice || isSmallScreen);

    return isTouch ? 'touch' : 'desktop';
}

function applyDeviceClass() {
    if (!document.body) {
        document.addEventListener('DOMContentLoaded', applyDeviceClass);
        return;
    }
    const deviceType = detectDeviceType();
    document.body.classList.remove('device-desktop', 'device-touch');
    document.body.classList.add(deviceType === 'touch' ? 'device-touch' : 'device-desktop');
    document.body.setAttribute('data-device', deviceType);
}

applyDeviceClass();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyDeviceClass, 200);
});