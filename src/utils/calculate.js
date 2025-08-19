export const calculateTextHeight = (text, width, styles) => {
    // Создаем временный canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Применяем стили
    context.font = `${styles.fontSize}px ${styles.fontFamily}`;

    // Разбиваем текст на слова
    const words = text.split(' ');
    let line = '';
    let lines = 1;

    // Проходим по всем словам
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > width && i > 0) {
            line = words[i] + ' ';
            lines++;
        } else {
            line = testLine;
        }
    }

    // Вычисляем итоговую высоту
    return lines * styles.lineHeight + (styles.padding * 2);
};

