export function clickRecursive(element) {
    if (element && typeof element.click === 'function') {
        element.click();
    } else if (element && element.parentElement) {
        clickRecursive(element.parentElement);
    }
}


export const handleClickWithHttpResourceOrMiddle = (x,event,navigate) => {
    if (x?.url) {
        const isExternalLink = x.url.startsWith('http://') || x.url.startsWith('https://');
        const isCtrlOrMiddleClick = event.ctrlKey || event.metaKey  ||event.button === 1;

        if (isExternalLink || isCtrlOrMiddleClick) {
            // Открываем ссылку в новой вкладке
            window.open(x.url, '_blank');
        } else {
            navigate(x.url)
        }
    }
};